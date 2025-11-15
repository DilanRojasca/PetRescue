/**
 * SkeletonLoader
 * --------------
 * Reusable skeleton loading component for better UX
 */

import React from "react";
import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = "1rem",
  borderRadius = "4px",
  className = "",
}) => {
  return (
    <motion.div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
      }}
      animate={{
        backgroundPosition: ["200% 0", "-200% 0"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="card" style={{
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "1.25rem",
    }}>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <SkeletonLoader width="140px" height="140px" borderRadius="12px" />
        <div style={{ flex: 1 }}>
          <SkeletonLoader width="60%" height="1.5rem" style={{ marginBottom: "0.5rem" }} />
          <SkeletonLoader width="40%" height="1rem" style={{ marginBottom: "0.75rem" }} />
          <SkeletonLoader width="100%" height="0.875rem" style={{ marginBottom: "0.5rem" }} />
          <SkeletonLoader width="90%" height="0.875rem" style={{ marginBottom: "0.5rem" }} />
          <SkeletonLoader width="70%" height="0.875rem" />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <SkeletonLoader width="100px" height="2rem" borderRadius="6px" />
        <SkeletonLoader width="80px" height="2rem" borderRadius="6px" />
      </div>
    </div>
  );
};

