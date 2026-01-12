import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root") as HTMLElement | null;

if (!rootEl) {
  throw new Error("Root element #root not found. Check index.html has <div id='root'></div>.");
}

createRoot(rootEl).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
