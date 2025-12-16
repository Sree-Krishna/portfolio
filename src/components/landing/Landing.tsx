import React, { useState, useRef, useEffect } from "react";
import MatrixPills from "./MatrixPills";
import MatrixMessage from "./MatrixMessage";
import PillButton from "./PillButton";
import GlowOverlay from "./GlowOverlay";
import useMatrixStyles from "./useMatrixStyles";

interface LandingProps {
  onRedPill: () => void;
  onBluePill: () => void;
}

export default function Landing({ onRedPill, onBluePill }: LandingProps) {
    useMatrixStyles();

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
            <GlowOverlay style={getGlowStyle() as React.CSSProperties} />
            <MatrixMessage />
            <PillButton
                ariaLabel="Blue Pill"
                left={blueLeft}
                top={pillTop}
                width={pillWidth}
                height={pillHeight + pillButtonExtra}
                onClick={onBluePill}
                onMouseEnter={() => setHovered("blue")}
                onMouseLeave={() => setHovered(null)}
            />
            <PillButton
                ariaLabel="Red Pill"
                left={redLeft}
                top={pillTop}
                width={pillWidth}
                height={pillHeight + pillButtonExtra}
                onClick={onRedPill}
                onMouseEnter={() => setHovered("red")}
                onMouseLeave={() => setHovered(null)}
            />
        </div>
    );
}
