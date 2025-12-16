import React, { useRef, useEffect } from "react";

interface MatrixRainProps {
  onComplete: () => void;
}

const chars =
  "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const MatrixRain: React.FC<MatrixRainProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const fontSize = 18;
    let cols = Math.floor(w / fontSize);
    const rows = Math.ceil(h / fontSize);
    let ypos = Array.from({ length: cols }, () =>
      Math.floor(Math.random() * rows)
    );
    const total = 2000;          // total animation = 2s
    const blankDur = 100;        // 0–100ms: blank
    const rainDur = 600;        // 100–1700ms: rain
    const flashDur = 300;        // 1700–2000ms: flash

    const start = performance.now();
    let rafId: number;

    function tick(now: number) {
      const elapsed = now - start;

      if (elapsed < blankDur) {
        // BLANK PHASE
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);

      } else if (elapsed < blankDur + rainDur) {
        // MATRIX RAIN PHASE
        // fade trails
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, w, h);

        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = "#0F0";

        for (let i = 0; i < cols; i++) {
          const char = chars.charAt(Math.floor(Math.random() * chars.length));
          const x = i * fontSize;
          const y = ypos[i] * fontSize;
          ctx.fillText(char, x, y);

          // reset to top randomly after it goes off bottom
          if (y > h && Math.random() > 0.975) {
            ypos[i] = 0;
          } else {
            ypos[i]++;
          }
        }

      } else if (elapsed < blankDur + rainDur + flashDur) {
        // FLASH PHASE
        const t = elapsed - (blankDur + rainDur);
        const p = t / flashDur;               // 0→1
        const maxR = Math.hypot(w, h) / 2;    // enough to cover
        const r = p * maxR;

        // clear to black first
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);

        // inside your flash phase, instead of white:
        const grad = ctx.createRadialGradient(
          w/2, h/2, 0,
          w/2, h/2, r
        );
        // center is opaque aqua, edge fades to transparent
        grad.addColorStop(0, `rgba(240,255,255,${1 - p})`);
        grad.addColorStop(1, "rgba(20,255,255,0)");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

      } else {
        // DONE
        onComplete();
        return;
      }

      rafId = requestAnimationFrame(tick);
    }

    // kick off
    rafId = requestAnimationFrame(tick);

    // handle resize
    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      cols = Math.floor(w / fontSize);
      ypos = new Array(cols).fill(0);
    };
    window.addEventListener("resize", onResize);

    // cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
};

export default MatrixRain;
