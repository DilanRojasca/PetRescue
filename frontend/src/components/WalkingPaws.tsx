/**
 * WalkingPaws
 * -----------
 * Animated paw prints that walk across the page from side to side
 */

import React, { useState, useEffect } from "react";

interface WalkingPaw {
  id: number;
  direction: "left-to-right" | "right-to-left";
  top: string;
  delay: number;
}

export const WalkingPaws: React.FC = () => {
  const [walkingPaws, setWalkingPaws] = useState<WalkingPaw[]>([]);

  useEffect(() => {
    // Crear patitas caminando periódicamente
    const createWalkingPaw = () => {
      const id = Date.now() + Math.random();
      const direction = Math.random() > 0.5 ? "left-to-right" : "right-to-left";
      const top = `${20 + Math.random() * 60}%`; // Entre 20% y 80% de la altura
      const delay = Math.random() * 2; // Delay aleatorio hasta 2 segundos

      const newPaw: WalkingPaw = {
        id,
        direction,
        top,
        delay,
      };

      setWalkingPaws((prev) => [...prev, newPaw]);

      // Remover después de que termine la animación (8 segundos)
      setTimeout(() => {
        setWalkingPaws((prev) => prev.filter((p) => p.id !== id));
      }, 8000);
    };

    // Crear la primera patita después de un delay inicial
    const initialDelay = setTimeout(() => {
      createWalkingPaw();
    }, 3000);

    // Crear patitas periódicamente (cada 8-15 segundos)
    const interval = setInterval(() => {
      createWalkingPaw();
    }, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {walkingPaws.map((paw) => {
        // Crear 4 pisadas en secuencia para simular caminar
        const steps = [0, 1, 2, 3];
        const stepOffset = 80; // Distancia entre cada pisada
        return (
          <div key={paw.id}>
            {steps.map((step) => {
              const stepDelay = step * 0.25; // Delay entre cada pisada
              const horizontalOffset = step * stepOffset; // Offset horizontal para cada pisada
              return (
                <div
                  key={step}
                  className={`walking-paw-step walking-paw-${paw.direction}`}
                  style={{
                    position: "fixed",
                    top: paw.top,
                    left: paw.direction === "left-to-right" 
                      ? `calc(-50px + ${horizontalOffset}px)` 
                      : "auto",
                    right: paw.direction === "right-to-left" 
                      ? `calc(-50px + ${horizontalOffset}px)` 
                      : "auto",
                    fontSize: "1.8rem",
                    opacity: 0,
                    pointerEvents: "none",
                    zIndex: 0,
                    animation: `walkAcross${paw.direction === "left-to-right" ? "LTR" : "RTL"} 6s ease-in-out forwards, pawStepPulse 0.5s ease-in-out infinite`,
                    animationDelay: `${paw.delay + stepDelay}s, ${paw.delay + stepDelay + 0.1}s`,
                    filter: "drop-shadow(0 2px 8px rgba(255, 255, 255, 0.4))",
                    textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                  }}
                >
                  🐾
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

