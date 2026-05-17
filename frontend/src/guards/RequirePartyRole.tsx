import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../providers/SessionProvider";
import type { ActingRole } from "../utils/auth/session";

type RequirePartyRoleProps = {
  role: ActingRole;
  children: ReactNode;
};

export function RequirePartyRole({ role, children }: RequirePartyRoleProps) {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      navigate(`/connects?returnUrl=${encodeURIComponent(window.location.pathname)}`, { replace: true });
      return;
    }
    if (session.role !== role) {
      navigate(session.role === "client" ? "/dashboard/client" : "/dashboard/freelancer", { replace: true });
    }
  }, [isLoading, navigate, role, session]);

  if (isLoading || !session || session.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  return children;
}
