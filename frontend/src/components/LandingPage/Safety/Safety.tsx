import { safetySectionBgImage } from "../../../utils/LandingPage/Safety";
import SafetyFeaturesCard from "./SafetyFeaturesCard";
import SafetyVisualPanel from "./SafetyVisualPanel";

export function Safety() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24" aria-labelledby="safety-heading">
      <div className="absolute inset-0">
        <img
          src={safetySectionBgImage}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover blur-md"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
          <SafetyFeaturesCard />
          <SafetyVisualPanel />
        </div>
      </div>
    </section>
  );
}
