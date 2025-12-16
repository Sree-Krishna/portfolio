import { useEffect } from "react";

const blinkingKeyframes = `
@keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
}
`;

export default function useMatrixStyles() {
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
}
