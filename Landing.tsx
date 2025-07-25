import React, { useState, useRef, useEffect } from "react";
import MatrixPills from "./MatrixPills";

interface LandingProps {
  onRedPill: () => void;
  onBluePill: () => void;
}

const blinkingKeyframes = `
@keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
}
`;

export default function Landing({ onRedPill, onBluePill }: LandingProps) {
    // Dynamically calculate pill button area to always match the pill's height and position
    const pillDims = (() => {
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
    })();
    const pillWidth = pillDims.width;
    const pillHeight = pillDims.height;
    const blueLeft = `calc(25vw - ${pillWidth / 2}px)`;
    const redLeft = `calc(75vw - ${pillWidth / 2}px)`;
    const pillTop = `calc(50vh - ${pillHeight / 2}px)`;

    const [hovered, setHovered] = useState<string | null>(null);
    const getPillCenter = (color: string) => {
        const left = color === "blue" ? 0.25 : 0.75;
        return {
            x: window.innerWidth * left,
            y: window.innerHeight / 2,
        };
    };
    const [glowOpacity, setGlowOpacity] = useState(0);
    const prevHovered = useRef<string | null>(null);

    useEffect(() => {
        if (hovered) {
            setGlowOpacity(1);
        } else {
            setGlowOpacity(0);
        }
        prevHovered.current = hovered;
    }, [hovered]);

    const getGlowStyle = () => {
        if (!hovered && glowOpacity === 0) return { pointerEvents: "none", opacity: 0 };
        const pillColor = hovered || prevHovered.current;
        const { x, y } = getPillCenter(pillColor || "blue");
        const color = pillColor === "red" ? "255,23,68" : "0,191,255";
        return {
            pointerEvents: "none",
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 5,
            opacity: glowOpacity,
            transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1)", // Faster glow
            background: `radial-gradient(circle at ${x}px ${y}px, rgba(${color},0.38) 0%, rgba(${color},0.18) 30%, rgba(${color},0) 70%)`,
        };
    };

    useEffect(() => {
        if (!document.getElementById("matrix-blink-keyframes")) {
            const style = document.createElement("style");
            style.id = "matrix-blink-keyframes";
            style.innerHTML = blinkingKeyframes;
            document.head.appendChild(style);
        }
        if (!document.getElementById("matrix-landing-responsive")) {
            const style = document.createElement("style");
            style.id = "matrix-landing-responsive";
            style.innerHTML = `
                @media (max-width: 900px) {
                    .matrix-message {
                        font-size: 0.55rem !important;
                        width: 90vw !important;
                        bottom: 8vh !important;
                    }
                }
                @media (max-width: 600px) {
                    .matrix-message {
                        font-size: 0.45rem !important;
                        width: 98vw !important;
                        bottom: 5vh !important;
                        padding: 0 2vw;
                    }
                    .matrix-pill-btn {
                        width: 70px !important;
                        height: 160px !important;
                    }
                }
                @media (max-width: 400px) {
                    .matrix-message {
                        font-size: 0.38rem !important;
                        width: 100vw !important;
                        bottom: 2vh !important;
                    }
                    .matrix-pill-btn {
                        width: 48px !important;
                        height: 100px !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // Fix: Make the pill button area slightly larger to cover the bottom rounded part for better hover/click detection
    // Increase height and adjust top to extend the clickable area a bit below the pill
    const pillButtonExtra = 20; // px extra area below

    // Add pointer cursor to the pill button areas only
    return (
        <div
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                background: "#000",
                // cursor removed from here
            }}
        >
            <MatrixPills />
            <div style={getGlowStyle() as React.CSSProperties} />
            <div
                className="matrix-message"
                style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    bottom: "12vh",
                    width: "70vw",
                    textAlign: "center",
                    fontFamily: "'Orbitron', 'Courier New', Courier, monospace",
                    fontSize: "0.9rem",
                    color: "#00ff00",
                    letterSpacing: "0.1em",
                    zIndex: 20,
                    userSelect: "none",
                    fontWeight: 200,
                    textTransform: "uppercase",
                    opacity: 0.75,
                }}
            >
                THE CHOICE IS AN ILLUSION. YOU ALREADY KNOW WHAT YOU HAVE TO DO.
            </div>
            <button
                aria-label="Blue Pill"
                className="matrix-pill-btn"
                style={{
                    position: "absolute",
                    left: blueLeft,
                    top: pillTop,
                    width: `${pillWidth}px`,
                    height: `${pillHeight}px`,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 10,
                }}
                onClick={onBluePill}
                onMouseEnter={() => setHovered("blue")}
                onMouseLeave={() => setHovered(null)}
                tabIndex={0}
            />
            <button
                aria-label="Red Pill"
                className="matrix-pill-btn"
                style={{
                    position: "absolute",
                    left: redLeft,
                    top: pillTop,
                    width: `${pillWidth}px`,
                    height: `${pillHeight}px`,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 10,
                }}
                onClick={onRedPill}
                onMouseEnter={() => setHovered("red")}
                onMouseLeave={() => setHovered(null)}
                tabIndex={0}
            />
        </div>
    );
}
