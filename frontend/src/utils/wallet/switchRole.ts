import type { NavigateFunction } from "react-router-dom";
import { clearWalletSession, loadWalletSession } from "../auth/session";

/** Leaves wallet connected in CCC; clears API session and opens role picker. */
export async function beginRoleSwitch(navigate: NavigateFunction, onSessionCleared?: () => void) {
  const session = loadWalletSession();
  if (session?.token) {
    await clearWalletSession(session.token);
  }
  onSessionCleared?.();
  navigate("/connects?switch=1", { replace: true });
}
