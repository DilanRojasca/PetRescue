/**
 * AnimalMap
 * ---------
 * Interactive map component that displays reported animal cases using Google Maps.
 */

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import { getAnimalCases, AnimalCase, getImageUrl } from "../services/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "var(--border-radius-lg)",
};

// Default center (Bogotá, Colombia - adjust based on your location)
const defaultCenter = {
  lat: 4.711,
  lng: -74.0721,
};

interface AnimalMapProps {
  refreshTrigger?: number;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return "🔴";
    case "in_progress":
      return "🟡";
    case "resolved":
      return "🟢";
    default:
      return "⚪";
  }
};

export const AnimalMap: React.FC<AnimalMapProps> = ({ refreshTrigger }) => {
  const [cases, setCases] = useState<AnimalCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<AnimalCase | null>(null);
  const [loadingCases, setLoadingCases] = useState(true);
  const [casesError, setCasesError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    loadCases();
  }, [refreshTrigger]);

  const loadCases = async () => {
    try {
      setLoadingCases(true);
      setCasesError(null);
      const data = await getAnimalCases();
      // Si la respuesta es exitosa, incluso si está vacía, no es un error
      setCases(data || []);
    } catch (err: any) {
      // Solo mostramos error si es un problema de conexión real
      const isNetworkError = err?.isNetworkError ||
                             err?.code === 'ECONNREFUSED' || 
                             err?.code === 'ERR_NETWORK' || 
                             err?.code === 'ERR_CONNECTION_REFUSED' ||
                             err?.message?.includes('Network Error') ||
                             (!err?.response && err?.request);
      
      if (isNetworkError) {
        setCasesError("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
      } else {
        // Para otros errores (como 404, 500, etc.), solo logueamos pero no mostramos error al usuario
        // porque puede ser que simplemente no hay casos aún
        console.error("Error loading cases:", err);
        setCasesError(null);
      }
      // Mantenemos un array vacío para que el mapa funcione
      setCases([]);
    } finally {
      setLoadingCases(false);
    }
  };

  // Usar variable de entorno o fallback a la key por defecto
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBDxbOwqbR5LBxyB5zObu-jAcZ31GCovH0";

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

  const onLoad = useCallback(() => {
    setIsMapLoaded(true);
    setMapError(null);
  }, []);

  const onError = useCallback((error: Error) => {
    console.error("Google Maps error:", error);
    setMapError("Error al cargar Google Maps. Verifica tu conexión a internet.");
    setIsMapLoaded(false);
  }, []);

  // Calculate center based on all cases
  const getMapCenter = () => {
    if (cases.length === 0) return defaultCenter;
    
    // If there's only one case, center on it
    if (cases.length === 1) {
      return { lat: cases[0].latitude, lng: cases[0].longitude };
    }
    
    // Calculate center of all cases
    const avgLat = cases.reduce((sum, c) => sum + c.latitude, 0) / cases.length;
    const avgLng = cases.reduce((sum, c) => sum + c.longitude, 0) / cases.length;
    return { lat: avgLat, lng: avgLng };
  };

  // Agrupar casos por área para crear zonas de calor
  // Solo considerar casos que necesitan atención (open o in_progress)
  const heatZones = useMemo(() => {
    // Filtrar solo casos que necesitan atención (no resueltos)
    const activeCases = cases.filter(
      (caseItem) => caseItem.status === "open" || caseItem.status === "in_progress"
    );

    if (activeCases.length === 0) return [];

    // Radio de agrupación en grados (aproximadamente 500 metros)
    const clusterRadius = 0.005;
    const zones: Array<{
      center: { lat: number; lng: number };
      cases: AnimalCase[];
      count: number;
    }> = [];

    activeCases.forEach((caseItem) => {
      // Buscar si hay una zona cercana
      let foundZone = false;
      for (const zone of zones) {
        const distance = Math.sqrt(
          Math.pow(caseItem.latitude - zone.center.lat, 2) +
          Math.pow(caseItem.longitude - zone.center.lng, 2)
        );

        if (distance < clusterRadius) {
          // Agregar a zona existente
          zone.cases.push(caseItem);
          // Recalcular centro
          zone.center.lat = zone.cases.reduce((sum, c) => sum + c.latitude, 0) / zone.cases.length;
          zone.center.lng = zone.cases.reduce((sum, c) => sum + c.longitude, 0) / zone.cases.length;
          zone.count = zone.cases.length;
          foundZone = true;
          break;
        }
      }

      if (!foundZone) {
        // Crear nueva zona
        zones.push({
          center: { lat: caseItem.latitude, lng: caseItem.longitude },
          cases: [caseItem],
          count: 1,
        });
      }
    });

    // Filtrar zonas para asegurar que solo contengan casos activos
    // Esto garantiza que si todos los casos de una zona se resuelven, la zona desaparece
    const validZones = zones.filter((zone) => {
      // Verificar que la zona tenga al menos un caso activo
      const hasActiveCases = zone.cases.some(
        (c) => c.status === "open" || c.status === "in_progress"
      );
      return hasActiveCases && zone.count > 0;
    });

    // Recalcular el conteo de cada zona basado solo en casos activos
    return validZones.map((zone) => {
      const activeCasesInZone = zone.cases.filter(
        (c) => c.status === "open" || c.status === "in_progress"
      );
      return {
        ...zone,
        cases: activeCasesInZone,
        count: activeCasesInZone.length,
      };
    });
  }, [cases]);

  // Obtener color y opacidad según la cantidad de casos
  const getHeatZoneColor = (count: number) => {
    if (count >= 5) {
      return { fill: "#ef4444", stroke: "#dc2626", opacity: 0.4 }; // Rojo
    } else if (count >= 3) {
      return { fill: "#f59e0b", stroke: "#d97706", opacity: 0.3 }; // Amarillo
    } else {
      return { fill: "#10b981", stroke: "#059669", opacity: 0.25 }; // Verde
    }
  };

  // Obtener radio según la cantidad de casos
  const getHeatZoneRadius = (count: number) => {
    if (count >= 5) {
      return 400; // Radio más grande para más casos
    } else if (count >= 3) {
      return 300;
    } else {
      return 200;
    }
  };

  return (
    <div className="card" style={{
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: 0,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "1.5rem",
        borderBottom: "1px solid var(--border-color)",
        background: "var(--bg-primary)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
              🗺️
            </div>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}>
                Mapa de Casos
              </h2>
              <p style={{
                margin: "0.25rem 0 0 0",
                fontSize: "var(--font-size-sm)",
                color: "var(--text-secondary)",
              }}>
                {loadingCases ? "Cargando..." : `${cases.length} ${cases.length === 1 ? "caso" : "casos"} en el mapa`}
              </p>
            </div>
          </div>
          
          {cases.length > 0 && (
            <div style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "var(--font-size-xs)",
                color: "var(--text-secondary)",
              }}>
                <span>🔴</span>
                <span>Abierto</span>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "var(--font-size-xs)",
                color: "var(--text-secondary)",
              }}>
                <span>🟡</span>
                <span>En Progreso</span>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "var(--font-size-xs)",
                color: "var(--text-secondary)",
              }}>
                <span>🟢</span>
                <span>Resuelto</span>
              </div>
              <div style={{
                marginLeft: "0.5rem",
                paddingLeft: "0.75rem",
                borderLeft: "1px solid var(--border-color)",
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "var(--font-size-xs)",
                  color: "var(--text-secondary)",
                }}>
                  <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#10b981",
                    opacity: 0.4,
                    border: "1px solid #059669",
                  }} />
                  <span>1-2 casos</span>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "var(--font-size-xs)",
                  color: "var(--text-secondary)",
                }}>
                  <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#f59e0b",
                    opacity: 0.3,
                    border: "1px solid #d97706",
                  }} />
                  <span>3-4 casos</span>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "var(--font-size-xs)",
                  color: "var(--text-secondary)",
                }}>
                  <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    opacity: 0.4,
                    border: "1px solid #dc2626",
                  }} />
                  <span>5+ casos</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mostrar advertencia solo si hay un error real de conexión */}
      {casesError && (
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-color)" }}>
          <div className="alert alert-error" style={{ margin: 0 }}>
            <span>⚠</span>
            <span>{casesError}</span>
          </div>
        </div>
      )}

      {/* Mostrar error si falla Google Maps */}
      {mapError && (
        <div style={{ padding: "1.5rem" }}>
          <div className="alert alert-error">
            <span>⚠</span>
            <span>{mapError}</span>
          </div>
        </div>
      )}

      {/* El mapa siempre se intenta cargar, independientemente de los casos */}
      <div style={{ position: "relative", minHeight: "500px" }}>
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          onLoad={onLoad}
          onError={onError}
        >
          {isMapLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={getMapCenter()}
              zoom={cases.length > 0 ? 13 : 11}
              options={{
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                  },
                ],
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
              }}
            >
              {/* Zonas de calor */}
              {heatZones.map((zone, index) => {
                const color = getHeatZoneColor(zone.count);
                const radius = getHeatZoneRadius(zone.count);
                return (
                  <Circle
                    key={`heat-${index}`}
                    center={zone.center}
                    radius={radius}
                    options={{
                      fillColor: color.fill,
                      fillOpacity: color.opacity,
                      strokeColor: color.stroke,
                      strokeOpacity: 0.6,
                      strokeWeight: 2,
                      clickable: false,
                      zIndex: 1,
                    }}
                  />
                );
              })}

              {/* Marcadores individuales */}
              {cases.map((animalCase) => (
                <Marker
                  key={animalCase.id}
                  position={{ lat: animalCase.latitude, lng: animalCase.longitude }}
                  onClick={() => setSelectedCase(animalCase)}
                  label={{
                    text: getStatusIcon(animalCase.status),
                    fontSize: "16px",
                  }}
                  zIndex={2}
                />
              ))}

              {selectedCase && (
                <InfoWindow
                  position={{ lat: selectedCase.latitude, lng: selectedCase.longitude }}
                  onCloseClick={() => setSelectedCase(null)}
                >
                  <div style={{
                    maxWidth: "250px",
                    padding: "0.5rem",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}>
                        Caso #{selectedCase.id.slice(0, 8)}
                      </h3>
                      <span className={`badge ${selectedCase.status === "open" ? "badge-open" : selectedCase.status === "in_progress" ? "badge-in-progress" : "badge-resolved"}`}>
                        {getStatusLabel(selectedCase.status)}
                      </span>
                    </div>
                    <p style={{
                      margin: "0 0 0.5rem 0",
                      fontSize: "var(--font-size-sm)",
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                    }}>
                      {selectedCase.description}
                    </p>
                    {selectedCase.image_url && (
                      <img
                        src={getImageUrl(selectedCase.image_url || "")}
                        alt="Animal"
                        style={{
                          width: "100%",
                          marginTop: "0.5rem",
                          borderRadius: "var(--border-radius-md)",
                          boxShadow: "var(--shadow-sm)",
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <p style={{
                      margin: "0.5rem 0 0 0",
                      fontSize: "var(--font-size-xs)",
                      color: "var(--text-tertiary)",
                    }}>
                      📍 {selectedCase.latitude.toFixed(6)}, {selectedCase.longitude.toFixed(6)}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--text-secondary)",
              height: "500px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div className="loading" style={{
                width: "2rem",
                height: "2rem",
                margin: "0 auto 1rem",
                borderColor: "var(--primary)",
                borderTopColor: "var(--primary)",
              }} />
              <p>Cargando mapa...</p>
            </div>
          )}
        </LoadScript>
      </div>

      {/* Mensaje amigable cuando no hay casos pero el mapa está cargado */}
      {isMapLoaded && !loadingCases && cases.length === 0 && !casesError && (
        <div style={{
          padding: "2rem 1.5rem",
          textAlign: "center",
          borderTop: "1px solid var(--border-color)",
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
        }}>
          <div style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            lineHeight: 1,
          }}>
            🐾
          </div>
          <h3 style={{
            margin: "0 0 0.5rem 0",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}>
            No hay mascotas por rescatar
          </h3>
          <p style={{
            fontSize: "var(--font-size-sm)",
            margin: 0,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}>
            ¡Excelente! No hay animales que necesiten ayuda en este momento.
            <br />
            Cuando alguien reporte un caso, aparecerá aquí en el mapa.
          </p>
        </div>
      )}
    </div>
  );
};
