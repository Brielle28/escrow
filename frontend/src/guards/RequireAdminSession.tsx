import { useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminSession } from "../providers/AdminSessionProvider";

type RequireAdminSessionProps = {
  children: ReactNode;
};

export function RequireAdminSession({ children }: RequireAdminSessionProps) {
  const { session, isLoading } = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!session && !location.pathname.startsWith("/admin/login")) {
      navigate("/admin/login", { replace: true });
    }
  }, [isLoading, location.pathname, navigate, session]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-gray-500">
        Loading admin…
      </div>
    );
  }

  if (!session) return null;

  return children;
}
