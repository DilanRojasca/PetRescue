/**
 * AnimalCaseList
 * --------------
 * Component that displays all reported animal cases as cards
 * with options to edit and delete each case.
 */

import React, { useEffect, useState } from "react";
import { getAnimalCases, deleteAnimalCase, updateAnimalCase, AnimalCase } from "../services/api";

interface AnimalCaseListProps {
  refreshTrigger?: number;
  onCaseDeleted?: () => void;
  onCaseUpdated?: () => void;
}

export const AnimalCaseList: React.FC<AnimalCaseListProps> = ({ 
  refreshTrigger, 
  onCaseDeleted,
  onCaseUpdated 
}) => {
  const [cases, setCases] = useState<AnimalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<AnimalCase>>({});

  useEffect(() => {
    loadCases();
  }, [refreshTrigger]);

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await getAnimalCases();
      setCases(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los casos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (caseId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este reporte?")) {
      return;
    }

    try {
      await deleteAnimalCase(caseId);
      setCases(cases.filter((c) => c.id !== caseId));
      if (onCaseDeleted) {
        onCaseDeleted();
      }
    } catch (err) {
      alert("Error al eliminar el caso");
      console.error(err);
    }
  };

  const startEdit = (caseItem: AnimalCase) => {
    setEditingCase(caseItem.id);
    setEditFormData({
      description: caseItem.description,
      latitude: caseItem.latitude,
      longitude: caseItem.longitude,
      status: caseItem.status,
    });
  };

  const cancelEdit = () => {
    setEditingCase(null);
    setEditFormData({});
  };

  const saveEdit = async (caseId: string) => {
    try {
      const updated = await updateAnimalCase(caseId, editFormData);
      setCases(cases.map((c) => (c.id === caseId ? updated : c)));
      setEditingCase(null);
      setEditFormData({});
      if (onCaseUpdated) {
        onCaseUpdated();
      }
    } catch (err) {
      alert("Error al actualizar el caso");
      console.error(err);
    }
  };

  const updateStatus = async (caseId: string, newStatus: string) => {
    try {
      const updated = await updateAnimalCase(caseId, { status: newStatus });
      setCases(cases.map((c) => (c.id === caseId ? updated : c)));
      if (onCaseUpdated) {
        onCaseUpdated();
      }
    } catch (err) {
      alert("Error al actualizar el estado");
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "#dc3545";
      case "in_progress":
        return "#ffc107";
      case "resolved":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Abierto";
      case "in_progress":
        return "En Progreso";
      case "resolved":
        return "Resuelto";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <section style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem" }}>
        <h2>Lista de Reportes</h2>
        <p>Cargando casos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem" }}>
        <h2>Lista de Reportes</h2>
        <p style={{ color: "red" }}>{error}</p>
      </section>
    );
  }

  return (
    <section style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem" }}>
      <h2>Lista de Reportes ({cases.length})</h2>

      {cases.length === 0 ? (
        <p style={{ color: "#666", textAlign: "center", padding: "2rem" }}>
          No hay casos reportados aún. ¡Sé el primero en reportar un animal!
        </p>
      ) : (
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "0.5rem",
                padding: "1rem",
                background: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {editingCase === caseItem.id ? (
                // Edit mode
                <div>
                  <h3 style={{ margin: "0 0 1rem 0" }}>Editar Reporte</h3>
                  
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>
                    Descripción
                    <textarea
                      value={editFormData.description || ""}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, description: e.target.value })
                      }
                      style={{ width: "100%", minHeight: "3rem", padding: "0.5rem" }}
                    />
                  </label>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <label>
                      Latitud
                      <input
                        type="number"
                        value={editFormData.latitude || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, latitude: Number(e.target.value) })
                        }
                        step="0.000001"
                        style={{ width: "100%", padding: "0.5rem" }}
                      />
                    </label>

                    <label>
                      Longitud
                      <input
                        type="number"
                        value={editFormData.longitude || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, longitude: Number(e.target.value) })
                        }
                        step="0.000001"
                        style={{ width: "100%", padding: "0.5rem" }}
                      />
                    </label>
                  </div>

                  <label style={{ display: "block", margin: "0.5rem 0" }}>
                    Estado
                    <select
                      value={editFormData.status || "open"}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem" }}
                    >
                      <option value="open">Abierto</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="resolved">Resuelto</option>
                    </select>
                  </label>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <button
                      onClick={() => saveEdit(caseItem.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                      }}
                    >
                      💾 Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <h3 style={{ margin: 0 }}>Caso #{caseItem.id}</h3>
                        <span
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.875rem",
                            background: getStatusColor(caseItem.status),
                            color: "white",
                          }}
                        >
                          {getStatusLabel(caseItem.status)}
                        </span>
                      </div>
                      <p style={{ margin: "0.5rem 0", color: "#333" }}>{caseItem.description}</p>
                      <p style={{ margin: "0.5rem 0", fontSize: "0.875rem", color: "#666" }}>
                        📍 Lat: {caseItem.latitude.toFixed(6)}, Lng: {caseItem.longitude.toFixed(6)}
                      </p>
                    </div>

                    {caseItem.image_url && (
                      <img
                        src={`http://localhost:8000${caseItem.image_url}`}
                        alt="Animal"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "0.5rem",
                          marginLeft: "1rem",
                        }}
                      />
                    )}
                  </div>

                  <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {caseItem.status === "open" && (
                      <button
                        onClick={() => updateStatus(caseItem.id, "in_progress")}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#ffc107",
                          color: "#000",
                          border: "none",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        🚀 Marcar en progreso
                      </button>
                    )}

                    {caseItem.status === "in_progress" && (
                      <button
                        onClick={() => updateStatus(caseItem.id, "resolved")}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        ✅ Marcar resuelto
                      </button>
                    )}

                    <button
                      onClick={() => startEdit(caseItem)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      onClick={() => handleDelete(caseItem.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
