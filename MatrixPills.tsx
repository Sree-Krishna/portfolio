import React, { useRef, useEffect } from "react";

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
    let timer: NodeJS.Timeout;

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

    if (typeof onComplete === 'function') {
      timer = setTimeout(() => {
        cancelAnimationFrame(animationId);
        onComplete();
      }, 2000);
    }

    return () => {
      cancelAnimationFrame(animationId);
      if (timer) clearTimeout(timer);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100vw",
        height: "100vh",
        background: "#000",
      }}
    />
  );
};

export default MatrixPills;
