/**
 * PawPrints
 * ---------
 * Decorative paw prints around the page
 */

import React from "react";

export const PawPrints: React.FC = () => {
  // Posiciones de las patitas alrededor de la página
  const pawPositions = [
    // Left side - más variadas
    { top: "8%", left: "3%", size: "2.5rem", rotation: "-15deg", delay: "0s" },
    { top: "20%", left: "5%", size: "2rem", rotation: "10deg", delay: "0.8s" },
    { top: "32%", left: "2%", size: "2.8rem", rotation: "-8deg", delay: "1.6s" },
    { top: "45%", left: "6%", size: "2.2rem", rotation: "15deg", delay: "0.4s" },
    { top: "58%", left: "3%", size: "2.6rem", rotation: "-12deg", delay: "1.2s" },
    { top: "70%", left: "5%", size: "2.3rem", rotation: "8deg", delay: "2s" },
    { top: "82%", left: "4%", size: "2.4rem", rotation: "-10deg", delay: "0.6s" },
    { top: "95%", left: "6%", size: "2.1rem", rotation: "12deg", delay: "1.4s" },
    
    // Right side - más variadas
    { top: "12%", right: "3%", size: "2.3rem", rotation: "15deg", delay: "0.2s" },
    { top: "24%", right: "5%", size: "2.7rem", rotation: "-10deg", delay: "1s" },
    { top: "36%", right: "2%", size: "2.2rem", rotation: "8deg", delay: "1.8s" },
    { top: "48%", right: "6%", size: "2.5rem", rotation: "-15deg", delay: "0.6s" },
    { top: "60%", right: "4%", size: "2.4rem", rotation: "12deg", delay: "1.4s" },
    { top: "72%", right: "5%", size: "2.6rem", rotation: "-8deg", delay: "2.2s" },
    { top: "84%", right: "3%", size: "2.1rem", rotation: "10deg", delay: "0.8s" },
    { top: "96%", right: "6%", size: "2.3rem", rotation: "-12deg", delay: "1.6s" },
  ];

  return (
    <>
      {pawPositions.map((paw, index) => (
        <div
          key={index}
          style={{
            position: "fixed",
            top: paw.top,
            left: paw.left,
            right: paw.right,
            fontSize: paw.size,
            pointerEvents: "none",
            zIndex: 0,
            transform: `rotate(${paw.rotation})`,
            transformOrigin: "center center",
          }}
        >
          <div
            className="paw-print"
            style={{
              animation: "pawFloat 5s ease-in-out infinite",
              animationDelay: paw.delay,
              opacity: 0.25,
              filter: "drop-shadow(0 2px 8px rgba(255, 255, 255, 0.3))",
              textShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
            }}
          >
            🐾
          </div>
        </div>
      ))}
    </>
  );
};

