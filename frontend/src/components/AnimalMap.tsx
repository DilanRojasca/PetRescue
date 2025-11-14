/**
 * AnimalMap
 * ---------
 * Interactive map component that displays reported animal cases using Google Maps.
 */

import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { getAnimalCases, AnimalCase } from "../services/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

// Default center (Bogotá, Colombia - adjust based on your location)
const defaultCenter = {
  lat: 4.711,
  lng: -74.0721,
};

interface AnimalMapProps {
  refreshTrigger?: number;
}

export const AnimalMap: React.FC<AnimalMapProps> = ({ refreshTrigger }) => {
  const [cases, setCases] = useState<AnimalCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<AnimalCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const GOOGLE_MAPS_API_KEY = "AIzaSyBDxbOwqbR5LBxyB5zObu-jAcZ31GCovH0";

  return (
    <section
      style={{
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <h2>Mapa de casos ({cases.length})</h2>
      {loading && <p>Cargando casos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={cases.length > 0 ? { lat: cases[0].latitude, lng: cases[0].longitude } : defaultCenter}
          zoom={13}
        >
          {cases.map((animalCase) => (
            <Marker
              key={animalCase.id}
              position={{ lat: animalCase.latitude, lng: animalCase.longitude }}
              onClick={() => setSelectedCase(animalCase)}
            />
          ))}

          {selectedCase && (
            <InfoWindow
              position={{ lat: selectedCase.latitude, lng: selectedCase.longitude }}
              onCloseClick={() => setSelectedCase(null)}
            >
              <div style={{ maxWidth: "200px" }}>
                <h3 style={{ margin: "0 0 0.5rem 0" }}>{selectedCase.description}</h3>
                <p style={{ margin: "0.25rem 0" }}>
                  <strong>Estado:</strong> {selectedCase.status}
                </p>
                {selectedCase.image_url && (
                  <img
                    src={`http://localhost:8000${selectedCase.image_url}`}
                    alt="Animal"
                    style={{ width: "100%", marginTop: "0.5rem", borderRadius: "4px" }}
                  />
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </section>
  );
};
