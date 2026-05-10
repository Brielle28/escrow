import { howItWorksSteps } from "../../../utils/LandingPage/HowItWorks";
import HowItWorksStepCard from "./HowItWorksStepCard";

export function HowItWorks() {
  return (
    <section
      className="border-t border-gray-200 bg-linear-to-b from-gray-50 via-white to-gray-50/90 py-16 lg:py-24"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Escrow on CKB</p>
          <h2
            id="how-it-works-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
          >
            How escrow works
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600 md:text-lg">
            From match to payout — five clear stages. Connect your wallet and follow the chain-backed flow with
            confidence.
          </p>
        </div>

        <ol className="mt-12 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {howItWorksSteps.map((s) => (
            <li key={s.step}>
              <HowItWorksStepCard step={s.step} title={s.title} description={s.description} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
