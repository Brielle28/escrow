import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch } from "../api/http";
import { clearAdminSession, loadAdminSession, saveAdminSession, type AdminSession } from "../utils/admin/adminSession";

type AdminSessionContextValue = {
  session: AdminSession | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refresh: () => void;
};

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setSession(loadAdminSession());
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const signOut = useCallback(async () => {
    const current = loadAdminSession();
    if (current?.token) {
      await apiFetch("/api/admin/session", { method: "DELETE", token: current.token }).catch(() => undefined);
    }
    clearAdminSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, isLoading, signOut, refresh }),
    [session, isLoading, signOut, refresh],
  );

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession(): AdminSessionContextValue {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error("useAdminSession must be used within AdminSessionProvider");
  return ctx;
}

export function saveAdminSessionFromVerify(data: {
  token: string;
  session: { address: string; createdAt: number; expiresAt: number };
}): AdminSession {
  const full: AdminSession = { token: data.token, ...data.session };
  saveAdminSession(full);
  return full;
}
