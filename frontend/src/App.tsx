/**
 * Root application component.
 *
 * This component composes the main "views" of the UI: a map,
 * a form to report new animal cases, and a list of all cases.
 */

import React, { useState } from "react";
import { AnimalReportForm } from "./components/AnimalReportForm";
import { AnimalMap } from "./components/AnimalMap";
import { AnimalCaseList } from "./components/AnimalCaseList";

export const App: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataChange = () => {
    // Trigger refresh when data changes (create, update, delete)
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "1rem", maxWidth: "1400px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>🐾 PetRescue Map</h1>
        <p style={{ margin: 0, color: "#666" }}>
          Reporta animales callejeros o en riesgo y ayuda a coordinar la
          respuesta con voluntarios y refugios.
        </p>
      </header>

      <section style={{ marginTop: "1.5rem", display: "grid", gap: "1.5rem" }}>
        <AnimalReportForm onReportCreated={handleDataChange} />
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <AnimalMap refreshTrigger={refreshTrigger} />
          <AnimalCaseList 
            refreshTrigger={refreshTrigger} 
            onCaseDeleted={handleDataChange}
            onCaseUpdated={handleDataChange}
          />
        </div>
      </section>
    </div>
  );
};
