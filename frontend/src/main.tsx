import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./AppRouter.tsx";
import { CccProvider } from "./providers/CccProvider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CccProvider>
      <AppRouter />
    </CccProvider>
  </StrictMode>,
);
