import { Link } from "react-router-dom";
import ArrowRightIcon from "./ArrowRightIcon";
import AvatarStack from "./AvatarStack";
import WireframeGlobe from "./WireframeGlobe";
import ProfileFloatingCard from "./ProfileFloatingCard";
import { heroPeople } from "../../../utils/LandingPage/HeroSection";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-14 lg:py-20" aria-labelledby="hero-heading">
      {/* soft background accents */}
      <div
        className="pointer-events-none absolute -right-24 top-1/4 size-[420px] rounded-full bg-fuchsia-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-12 bottom-0 size-[320px] rounded-full bg-violet-200/25 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <h1
            id="hero-heading"
            className="text-[clamp(3rem,4.5vw,4rem)] font-bold leading-[1.12] tracking-tight text-gray-900"
          >
            Hire verified experts{" "}
            <span className="text-brand-500 text-[clamp(2rem,4.5vw,3rem)]"><br />securely &amp; on time.</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Connect with vetted professionals. We hold payments in escrow until you&apos;re 100% satisfied with the
            work delivered.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/connects"
              className="inline-flex items-center gap-0.5 rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
            >
              <span>Hire Top Talent</span>
              <ArrowRightIcon className="size-[18px] shrink-0" />
            </Link>
            <Link
              to="/connects"
              className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:border-gray-300"
            >
              Apply as a Freelancer
            </Link>
          </div>

          <div className="mt-10">
            <AvatarStack />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-none">
          <div className="relative aspect-square max-h-[440px] min-h-[280px] w-full">
            <WireframeGlobe className="absolute inset-0 size-full max-h-[440px] opacity-90" />

            <ProfileFloatingCard
              name="David Boskovic"
              role="Web Developer"
              imageSrc={heroPeople.david}
              className="left-0 top-[8%] z-10 lg:left-[4%]"
            />
            <ProfileFloatingCard
              name="Wade Warren"
              role="UI/UX Designer"
              imageSrc={heroPeople.wade}
              className="bottom-[12%] right-0 z-10 lg:right-[6%]"
            />
            <ProfileFloatingCard
              name="Sarah Lin"
              role="Product Designer"
              imageSrc={heroPeople.sarah}
              blur
              className="left-[12%] top-[42%]"
            />
            <ProfileFloatingCard
              name="James Cole"
              role="Motion Designer"
              imageSrc={heroPeople.david}
              blur
              className="right-[8%] top-[28%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
