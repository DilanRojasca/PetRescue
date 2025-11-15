/**
 * StatsPanel
 * ----------
 * Component that displays statistics about animal cases
 */

import React from "react";
import { AnimalCase } from "../services/api";

interface StatsPanelProps {
  cases: AnimalCase[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ cases }) => {
  const stats = {
    total: cases.length,
    open: cases.filter(c => c.status === "open").length,
    inProgress: cases.filter(c => c.status === "in_progress").length,
    resolved: cases.filter(c => c.status === "resolved").length,
  };

  const statsItems = [
    {
      label: "Total de Casos",
      value: stats.total,
      icon: "📊",
      color: "var(--primary)",
      bgColor: "rgba(99, 102, 241, 0.1)",
    },
    {
      label: "Necesitan Ayuda",
      value: stats.open,
      icon: "🚨",
      color: "var(--status-open)",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
    {
      label: "En Progreso",
      value: stats.inProgress,
      icon: "🔄",
      color: "var(--status-in-progress)",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Resueltos",
      value: stats.resolved,
      icon: "✅",
      color: "var(--status-resolved)",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem",
    }}>
      {statsItems.map((stat, index) => (
        <div
          key={index}
          className="card"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            padding: "1.5rem",
            textAlign: "center",
            transition: "all var(--transition-base)",
            border: `2px solid ${stat.bgColor}`,
          }}
        >
          <div style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
          }}>
            {stat.icon}
          </div>
          <div style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: stat.color,
            marginBottom: "0.25rem",
            lineHeight: 1,
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

