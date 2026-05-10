import { Link } from "react-router-dom";
import { Lock, Star } from "lucide-react";
import ArrowRightIcon from "../HeroSection/ArrowRightIcon";

function DashedVerticalPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-0 w-[85%] opacity-[0.22]"
      aria-hidden
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0px, transparent 14px, rgba(255,255,255,0.35) 14px, rgba(255,255,255,0.35) 15px)",
      }}
    />
  );
}

export function ReadyToWorkSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#141922] py-12 text-white lg:py-14"
      aria-labelledby="ready-cta-heading"
    >
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-stretch gap-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
          <div className="relative order-2 min-h-[230px] sm:min-h-[260px] lg:order-1">
            <DashedVerticalPattern />
            <div className="relative z-10 pt-1">
              {/* Escrow status card */}
              <div className="relative z-10 rounded-2xl border border-white/10 bg-[#1c222e] p-3.5 shadow-xl shadow-black/40 sm:p-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20"
                    aria-hidden
                  >
                    <Lock className="size-5 text-brand-500" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[1.1rem] font-bold tracking-tight">Escrow Secured</p>
                    <p className="mt-0.5 text-[0.95rem] text-gray-400">Funds held until approval</p>
                  </div>
                  <div className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-brand-500">
                    $4,500
                  </div>
                </div>
              </div>

              {/* Profile card — offset below escrow card */}
              <div className="relative z-20 mt-4 ml-3 max-w-[92%] rounded-2xl border border-white/10 bg-[#1c222e] p-3.5 shadow-xl shadow-black/40 sm:mt-5 sm:ml-4 sm:p-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#252b38] text-sm font-bold text-brand-500 ring-2 ring-white/10">
                      SJ
                    </div>
                    <span
                      className="absolute bottom-0 right-0 size-3 rounded-full bg-brand-500 ring-2 ring-[#1c222e]"
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[1.1rem] font-bold tracking-tight">Sarah J.</p>
                    <p className="mt-0.5 text-[0.95rem] text-gray-400">Full-Stack Developer</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums">
                    <Star className="size-4 fill-amber-400 text-amber-400" strokeWidth={0} aria-hidden />
                    5.0
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2
              id="ready-cta-heading"
              className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[3.2rem]"
            >
              Ready to work smarter?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
              Whether you&apos;re looking to hire top talent or find your next great project, WorkNest is the platform that
              makes it happen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/connects"
                className="inline-flex items-center gap-1 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600"
              >
                Hire Top Talent
                <ArrowRightIcon className="size-[18px] shrink-0" />
              </Link>
              <Link
                to="/connects"
                className="inline-flex items-center rounded-xl border border-gray-500/80 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-gray-400 hover:bg-white/5"
              >
                Apply as a Freelancer
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">Join 50,000+ professionals already on Escrow</p>
          </div>
        </div>
      </div>
    </section>
  );
}
