/**
 * AnimalCaseList
 * --------------
 * Component that displays all reported animal cases as cards
 * with options to edit and delete each case.
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getAnimalCases, deleteAnimalCase, updateAnimalCase, AnimalCase, getImageUrl } from "../services/api";
import { SkeletonCard } from "./SkeletonLoader";
import { ConfirmModal } from "./ConfirmModal";

interface AnimalCaseListProps {
  refreshTrigger?: number;
  onCaseDeleted?: () => void;
  onCaseUpdated?: () => void;
}

type TabType = "all" | "open" | "in_progress" | "resolved";

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
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; caseId: string | null }>({
    isOpen: false,
    caseId: null,
  });

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

  const handleDeleteClick = (caseId: string) => {
    setDeleteConfirm({ isOpen: true, caseId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.caseId) return;

    const deleteToast = toast.loading("Eliminando reporte...");
    try {
      await deleteAnimalCase(deleteConfirm.caseId);
      setCases(cases.filter((c) => c.id !== deleteConfirm.caseId));
      toast.success("✓ Reporte eliminado exitosamente", { id: deleteToast });
      if (onCaseDeleted) {
        onCaseDeleted();
      }
    } catch (err) {
      toast.error("Error al eliminar el caso", { id: deleteToast });
      console.error(err);
    } finally {
      setDeleteConfirm({ isOpen: false, caseId: null });
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
    const saveToast = toast.loading("Guardando cambios...");
    try {
      const updated = await updateAnimalCase(caseId, editFormData);
      setCases(cases.map((c) => (c.id === caseId ? updated : c)));
      setEditingCase(null);
      setEditFormData({});
      toast.success("✓ Cambios guardados exitosamente", { id: saveToast });
      if (onCaseUpdated) {
        onCaseUpdated();
      }
    } catch (err) {
      toast.error("Error al actualizar el caso", { id: saveToast });
      console.error(err);
    }
  };

  const updateStatus = async (caseId: string, newStatus: string) => {
    const statusToast = toast.loading("Actualizando estado...");
    try {
      const updated = await updateAnimalCase(caseId, { status: newStatus });
      setCases(cases.map((c) => (c.id === caseId ? updated : c)));
      const statusLabels: Record<string, string> = {
        open: "Abierto",
        in_progress: "En Progreso",
        resolved: "Resuelto",
      };
      toast.success(`✓ Estado actualizado a: ${statusLabels[newStatus] || newStatus}`, { id: statusToast });
      if (onCaseUpdated) {
        onCaseUpdated();
      }
    } catch (err) {
      toast.error("Error al actualizar el estado", { id: statusToast });
      console.error(err);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "open":
        return "badge badge-open";
      case "in_progress":
        return "badge badge-in-progress";
      case "resolved":
        return "badge badge-resolved";
      default:
        return "badge";
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

  // Filtrar casos según la pestaña activa
  const filteredCases = cases.filter((caseItem) => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return caseItem.status === "open";
    if (activeTab === "in_progress") return caseItem.status === "in_progress";
    if (activeTab === "resolved") return caseItem.status === "resolved";
    return true;
  });

  // Contar casos por estado
  const allCount = cases.length;
  const openCount = cases.filter((c) => c.status === "open").length;
  const inProgressCount = cases.filter((c) => c.status === "in_progress").length;
  const resolvedCount = cases.filter((c) => c.status === "resolved").length;

  if (loading) {
    return (
      <div className="card" style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
          }}>
            📋
          </div>
          <h2 style={{
            margin: 0,
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}>
            Lista de Reportes
          </h2>
        </div>
        <div style={{
          display: "grid",
          gap: "1rem",
        }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
      }}>
        <div className="alert alert-error">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      maxHeight: "800px",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
          }}>
            📋
          </div>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}>
              Lista de Reportes
            </h2>
            <p style={{
              margin: "0.25rem 0 0 0",
              fontSize: "var(--font-size-sm)",
              color: "var(--text-secondary)",
            }}>
              {cases.length} {cases.length === 1 ? "caso reportado" : "casos reportados"}
            </p>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <span>📋 Todos</span>
          <span className="tab-count">{allCount}</span>
        </button>
        <button
          className={`tab ${activeTab === "open" ? "active" : ""}`}
          onClick={() => setActiveTab("open")}
        >
          <span>🚨 Abiertos</span>
          <span className="tab-count">{openCount}</span>
        </button>
        <button
          className={`tab ${activeTab === "in_progress" ? "active" : ""}`}
          onClick={() => setActiveTab("in_progress")}
        >
          <span>🔄 En Progreso</span>
          <span className="tab-count">{inProgressCount}</span>
        </button>
        <button
          className={`tab ${activeTab === "resolved" ? "active" : ""}`}
          onClick={() => setActiveTab("resolved")}
        >
          <span>✅ Resueltos</span>
          <span className="tab-count">{resolvedCount}</span>
        </button>
      </div>

      {filteredCases.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          color: "var(--text-secondary)",
        }}>
          <div style={{
            fontSize: "4rem",
            marginBottom: "1rem",
          }}>
            {activeTab === "all" ? "🐾" 
              : activeTab === "open" ? "🚨"
              : activeTab === "in_progress" ? "🔄" 
              : "✅"}
          </div>
          <p style={{
            fontSize: "1.125rem",
            marginBottom: "0.5rem",
            color: "var(--text-primary)",
          }}>
            {activeTab === "all" 
              ? "No hay casos reportados aún"
              : activeTab === "open"
              ? "No hay casos abiertos"
              : activeTab === "in_progress"
              ? "No hay casos en progreso"
              : "No hay casos resueltos"}
          </p>
          <p style={{
            fontSize: "var(--font-size-sm)",
          }}>
            {activeTab === "all"
              ? "¡Sé el primero en reportar un animal que necesite ayuda!"
              : activeTab === "open"
              ? "Los nuevos reportes que necesiten atención aparecerán aquí"
              : activeTab === "in_progress"
              ? "Los casos que estén siendo atendidos aparecerán aquí"
              : "Los casos completados aparecerán aquí"}
          </p>
        </div>
      ) : (
        <div style={{
          overflowY: "auto",
          flex: 1,
          display: "grid",
          gap: "1rem",
        }}>
          <AnimatePresence mode="popLayout">
            {filteredCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="card"
                style={{
                  padding: "1.25rem",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  transition: "all var(--transition-base)",
                }}
              >
              {editingCase === caseItem.id ? (
                <div>
                  <h3 style={{
                    margin: "0 0 1rem 0",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}>
                    Editar Reporte
                  </h3>
                  
                  <div style={{ marginBottom: "1rem" }}>
                    <label className="label">Descripción</label>
                    <textarea
                      value={editFormData.description || ""}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, description: e.target.value })
                      }
                      className="textarea"
                      rows={3}
                    />
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}>
                    <div>
                      <label className="label">Latitud</label>
                      <input
                        type="number"
                        value={editFormData.latitude || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, latitude: Number(e.target.value) })
                        }
                        step="0.000001"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Longitud</label>
                      <input
                        type="number"
                        value={editFormData.longitude || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, longitude: Number(e.target.value) })
                        }
                        step="0.000001"
                        className="input"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="label">Estado</label>
                    <select
                      value={editFormData.status || "open"}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="input"
                    >
                      <option value="open">Abierto</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="resolved">Resuelto</option>
                    </select>
                  </div>

                  <div style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}>
                    <button
                      onClick={() => saveEdit(caseItem.id)}
                      className="btn btn-secondary"
                    >
                      💾 Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn btn-outline"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}>
                    {caseItem.image_url ? (
                      <div style={{
                        position: "relative",
                        flexShrink: 0,
                      }}>
                        <img
                          src={getImageUrl(caseItem.image_url || "")}
                          alt="Animal"
                          style={{
                            width: "140px",
                            height: "140px",
                            objectFit: "cover",
                            borderRadius: "var(--border-radius-lg)",
                            boxShadow: "var(--shadow-md)",
                            border: "3px solid var(--border-color)",
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <div style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: caseItem.status === "open" 
                            ? "var(--status-open)" 
                            : caseItem.status === "in_progress"
                            ? "var(--status-in-progress)"
                            : "var(--status-resolved)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.2rem",
                          boxShadow: "var(--shadow-md)",
                          border: "2px solid white",
                        }}>
                          {caseItem.status === "open" ? "🚨" : caseItem.status === "in_progress" ? "🔄" : "✅"}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        width: "140px",
                        height: "140px",
                        borderRadius: "var(--border-radius-lg)",
                        background: "linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "3rem",
                        flexShrink: 0,
                        border: "3px solid var(--border-color)",
                      }}>
                        🐾
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "0.75rem",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}>
                          <h3 style={{
                            margin: 0,
                            fontSize: "1.125rem",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}>
                            Caso #{caseItem.id.slice(0, 8)}
                          </h3>
                          <span className={getStatusBadgeClass(caseItem.status)}>
                            {getStatusLabel(caseItem.status)}
                          </span>
                        </div>
                      </div>
                      <p style={{
                        margin: "0 0 0.75rem 0",
                        color: "var(--text-primary)",
                        fontSize: "var(--font-size-sm)",
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {caseItem.description}
                      </p>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        background: "var(--bg-secondary)",
                        borderRadius: "var(--border-radius-md)",
                        fontSize: "var(--font-size-xs)",
                        color: "var(--text-secondary)",
                      }}>
                        <span style={{ fontSize: "1rem" }}>📍</span>
                        <span style={{ fontFamily: "monospace" }}>
                          {caseItem.latitude.toFixed(4)}, {caseItem.longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border-color)",
                  }}>
                    {caseItem.status === "open" && (
                      <button
                        onClick={() => updateStatus(caseItem.id, "in_progress")}
                        className="btn btn-sm"
                        style={{
                          background: "var(--status-in-progress)",
                          color: "white",
                        }}
                      >
                        🚀 En Progreso
                      </button>
                    )}

                    {caseItem.status === "in_progress" && (
                      <button
                        onClick={() => updateStatus(caseItem.id, "resolved")}
                        className="btn btn-sm btn-secondary"
                      >
                        ✅ Resuelto
                      </button>
                    )}

                    <button
                      onClick={() => startEdit(caseItem)}
                      className="btn btn-sm btn-outline"
                    >
                      ✏️ Editar
                    </button>

                    <button
                      onClick={() => handleDeleteClick(caseItem.id)}
                      className="btn btn-sm btn-danger"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, caseId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Reporte"
        message="¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColor="var(--status-open)"
      />
    </div>
  );
};
