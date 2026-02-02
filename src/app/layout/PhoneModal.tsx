import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import "./phone.css";

export function PhoneModal({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const phoneRef = useRef<HTMLDivElement | null>(null);

  const dragRef = useRef({
    dragging: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  });

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const phone = phoneRef.current;
    if (!overlay || !phone) return;

    const placeCenter = () => {
      const ow = overlay.clientWidth;
      const oh = overlay.clientHeight;

      const pw = phone.offsetWidth;
      const ph = phone.offsetHeight;

      const left = Math.round((ow - pw) / 2);
      const top = Math.round((oh - ph) / 2);

      phone.style.left = `${Math.max(0, left)}px`;
      phone.style.top = `${Math.max(0, top)}px`;
    };

    placeCenter();
    const raf = requestAnimationFrame(placeCenter);

    return () => cancelAnimationFrame(raf);
  }, []);

  function isInteractive(el: HTMLElement) {
    return Boolean(
      el.closest(
        'button, a, input, textarea, select, option, label, canvas, [role="button"], [data-no-drag="true"]'
      )
    );
  }

  function onPointerDown(e: React.PointerEvent) {
    const overlay = overlayRef.current;
    const phone = phoneRef.current;
    if (!overlay || !phone) return;

    const target = e.target as HTMLElement;
    if (target.closest(".phone__screen") && isInteractive(target)) {
      return;
    }

    dragRef.current.dragging = true;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;

    dragRef.current.startLeft = parseFloat(phone.style.left || "0");
    dragRef.current.startTop = parseFloat(phone.style.top || "0");

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e: React.PointerEvent) {
    const overlay = overlayRef.current;
    const phone = phoneRef.current;
    const st = dragRef.current;
    if (!overlay || !phone) return;
    if (!st.dragging || st.pointerId !== e.pointerId) return;

    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;

    let nextLeft = st.startLeft + dx;
    let nextTop = st.startTop + dy;

    const maxLeft = overlay.clientWidth - phone.offsetWidth;
    const maxTop = overlay.clientHeight - phone.offsetHeight;

    nextLeft = clamp(nextLeft, 0, Math.max(0, maxLeft));
    nextTop = clamp(nextTop, 0, Math.max(0, maxTop));

    phone.style.left = `${nextLeft}px`;
    phone.style.top = `${nextTop}px`;
  }

  function endDrag(e: React.PointerEvent) {
    const st = dragRef.current;
    if (!st.dragging || st.pointerId !== e.pointerId) return;
    st.dragging = false;
    st.pointerId = -1;
  }

  return (
    <div
      ref={overlayRef}
      className="overlay"
      role="dialog"
      aria-modal="true"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <div
        ref={phoneRef}
        className="phone phone--draggable"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="phone__frame">
          <div className="phone__notch" />
          <div className="phone__screen">{children}</div>
          <div className="phone__homebar" />
        </div>
      </div>
    </div>
  );
}
