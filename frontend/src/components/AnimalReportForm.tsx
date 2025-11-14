/**
 * AnimalReportForm
 * -----------------
 * Form for creating new animal cases with photo upload and automatic
 * GPS extraction from EXIF data. Also supports getting current location.
 */

import React, { useState } from "react";
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const GOOGLE_MAPS_API_KEY = "AIzaSyBDxbOwqbR5LBxyB5zObu-jAcZ31GCovH0";

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    
    // Upload and extract EXIF
    try {
      setUploading(true);
      setMessage({ type: "success", text: "Subiendo imagen y extrayendo coordenadas..." });
      
      const result = await uploadImage(file);
      setImageUrl(result.image_url);
      
      if (result.has_gps && result.latitude && result.longitude) {
        setLatitude(result.latitude.toString());
        setLongitude(result.longitude.toString());
        setMessage({ type: "success", text: "✓ Coordenadas extraídas automáticamente de la foto!" });
      } else {
        setMessage({ type: "success", text: "✓ Imagen subida. No se encontraron coordenadas GPS en la foto." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al subir la imagen" });
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddressSearch = async () => {
    if (!address.trim()) {
      setMessage({ type: "error", text: "Por favor ingresa una dirección" });
      return;
    }

    setGeocoding(true);
    setMessage({ type: "success", text: "Buscando dirección..." });

    try {
      const { geocodeAddress } = await import("../services/api");
      const result = await geocodeAddress(address, GOOGLE_MAPS_API_KEY);

      if (result) {
        setLatitude(result.lat.toString());
        setLongitude(result.lng.toString());
        setMessage({ type: "success", text: "✓ Dirección encontrada!" });
      } else {
        setMessage({ type: "error", text: "No se pudo encontrar la dirección. Intenta ser más específico." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al buscar la dirección" });
      console.error(error);
    } finally {
      setGeocoding(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage({ type: "error", text: "Geolocalización no disponible en este navegador" });
      return;
    }

    setGettingLocation(true);
    setMessage({ type: "success", text: "Obteniendo tu ubicación precisa..." });

    // Options for high accuracy location
    const options = {
      enableHighAccuracy: true,  // Request GPS if available
      timeout: 10000,            // Wait up to 10 seconds
      maximumAge: 0              // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        
        console.log("Ubicación obtenida:", {
          lat,
          lng,
          accuracy: `${accuracy.toFixed(0)} metros`,
          timestamp: new Date(position.timestamp).toLocaleString()
        });
        
        setMessage({ 
          type: "success", 
          text: `✓ Ubicación obtenida! (Precisión: ${accuracy.toFixed(0)}m)` 
        });
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
        
        setMessage({ type: "error", text: errorMessage });
        setGettingLocation(false);
      },
      options
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage({ type: "success", text: "Creando reporte..." });

      await createAnimalCase({
        description,
        latitude: Number(latitude),
        longitude: Number(longitude),
        image_url: imageUrl || undefined,
      });

      setMessage({ type: "success", text: "✓ Reporte creado exitosamente!" });
      
      // Reset form
      setDescription("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      setImageUrl("");
      setSelectedFile(null);
      setPreviewUrl("");
      setUseManualCoords(false);
      
      // Notify parent component
      if (onReportCreated) {
        onReportCreated();
      }

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Error al crear el reporte" });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <h2>Reportar animal</h2>

      {message && (
        <div
          style={{
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "0.25rem",
            background: message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24",
            border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {message.text}
        </div>
      )}

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Descripción
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Perro herido en la pata trasera, necesita ayuda urgente"
          style={{ width: "100%", minHeight: "4rem", padding: "0.5rem" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        📸 Foto del animal
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: "block", marginTop: "0.25rem" }}
        />
        {uploading && <small style={{ color: "#666" }}>Subiendo...</small>}
      </label>

      {previewUrl && (
        <div style={{ marginBottom: "0.5rem" }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: "200px", borderRadius: "4px", border: "1px solid #ddd" }}
          />
        </div>
      )}

      <div style={{ 
        marginBottom: "1rem", 
        padding: "1rem", 
        background: "#f8f9fa", 
        borderRadius: "0.5rem",
        border: "1px solid #dee2e6" 
      }}>
        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>📍 Ubicación del animal</h3>
        
        {/* Address input */}
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Dirección
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Calle 26 #57-83, Bogotá"
              style={{ flex: 1, padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ccc" }}
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
              style={{
                padding: "0.5rem 1rem",
                background: geocoding ? "#6c757d" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "0.25rem",
                cursor: geocoding || !address.trim() ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {geocoding ? "Buscando..." : "🔍 Buscar"}
            </button>
          </div>
        </label>

        <div style={{ margin: "1rem 0", textAlign: "center", color: "#666" }}>
          <small>── o ──</small>
        </div>

        {/* Current location button */}
        <div style={{ marginBottom: "1rem" }}>
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            style={{
              width: "100%",
              padding: "0.5rem 1rem",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: gettingLocation ? "not-allowed" : "pointer",
            }}
          >
            {gettingLocation ? "Obteniendo..." : "📍 Usar mi ubicación actual"}
          </button>
        </div>

        {/* Toggle manual coordinates */}
        <div style={{ marginBottom: "0.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={useManualCoords}
              onChange={(e) => setUseManualCoords(e.target.checked)}
              style={{ marginRight: "0.5rem" }}
            />
            <small>Ingresar coordenadas manualmente</small>
          </label>
        </div>

        {/* Manual coordinates (collapsed by default) */}
        {useManualCoords && (
          <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #dee2e6" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Latitud
              <input
                required
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                step="0.000001"
                placeholder="Ej: 4.711"
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Longitud
              <input
                required
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                step="0.000001"
                placeholder="Ej: -74.0721"
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #ccc" }}
              />
            </label>
          </div>
        )}

        {/* Show coordinates if set (but not in manual mode) */}
        {!useManualCoords && latitude && longitude && (
          <div style={{ 
            marginTop: "0.5rem", 
            padding: "0.5rem", 
            background: "#e7f3ff", 
            borderRadius: "0.25rem",
            fontSize: "0.875rem" 
          }}>
            <strong>Coordenadas:</strong> {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting || uploading}
        style={{
          padding: "0.75rem 1.5rem",
          background: submitting ? "#6c757d" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "0.25rem",
          cursor: submitting ? "not-allowed" : "pointer",
          fontSize: "1rem",
        }}
      >
        {submitting ? "Enviando..." : "Enviar reporte"}
      </button>
    </form>
  );
};
