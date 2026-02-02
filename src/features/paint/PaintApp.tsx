import { useEffect, useMemo, useRef, useState } from "react";
import "./paint.css";

type Tool = "pen" | "eraser";

export function PaintApp({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  const colors = useMemo(() => ["#ffffff", "#a7f3d0", "#93c5fd", "#fda4af", "#fde68a", "#c4b5fd"], []);
  const sizes = useMemo(() => [4, 8, 14], []);

  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState(sizes[1]);

  // 캔버스 초기화 + 화면 크기에 맞춰 선명하게
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const cssW = parent.clientWidth;
      const cssH = parent.clientHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 배경(투명 대신 약간 어두운 바탕)
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.restore();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // 도구/스타일 적용
  useEffect(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.lineWidth = size;

    if (tool === "pen") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    } else {
      // 지우개: 진짜로 지우기(투명)
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    }
  }, [tool, color, size]);

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = ctxRef.current;
    if (!ctx) return;

    drawingRef.current = true;
    lastRef.current = getPoint(e);

    // pointer capture: 드로잉이 캔버스 밖으로 나가도 계속 추적
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (!drawingRef.current) return;

    const p = getPoint(e);
    const last = lastRef.current;
    if (!last) {
      lastRef.current = p;
      return;
    }

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    lastRef.current = p;
  }

  function end() {
    drawingRef.current = false;
    lastRef.current = null;
  }

  function clearAll() {
		const ctx = ctxRef.current;
		const canvas = canvasRef.current;
		if (!ctx || !canvas) return;
	
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
	
		ctx.save();
		ctx.globalCompositeOperation = "source-over";
		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = "rgba(0,0,0,0.15)";
		ctx.fillRect(0, 0, w, h);
		ctx.restore();
	
		drawingRef.current = false;
		lastRef.current = null;
	}
	
  return (
    <div className="paint">
      <div className="paint__top">
        <button className="paint__back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="paint__title">DRAW</div>
        <button className="paint__ghost" onClick={clearAll}>
          Clear
        </button>
      </div>

      <div className="paint__toolbar">
        <div className="paint__group">
          <button
            className={`tool ${tool === "pen" ? "tool--active" : ""}`}
            onClick={() => setTool("pen")}
          >
            Pen
          </button>
          <button
            className={`tool ${tool === "eraser" ? "tool--active" : ""}`}
            onClick={() => setTool("eraser")}
          >
            Eraser
          </button>
        </div>

        <div className="paint__group">
          {sizes.map((s) => (
            <button
              key={s}
              className={`tool ${size === s ? "tool--active" : ""}`}
              onClick={() => setSize(s)}
              aria-label={`Brush size ${s}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="paint__colors">
        {colors.map((c) => (
          <button
            key={c}
            className={`swatch ${tool === "pen" && color === c ? "swatch--active" : ""}`}
            style={{ background: c }}
            onClick={() => {
              setTool("pen");
              setColor(c);
            }}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>

      <div className="paint__canvasWrap">
        <canvas
          ref={canvasRef}
          className="paint__canvas"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
        />
      </div>
    </div>
  );
}
