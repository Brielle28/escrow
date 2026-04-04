import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CccProvider } from "./providers/CccProvider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CccProvider>
      <App />
    </CccProvider>
  </StrictMode>,
);
