import type { ReactNode } from "react";
import { FloatingAppButton } from "../components/wallet/FloatingAppButton";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

type LandingLayoutProps = {
  children: ReactNode;
};

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      <Navbar />
      <main className="w-full flex-1">{children}</main>
      <FloatingAppButton />
      <Footer />
    </div>
  );
}
