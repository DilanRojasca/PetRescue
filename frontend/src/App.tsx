/**
 * Root application component.
 *
 * This component composes the main "views" of the UI: a map,
 * a form to report new animal cases, and a list of all cases.
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimalReportForm } from "./components/AnimalReportForm";
import { AnimalMap } from "./components/AnimalMap";
import { AnimalCaseList } from "./components/AnimalCaseList";
import { PawPrints } from "./components/PawPrints";
import { WalkingPaws } from "./components/WalkingPaws";
import { getAnimalCases, AnimalCase } from "./services/api";

export const App: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [allCases, setAllCases] = useState<AnimalCase[]>([]);

  const handleDataChange = () => {
    // Trigger refresh when data changes (create, update, delete)
    setRefreshTrigger((prev) => prev + 1);
    loadAllCases();
  };

  const loadAllCases = async () => {
    try {
      const data = await getAnimalCases();
      setAllCases(data || []);
    } catch (err) {
      console.error("Error loading cases for stats:", err);
    }
  };

  useEffect(() => {
    loadAllCases();
  }, [refreshTrigger]);

  return (
    <>
      <PawPrints />
      <WalkingPaws />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            marginBottom: "4rem",
            textAlign: "center",
            padding: "4rem 0 3rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Efectos de fondo tipo partículas y ondas */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 50% 20%, rgba(240, 147, 251, 0.3) 0%, transparent 40%)
            `,
            pointerEvents: "none",
            zIndex: 0,
          }} />
          
          {/* Ondas animadas de fondo */}
          {[1, 2, 3].map((wave) => (
            <motion.div
              key={wave}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4 + wave,
                repeat: Infinity,
                delay: wave * 0.5,
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: `${300 + wave * 100}px`,
                height: `${300 + wave * 100}px`,
                borderRadius: "50%",
                border: `2px solid rgba(102, 126, 234, ${0.3 - wave * 0.1})`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          ))}

          {/* Logo épico con efectos dramáticos */}
          <motion.div
            initial={{ scale: 0, rotate: -360 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.3 }}
            style={{
              position: "relative",
              zIndex: 2,
              marginBottom: "2rem",
            }}
          >
            <motion.div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Glow effect alrededor del logo */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(102, 126, 234, 0.5), 0 0 60px rgba(118, 75, 162, 0.3)",
                    "0 0 50px rgba(102, 126, 234, 0.8), 0 0 100px rgba(118, 75, 162, 0.5)",
                    "0 0 30px rgba(102, 126, 234, 0.5), 0 0 60px rgba(118, 75, 162, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "4rem",
                  position: "relative",
                  border: "4px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <motion.span
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{ display: "inline-block" }}
                >
                  🐾
                </motion.span>
                
                {/* Anillos decorativos */}
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    style={{
                      position: "absolute",
                      width: `${100 + i * 30}px`,
                      height: `${100 + i * 30}px`,
                      border: `2px solid rgba(255, 255, 255, ${0.4 - i * 0.1})`,
                      borderRadius: "50%",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Título épico estilo gaming */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 100 }}
            style={{
              position: "relative",
              zIndex: 100,
              marginBottom: "1.5rem",
            }}
          >
            <motion.h1
              style={{
                fontSize: "clamp(4rem, 10vw, 7rem)",
                fontWeight: 900,
                color: "#ffffff",
                textShadow: `
                  0 0 30px rgba(255, 255, 255, 0.9),
                  0 0 60px rgba(102, 126, 234, 0.8),
                  0 0 90px rgba(118, 75, 162, 0.7),
                  0 0 120px rgba(102, 126, 234, 0.5),
                  0 6px 30px rgba(0, 0, 0, 0.6),
                  2px 2px 8px rgba(0, 0, 0, 0.4)
                `,
                letterSpacing: "0.15em",
                margin: 0,
                fontFamily: "'Arial Black', 'Impact', 'Bebas Neue', sans-serif",
                lineHeight: 1.1,
                display: "block",
                position: "relative",
              }}
              animate={{
                textShadow: [
                  `
                    0 0 30px rgba(255, 255, 255, 0.9),
                    0 0 60px rgba(102, 126, 234, 0.8),
                    0 0 90px rgba(118, 75, 162, 0.7),
                    0 0 120px rgba(102, 126, 234, 0.5),
                    0 6px 30px rgba(0, 0, 0, 0.6),
                    2px 2px 8px rgba(0, 0, 0, 0.4)
                  `,
                  `
                    0 0 40px rgba(255, 255, 255, 1),
                    0 0 80px rgba(102, 126, 234, 1),
                    0 0 120px rgba(118, 75, 162, 0.9),
                    0 0 160px rgba(102, 126, 234, 0.7),
                    0 8px 40px rgba(0, 0, 0, 0.7),
                    3px 3px 10px rgba(0, 0, 0, 0.5)
                  `,
                  `
                    0 0 30px rgba(255, 255, 255, 0.9),
                    0 0 60px rgba(102, 126, 234, 0.8),
                    0 0 90px rgba(118, 75, 162, 0.7),
                    0 0 120px rgba(102, 126, 234, 0.5),
                    0 6px 30px rgba(0, 0, 0, 0.6),
                    2px 2px 8px rgba(0, 0, 0, 0.4)
                  `,
                ],
              }}
              transition={{
                textShadow: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{
                scale: 1.08,
                textShadow: `
                  0 0 50px rgba(255, 255, 255, 1),
                  0 0 100px rgba(102, 126, 234, 1),
                  0 0 150px rgba(118, 75, 162, 1),
                  0 0 200px rgba(102, 126, 234, 0.8),
                  0 10px 50px rgba(0, 0, 0, 0.8),
                  4px 4px 15px rgba(0, 0, 0, 0.6)
                `,
              }}
            >
              PetRescue
            </motion.h1>
          </motion.div>
          
          {/* Efecto de partículas detrás del título */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0, 1, 0],
                x: [
                  Math.random() * 400 - 200,
                  Math.random() * 400 - 200,
                  Math.random() * 400 - 200,
                ],
                y: [
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100,
                  Math.random() * 200 - 100,
                ],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                position: "absolute",
                width: "4px",
                height: "4px",
                background: "rgba(255, 255, 255, 0.6)",
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                boxShadow: "0 0 10px rgba(102, 126, 234, 0.6)",
                zIndex: 5,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Subtítulo impactante con efectos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            style={{
              position: "relative",
              zIndex: 2,
              marginBottom: "2.5rem",
            }}
          >
            <motion.p
              style={{
                fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                color: "rgba(255, 255, 255, 0.98)",
                fontWeight: 700,
                textShadow: `
                  0 2px 25px rgba(0, 0, 0, 0.6),
                  0 0 40px rgba(102, 126, 234, 0.5),
                  0 0 60px rgba(118, 75, 162, 0.4)
                `,
                letterSpacing: "0.08em",
                maxWidth: "900px",
                margin: "0 auto",
                padding: "0 2rem",
                lineHeight: 1.7,
              }}
            >
              <motion.span
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(102, 126, 234, 0.5)",
                    "0 0 20px rgba(102, 126, 234, 0.8)",
                    "0 0 10px rgba(102, 126, 234, 0.5)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                SALVA VIDAS.
              </motion.span>{" "}
              <motion.span
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(239, 68, 68, 0.5)",
                    "0 0 20px rgba(239, 68, 68, 0.8)",
                    "0 0 10px rgba(239, 68, 68, 0.5)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                REPORTA ANIMALES EN RIESGO.
              </motion.span>{" "}
              <motion.span
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(16, 185, 129, 0.5)",
                    "0 0 20px rgba(16, 185, 129, 0.8)",
                    "0 0 10px rgba(16, 185, 129, 0.5)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                ÚNETE A LA MISIÓN.
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Estadísticas épicas en línea */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              flexWrap: "wrap",
              position: "relative",
              zIndex: 2,
              marginTop: "2rem",
            }}
          >
            {[
              { label: "CASOS", value: allCases.length, icon: "📊", color: "#667eea" },
              { label: "RESUELTOS", value: allCases.filter(c => c.status === "resolved").length, icon: "✅", color: "#10b981" },
              { label: "URGENTES", value: allCases.filter(c => c.status === "open").length, icon: "🚨", color: "#ef4444" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  boxShadow: `0 10px 30px ${stat.color}40`
                }}
                style={{
                  background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                  backdropFilter: "blur(15px)",
                  padding: "1.5rem 2rem",
                  borderRadius: "16px",
                  border: `2px solid ${stat.color}40`,
                  boxShadow: `0 8px 25px rgba(0, 0, 0, 0.2), inset 0 0 20px ${stat.color}10`,
                  minWidth: "150px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{stat.icon}</div>
                <motion.div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 900,
                    color: stat.color,
                    textShadow: `0 0 20px ${stat.color}60`,
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {stat.value}
                </motion.div>
                <div style={{
                  fontSize: "0.85rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Líneas decorativas épicas */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
            style={{
              height: "4px",
              background: "linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8), rgba(102, 126, 234, 0.8), transparent)",
              margin: "3rem auto 0",
              maxWidth: "600px",
              borderRadius: "2px",
              boxShadow: "0 0 20px rgba(102, 126, 234, 0.6)",
              position: "relative",
              zIndex: 2,
            }}
          />
        </motion.header>

      <section style={{
        display: "grid",
        gap: "2rem",
      }}>
        <AnimalReportForm onReportCreated={handleDataChange} />
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))",
          gap: "2rem",
        }}>
          <AnimalMap refreshTrigger={refreshTrigger} />
          <AnimalCaseList 
            refreshTrigger={refreshTrigger} 
            onCaseDeleted={handleDataChange}
            onCaseUpdated={handleDataChange}
          />
        </div>
      </section>
      </div>
    </>
  );
};
