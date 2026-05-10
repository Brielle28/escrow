import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadWalletSession, type ActingRole } from "../utils/auth/session";

type RequireWalletSessionProps = {
  role: ActingRole;
  children: ReactNode;
};

/** Ensures local wallet session exists and matches the expected role before rendering children. */
export function RequireWalletSession({ role, children }: RequireWalletSessionProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const session = loadWalletSession();
    if (!session || session.role !== role) {
      navigate("/connects", { replace: true });
    }
  }, [navigate, role]);

  const session = loadWalletSession();
  if (!session || session.role !== role) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-6 text-sm text-gray-500">
        Redirecting to connect…
      </div>
    );
  }

  return children;
}
