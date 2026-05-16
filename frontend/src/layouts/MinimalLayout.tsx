import type { ReactNode } from "react";

type MinimalLayoutProps = {
  children: ReactNode;
};

/** Full-page shell without global nav or footer — for focused flows (e.g. public talent profile). */
export function MinimalLayout({ children }: MinimalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      <main className="w-full flex-1">{children}</main>
    </div>
  );
}
