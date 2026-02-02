import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./intro.css";
import IntroHeroSection from "./IntroHeroSection";

type Props = {
  onDockStart: () => void;
  onFinished: () => void;
};

type Stage = "idle" | "rise" | "hold" | "dock" | "out";

const RISE_MS = 1200;
const HOLD_MS = 800;
const DOCK_MS = 2600;
const OUT_MS = 500;

const DESKTOP_DELAY_MS = 0;

const BLANKET_TEXT = "How are you doing? ";

export default function IntroOverlay({ onDockStart, onFinished }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const blanketRef = useRef<HTMLDivElement | null>(null);
  const blanketAnimatedRef = useRef(false);

  const [stage, setStage] = useState<Stage>("idle");
  const stageRef = useRef<Stage>("idle");

  const wheelSumRef = useRef(0);
  const dockStartedRef = useRef(false);
  const prevOverflowRef = useRef<string>("");

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onWheel = (e: WheelEvent) => {
      if (stageRef.current !== "idle") return;
      wheelSumRef.current += Math.abs(e.deltaY);
      if (wheelSumRef.current >= 1100) setStage("rise");
    };

    const onScroll = () => {
      if (stageRef.current !== "idle") return;
      if (scroller.scrollTop >= 260) setStage("rise");
    };

    scroller.addEventListener("wheel", onWheel, { passive: true });
    scroller.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.body.style.overflow = prevOverflowRef.current;
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    let t1: number | undefined;
    let t2: number | undefined;

    if (stage === "rise") t1 = window.setTimeout(() => setStage("hold"), RISE_MS);
    if (stage === "hold") t2 = window.setTimeout(() => setStage("dock"), HOLD_MS);

    return () => {
      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
    };
  }, [stage]);

  useLayoutEffect(() => {
    if (stage !== "rise") return;
    if (blanketAnimatedRef.current) return;
    blanketAnimatedRef.current = true;

    const blanket = blanketRef.current;
    if (!blanket) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const ctx = gsap.context(() => {
      const letters = blanket.querySelectorAll<HTMLElement>(".blanket__letter");
      if (!letters.length) return;

      gsap.set(letters, { opacity: 1 });

      if (reduceMotion) {
        gsap.set(letters, { yPercent: 0, clearProps: "transform" });
        return;
      }

      gsap.set(letters, { yPercent: -35 });

      gsap.to(letters, {
        yPercent: 0,
        duration: 1.6,
        ease: "power3.out",
        stagger: 0.06,
        clearProps: "transform",
      });
    }, blanket);

    return () => ctx.revert();
  }, [stage]);

  useEffect(() => {
    if (stage !== "dock") return;
    if (dockStartedRef.current) return;

    dockStartedRef.current = true;

    document.body.style.overflow = prevOverflowRef.current;

    const t = window.setTimeout(() => {
      onDockStart();
    }, DESKTOP_DELAY_MS);

    return () => window.clearTimeout(t);
  }, [stage, onDockStart]);

  const onBlanketTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    if (stageRef.current !== "dock") return;

    setStage("out");

    window.setTimeout(() => {
      onFinished();
    }, OUT_MS);
  };

  const rootClass =
    "intro" +
    ((stage === "dock" || stage === "out") ? " is-reveal" : "") +
    (stage === "out" ? " is-out" : "");

  const blanketClass =
    "intro__blanket" +
    (stage === "rise" || stage === "hold" ? " is-on" : "") +
    (stage === "dock" || stage === "out" ? " is-docked" : "");

  return (
    <div
      className={rootClass}
      style={{
        ["--rise-ms" as any]: `${RISE_MS}ms`,
        ["--dock-ms" as any]: `${DOCK_MS}ms`,
        ["--out-ms" as any]: `${OUT_MS}ms`,
      }}
      aria-label="intro"
    >
      <div ref={scrollerRef} className="intro__scroller">
        <IntroHeroSection />
      </div>

      <div
        ref={blanketRef}
        className={blanketClass}
        onTransitionEnd={onBlanketTransitionEnd}
        aria-label="blanket"
      >
        <p className="blanket__text" aria-hidden={stage === "dock" || stage === "out"}>
          {BLANKET_TEXT.split("").map((ch, i) => (
            <span key={i} className="blanket__letter">
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
