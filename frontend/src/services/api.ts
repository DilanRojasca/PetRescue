/**
 * api.ts
 * ------
 * Small helper for calling the PetRescue backend API.
 *
 * Centralizing the base URL here will make it easy to switch between
 * localhost and a deployed environment during the hackathon.
 */

import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export interface AnimalCasePayload {
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string;
}

export interface AnimalCase {
  id: string;
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
  return response.data;
}

export async function getAnimalCases(): Promise<AnimalCase[]> {
  const response = await axios.get(`${BASE_URL}/animals/`);
  return response.data;
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
  return response.data;
}
