/**
 * AnimalReportForm
 * -----------------
 * Form for creating new animal cases with photo upload and automatic
 * GPS extraction from EXIF data. Also supports getting current location.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { createAnimalCase, uploadImage } from "../services/api";

interface AnimalReportFormProps {
  onReportCreated?: () => void;
}

export const AnimalReportForm: React.FC<AnimalReportFormProps> = ({ onReportCreated }) => {
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [useManualCoords, setUseManualCoords] = useState(false);
  
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Usar variable de entorno o fallback a la key por defecto
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBDxbOwqbR5LBxyB5zObu-jAcZ31GCovH0";

  const processFile = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande. Máximo 10MB");
      return;
    }

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
    
    // Upload and extract EXIF
    const uploadToast = toast.loading("Subiendo imagen y extrayendo coordenadas...");
    try {
      setUploading(true);
      
      const result = await uploadImage(file);
      setImageUrl(result.image_url);
      
      if (result.has_gps && result.latitude && result.longitude) {
        setLatitude(result.latitude.toString());
        setLongitude(result.longitude.toString());
        toast.success("✓ Coordenadas extraídas automáticamente de la foto!", { id: uploadToast });
      } else {
        toast.success("✓ Imagen subida. No se encontraron coordenadas GPS en la foto.", { id: uploadToast });
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      const errorMessage = error?.response?.data?.detail || error?.message || "Error al subir la imagen";
      toast.error(errorMessage, { id: uploadToast });
      // Reset preview on error
      setPreviewUrl("");
      setSelectedFile(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleAddressSearch = async () => {
    if (!address.trim()) {
      toast.error("Por favor ingresa una dirección");
      return;
    }

    setGeocoding(true);
    const geocodeToast = toast.loading("Buscando dirección...");

    try {
      const { geocodeAddress } = await import("../services/api");
      const result = await geocodeAddress(address, GOOGLE_MAPS_API_KEY);

      if (result) {
        setLatitude(result.lat.toString());
        setLongitude(result.lng.toString());
        toast.success("✓ Dirección encontrada!", { id: geocodeToast });
      } else {
        toast.error("No se pudo encontrar la dirección. Intenta ser más específico.", { id: geocodeToast });
      }
    } catch (error) {
      toast.error("Error al buscar la dirección", { id: geocodeToast });
      console.error(error);
    } finally {
      setGeocoding(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalización no disponible en este navegador");
      return;
    }

    setGettingLocation(true);
    const locationToast = toast.loading("Obteniendo tu ubicación precisa...");

    // Options for high accuracy location
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        
        toast.success(`✓ Ubicación obtenida! (Precisión: ${accuracy.toFixed(0)}m)`, { id: locationToast });
        setGettingLocation(false);
      },
      (error) => {
        let errorMessage = "Error al obtener ubicación";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso denegado. Permite el acceso a tu ubicación en el navegador.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Ubicación no disponible. Verifica tu GPS.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado. Intenta de nuevo.";
            break;
        }
        
        toast.error(errorMessage, { id: locationToast });
        setGettingLocation(false);
      },
      options
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate coordinates
    if (!latitude || !longitude) {
      toast.error("Por favor proporciona las coordenadas del animal");
      return;
    }

    const latNum = Number(latitude);
    const lngNum = Number(longitude);

    if (isNaN(latNum) || isNaN(lngNum)) {
      toast.error("Las coordenadas deben ser números válidos");
      return;
    }

    if (latNum < -90 || latNum > 90) {
      toast.error("La latitud debe estar entre -90 y 90");
      return;
    }

    if (lngNum < -180 || lngNum > 180) {
      toast.error("La longitud debe estar entre -180 y 180");
      return;
    }

    try {
      setSubmitting(true);
      const submitToast = toast.loading("Creando reporte...");

      const payload: {
        description: string;
        latitude: number;
        longitude: number;
        image_url?: string;
      } = {
        description: description.trim(),
        latitude: latNum,
        longitude: lngNum,
      };

      if (imageUrl && imageUrl.trim()) {
        payload.image_url = imageUrl;
      }

      await createAnimalCase(payload);

      toast.success("✓ Reporte creado exitosamente!", { id: submitToast });
      
      // Reset form
      setDescription("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      setImageUrl("");
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
      setUseManualCoords(false);
      
      // Notify parent component
      if (onReportCreated) {
        onReportCreated();
      }
    } catch (error: any) {
      console.error("Error creating report:", error);
      const errorMessage = error?.response?.data?.detail || error?.message || "Error al crear el reporte";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="card"
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
      }}
    >
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
          📝
        </div>
        <h2 style={{
          margin: 0,
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "var(--text-primary)",
        }}>
          Reportar Animal
        </h2>
      </div>


      <div style={{ marginBottom: "1.5rem" }}>
        <label className="label">
          Descripción del caso
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Perro herido en la pata trasera, necesita ayuda urgente. Se encuentra cerca del parque principal..."
          className="textarea"
          rows={4}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label className="label">
          📸 Foto del animal
        </label>
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragging ? "var(--primary)" : "var(--border-color)",
            backgroundColor: isDragging ? "rgba(99, 102, 241, 0.05)" : previewUrl ? "transparent" : "var(--bg-secondary)",
            scale: isDragging ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{
            border: `2px dashed ${isDragging ? "var(--primary)" : "var(--border-color)"}`,
            borderRadius: "var(--border-radius-md)",
            padding: "1.5rem",
            textAlign: "center",
            transition: "all var(--transition-base)",
            background: previewUrl ? "transparent" : "var(--bg-secondary)",
            cursor: "pointer",
          }}
        >
          {previewUrl ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  borderRadius: "var(--border-radius-md)",
                  boxShadow: "var(--shadow-md)",
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setPreviewUrl("");
                  setSelectedFile(null);
                  setImageUrl("");
                  // Reset file input
                  const fileInput = document.getElementById("file-upload") as HTMLInputElement;
                  if (fileInput) {
                    fileInput.value = "";
                  }
                }}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--status-open)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                fontSize: "3rem",
                marginBottom: "0.5rem",
              }}>
                📷
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                style={{
                  display: "none",
                }}
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="btn btn-primary"
                style={{
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                {uploading ? (
                  <>
                    <span className="loading" />
                    Subiendo...
                  </>
                ) : (
                  "Seleccionar imagen"
                )}
              </label>
              <p style={{
                marginTop: "0.5rem",
                fontSize: "var(--font-size-sm)",
                color: "var(--text-secondary)",
              }}>
                La imagen puede contener coordenadas GPS automáticas
              </p>
            </div>
          )}
          {uploading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: "1rem",
                width: "100%",
              }}
            >
              <div style={{
                width: "100%",
                height: "8px",
                background: "var(--bg-secondary)",
                borderRadius: "4px",
                overflow: "hidden",
              }}>
                <motion.div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)",
                    borderRadius: "4px",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress || 50}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p style={{
                marginTop: "0.5rem",
                fontSize: "var(--font-size-xs)",
                color: "var(--text-secondary)",
              }}>
                Subiendo imagen...
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div style={{
        marginBottom: "1.5rem",
        padding: "1.5rem",
        background: "var(--bg-secondary)",
        borderRadius: "var(--border-radius-lg)",
        border: "1px solid var(--border-color)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}>
          <span style={{ fontSize: "1.25rem" }}>📍</span>
          <h3 style={{
            margin: 0,
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}>
            Ubicación del animal
          </h3>
        </div>
        
        <div style={{ marginBottom: "1rem" }}>
          <label className="label">Buscar por dirección</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Calle 26 #57-83, Bogotá"
              className="input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddressSearch();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              disabled={geocoding || !address.trim()}
              className="btn btn-primary"
            >
              {geocoding ? (
                <>
                  <span className="loading" />
                  Buscando...
                </>
              ) : (
                "🔍 Buscar"
              )}
            </button>
          </div>
        </div>

        <div style={{
          margin: "1rem 0",
          textAlign: "center",
          color: "var(--text-tertiary)",
          fontSize: "var(--font-size-sm)",
        }}>
          ── o ──
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            className="btn btn-secondary"
            style={{ width: "100%" }}
          >
            {gettingLocation ? (
              <>
                <span className="loading" />
                Obteniendo ubicación...
              </>
            ) : (
              "📍 Usar mi ubicación actual"
            )}
          </button>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "var(--font-size-sm)",
            color: "var(--text-secondary)",
          }}>
            <input
              type="checkbox"
              checked={useManualCoords}
              onChange={(e) => setUseManualCoords(e.target.checked)}
              style={{
                marginRight: "0.5rem",
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />
            Ingresar coordenadas manualmente
          </label>
        </div>

        {useManualCoords && (
          <div style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-color)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}>
            <div>
              <label className="label">Latitud</label>
              <input
                required
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                step="0.000001"
                placeholder="Ej: 4.711"
                className="input"
              />
            </div>
            <div>
              <label className="label">Longitud</label>
              <input
                required
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                step="0.000001"
                placeholder="Ej: -74.0721"
                className="input"
              />
            </div>
          </div>
        )}

        {!useManualCoords && latitude && longitude && (
          <div style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: "rgba(99, 102, 241, 0.1)",
            borderRadius: "var(--border-radius-md)",
            fontSize: "var(--font-size-sm)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}>
            <span>✓</span>
            <span>
              <strong>Coordenadas:</strong> {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
            </span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting || uploading || !description.trim() || !latitude || !longitude}
        className="btn btn-primary"
        style={{
          width: "100%",
          padding: "0.875rem 1.5rem",
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        {submitting ? (
          <>
            <span className="loading" />
            Creando reporte...
          </>
        ) : (
          "🚀 Enviar Reporte"
        )}
      </button>
      {(!latitude || !longitude) && (
        <p style={{
          marginTop: "0.5rem",
          fontSize: "var(--font-size-xs)",
          color: "var(--text-secondary)",
          textAlign: "center",
        }}>
          ⚠️ Debes proporcionar las coordenadas antes de enviar
        </p>
      )}
    </motion.form>
  );
};
