import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./AppRouter.tsx";
import { CccProvider } from "./providers/CccProvider.tsx";
import { SessionProvider } from "./providers/SessionProvider.tsx";
import { AdminSessionProvider } from "./providers/AdminSessionProvider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CccProvider>
      <SessionProvider>
        <AdminSessionProvider>
          <AppRouter />
        </AdminSessionProvider>
      </SessionProvider>
    </CccProvider>
  </StrictMode>,
);
