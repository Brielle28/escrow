import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { safetyVisualImage } from "../../../utils/LandingPage/Safety";

function SafetyVisualPanel() {
  return (
    <div className="flex flex-col overflow-hidden border border-white/10 bg-[#0c1017] shadow-2xl rounded-4xl p-4 md:p-5">
      <div className="relative aspect-4/3 w-full shrink-0 bg-black rounded-4xl">
        <img
          src={safetyVisualImage}
          alt=""
          className="absolute inset-0 size-full object-cover rounded-4xl"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="border-t border-white/10 bg-[#0c1017] mt-3 md:mt-7">
        <div className="border border-gray-200 bg-white p-5 shadow-sm rounded-4xl md:p-6">
          <div className="flex gap-4">
            <div className="flex shrink-0 items-start pt-0.5">
              <ShieldCheck className="size-9 text-brand-500" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold leading-snug text-gray-900">Bank-Level Security</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Your data and payments are protected with 256-bit SSL encryption
              </p>
              <Link
                to="#"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600"
              >
                Learn More
                <ArrowRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SafetyVisualPanel;
