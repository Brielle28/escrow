import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearWalletSession,
  loadWalletSession,
  type ActingRole,
  type WalletSession,
} from "../utils/auth/session";

type SessionContextValue = {
  session: WalletSession | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refresh: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<WalletSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setSession(loadWalletSession());
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const signOut = useCallback(async () => {
    const current = loadWalletSession();
    await clearWalletSession(current?.token);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, isLoading, signOut, refresh }),
    [session, isLoading, signOut, refresh],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

export function useRequiredRole(role: ActingRole): WalletSession {
  const { session, isLoading } = useSession();
  if (isLoading) throw new Error("Session still loading");
  if (!session || session.role !== role) {
    throw new Error("Session role mismatch");
  }
  return session;
}
