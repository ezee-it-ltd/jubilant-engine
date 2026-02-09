import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import "./index.css";

function DevBadge() {
  if (!import.meta.env.DEV) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        right: 8,
        fontSize: 11,
        opacity: 0.5,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {window.location.origin}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
        <DevBadge />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
