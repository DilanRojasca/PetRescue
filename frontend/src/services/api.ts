/**
 * api.ts
 * ------
 * Small helper for calling the PetRescue backend API.
 *
 * Centralizing the base URL here will make it easy to switch between
 * localhost and a deployed environment during the hackathon.
 */

import axios from "axios";

// Usar variable de entorno o fallback a localhost para desarrollo
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const BASE_URL = `${API_BASE_URL}/api/v1`;

// Función helper para obtener la URL completa de una imagen
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  // Si ya es una URL completa, devolverla tal cual
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  // Si es una ruta relativa, construir la URL completa
  return `${API_BASE_URL}${imagePath}`;
};

export interface AnimalCasePayload {
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string;
}

export interface AnimalCase {
  id: string | number;  // El backend devuelve number, pero lo convertimos a string
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  status: string;
}

export interface UploadImageResponse {
  image_url: string;
  latitude: number | null;
  longitude: number | null;
  has_gps: boolean;
}

export async function createAnimalCase(payload: AnimalCasePayload): Promise<AnimalCase> {
  const response = await axios.post(`${BASE_URL}/animals/`, payload);
  // Convertir ID numérico a string para consistencia
  return {
    ...response.data,
    id: String(response.data.id),
  };
}

export async function getAnimalCases(): Promise<AnimalCase[]> {
  try {
    const response = await axios.get(`${BASE_URL}/animals/`);
    // Si la respuesta es exitosa, devolvemos los datos (puede ser un array vacío)
    const data = response.data || [];
    // Convertir IDs numéricos a strings para consistencia
    return data.map((case_: any) => ({
      ...case_,
      id: String(case_.id),
    }));
  } catch (error: any) {
    // Re-lanzamos el error para que el componente pueda manejarlo
    // pero preservamos la información del error
    if (error.response) {
      // El servidor respondió con un código de error
      throw error;
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      const networkError = new Error('Network Error');
      (networkError as any).code = 'ERR_NETWORK';
      (networkError as any).isNetworkError = true;
      throw networkError;
    } else {
      // Algo más pasó
      throw error;
    }
  }
}

export async function uploadImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
}

export async function geocodeAddress(address: string, apiKey: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: address,
          key: apiKey,
        },
      }
    );

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    }
    return null;
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
}

export async function deleteAnimalCase(caseId: string): Promise<void> {
  await axios.delete(`${BASE_URL}/animals/${caseId}`);
}

export async function updateAnimalCase(caseId: string, payload: Partial<AnimalCasePayload> & { status?: string }): Promise<AnimalCase> {
  const response = await axios.put(`${BASE_URL}/animals/${caseId}`, payload);
  // Convertir ID numérico a string para consistencia
  return {
    ...response.data,
    id: String(response.data.id),
  };
}
