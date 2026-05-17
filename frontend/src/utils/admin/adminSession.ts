export type AdminSession = {
  token: string;
  address: string;
  createdAt: number;
  expiresAt: number;
};

const storageKey = "escrow.adminSession";

export function loadAdminSession(): AdminSession | null {
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.token || !parsed.address) return null;
    if (parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(storageKey);
      return null;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function saveAdminSession(session: AdminSession): void {
  window.localStorage.setItem(storageKey, JSON.stringify(session));
}

export function clearAdminSession(): void {
  window.localStorage.removeItem(storageKey);
}
