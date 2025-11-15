import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for the PetRescue React frontend.
// This keeps things minimal but ready for local development.
export default defineConfig({
  plugins: [react()],
  base: "/PetRescue/", // GitHub Pages base path
  server: {
    port: 5173
  }
});
