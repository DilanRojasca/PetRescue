/**
 * Main React entrypoint.
 *
 * This file mounts the root <App /> component into the DOM.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { App } from "./App";
import "./styles/global.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' not found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "rgba(255, 255, 255, 0.95)",
          color: "#111827",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  </React.StrictMode>
);
