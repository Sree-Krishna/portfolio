import React, { useRef, useEffect, useState } from "react";
import GlowOverlay from "./GlowOverlay";
import MatrixMessage from "./MatrixMessage";
import useMatrixStyles from "./useMatrixStyles";

interface MatrixPillsProps {
  onComplete?: () => void;
}

const CHARACTERS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


function getRandomChar() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

function roundRectBottom(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y);
  ctx.closePath();
}

const MatrixPills: React.FC<MatrixPillsProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  useMatrixStyles();

  // Download resume from public/ without navigating away.
  async function downloadResume() {
    const url = "portfolio/Sree_Krishna_Resume.pdf";
    try {
      const resp = await fetch(url, { cache: "no-cache" });
      if (!resp.ok) throw new Error("Network response was not ok");
      const blob = await resp.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      console.log("Downloading resume from", url);
      a.href = objectUrl;
      a.download = "Sree_Krishna_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (e) {
      // fallback: open in new tab (doesn't navigate current page)
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  // Helper to get pill positions for rendering click areas
  function pillPositionsForRender() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let width, height;
    if (vw <= 400) {
      width = 52; height = Math.max(0.52 * vh, 120);
    } else if (vw <= 600) {
      width = 68; height = Math.max(0.52 * vh, 150);
    } else if (vw <= 900) {
      width = 85; height = Math.max(0.52 * vh, 320);
    } else {
      width = 90; height = Math.max(0.52 * vh, 420);
    }
    return [
      {
        x: vw * 0.25 - width / 2,
        y: vh / 2 - height / 2,
        width,
        height,
      },
      {
        x: vw * 0.75 - width / 2,
        y: vh / 2 - height / 2,
        width,
        height,
      },
    ];
  }

  // No automatic progression: user must click the red pill to advance.

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function getPillDimensions() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw <= 400) {
        return { width: 52, height: Math.max(0.52 * vh, 120) };
      } else if (vw <= 600) {
        return { width: 68, height: Math.max(0.52 * vh, 150) };
      } else if (vw <= 900) {
        return { width: 85, height: Math.max(0.52 * vh, 320) };
      } else {
        return { width: 90, height: Math.max(0.52 * vh, 420) };
      }
    }

    let animationId: number;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function getPillPositions() {
      const { width, height } = getPillDimensions();
      return [
        {
          x: canvas.width * 0.25 - width / 2,
          y: canvas.height / 2 - height / 2,
          color: "#00bfff",
          glowColor: "rgba(0,191,255,1)",
          width,
          height,
        },
        {
          x: canvas.width * 0.75 - width / 2,
          y: canvas.height / 2 - height / 2,
          color: "#ff1744",
          glowColor: "rgba(255,23,68,1)",
          width,
          height,
        },
      ];
    }

    function createRainState(pillWidth: number, pillHeight: number, verticalStep: number) {
      const columns = Math.floor(pillWidth / 10);
      return Array.from({ length: columns }, () => ({
        y: Math.random() * pillHeight,
        chars: Array.from(
          { length: Math.floor(pillHeight / verticalStep) },
          getRandomChar
        ),
      }));
    }

    let rainStates: any[] = [];

    function initializeRainStates() {
      const { width, height } = getPillDimensions();
      const verticalStep = 10;
      rainStates = [
        createRainState(width, height, verticalStep),
        createRainState(width, height, verticalStep),
      ];
    }

    initializeRainStates();

    function drawPillRain(pill: any, rainState: any) {
      ctx.save();
      let baseRadius = Math.min(pill.width, pill.height) * 0.6;
      roundRectBottom(
        ctx,
        pill.x,
        pill.y,
        pill.width,
        pill.height,
        baseRadius
      );
      ctx.clip();

      const columns = rainState.length;
      const fontSize = 10;
      const verticalStep = 10;
      let rainSpeed = 0.8;
      if (window.innerWidth > 1600) rainSpeed = 0.9;
      else if (window.innerWidth <= 600) rainSpeed = 0.7;
      else if (window.innerWidth <= 400) rainSpeed = 0.4;

      for (let i = 0; i < columns; i++) {
        let drop = rainState[i];
        let colX = pill.x + i * fontSize + fontSize / 2;
        let colY = pill.y + drop.y;

        for (let j = 0; j < drop.chars.length; j++) {
          let charY = colY + j * verticalStep;
          if (
            colX >= pill.x &&
            colX <= pill.x + pill.width &&
            charY >= pill.y &&
            charY <= pill.y + pill.height
          ) {
            ctx.font = `bold ${fontSize}px monospace`;
            ctx.textAlign = "center";
            ctx.shadowColor = pill.glowColor;
            ctx.shadowBlur = 48;
            const fade = j / drop.chars.length;
            ctx.globalAlpha = 0.2 + fade * 1.0;
            ctx.fillStyle = pill.color;
            ctx.fillText(drop.chars[j], colX, charY);
          }
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        drop.y += verticalStep * rainSpeed;
        if (drop.y > pill.height) {
          drop.y = -verticalStep * Math.floor(Math.random() * 10);
          drop.chars = Array.from(
            { length: Math.floor(pill.height / verticalStep) },
            getRandomChar
          );
        }
      }
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pills = getPillPositions();
      for (let i = 0; i < pills.length; i++) {
        drawPillRain(pills[i], rainStates[i]);
      }
      animationId = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
      initializeRainStates();
    });

    // window-level mousemove handler for hover detection so overlays/buttons
    // do not block hover updates (keeps glow working after clicks)
    function handleMouseMove(e: MouseEvent) {
      const x = e.clientX;
      const y = e.clientY;
      const pills = getPillPositions();
      let found: string | null = null;
      for (let i = 0; i < pills.length; i++) {
        const p = pills[i];
        // pill positions are relative to the canvas (viewport), so compare directly
        if (x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height) {
          found = i === 0 ? "blue" : "red";
          break;
        }
      }
      setHovered(found);
    }

    function handleMouseLeave() {
      setHovered(null);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Intentionally do NOT call onComplete automatically —
    // progression happens only when the user clicks the red pill.

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [onComplete]);

  const getGlowStyle = (): React.CSSProperties => {
    if (!hovered) return { pointerEvents: "none", opacity: 0 } as React.CSSProperties;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = hovered === "blue" ? 0.25 : 0.75;
    const x = Math.round(vw * left);
    const y = Math.round(vh / 2);
    const color = hovered === "red" ? "255,23,68" : "0,191,255";
    return {
      pointerEvents: "none",
      position: "fixed",
      left: 0,
      top: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 5,
      opacity: 1,
      transition: "opacity 0.25s ease",
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(${color},0.38) 0%, rgba(${color},0.18) 30%, rgba(${color},0) 70%)`,
    } as React.CSSProperties;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100vw",
          height: "100vh",
          background: "#000",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <GlowOverlay style={getGlowStyle()} />
      <MatrixMessage />
      {/* Clickable pill areas for all screen sizes */}
      {pillPositionsForRender().map((pill, idx) => (
        <button
          key={idx}
          type="button"
          aria-label={idx === 0 ? "Blue Pill" : "Red Pill"}
          style={{
            position: "absolute",
            left: pill.x,
            top: pill.y,
            width: pill.width,
            height: pill.height,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 2,
            outline: "none",
            padding: 0,
          }}
          onClick={() => {
            // Blue pill (index 0): trigger resume download and do not navigate
            if (idx === 0) {
              void downloadResume();
              return;
            }

            // Red pill: proceed to the next step if provided
            if (typeof onComplete === "function") onComplete();
          }}
        />
      ))}
    </div>
  );
};

export default MatrixPills;
