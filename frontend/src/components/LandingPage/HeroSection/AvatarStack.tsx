import { trustedAvatars } from "../../../utils/LandingPage/HeroSection";

function AvatarStack() {
    return (
      <div className="flex items-center gap-4">
        <div className="flex -space-x-3">
          {trustedAvatars.map((src) => (
            <div
              key={src}
              className="relative inline-flex size-11 shrink-0 overflow-hidden rounded-full border-2 border-white ring-1 ring-gray-100"
            >
              <img src={src} alt="" className="size-full object-cover" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <div className="leading-tight">
          <p className="text-sm text-gray-500">Trusted by</p>
          <p className="text-base font-bold text-gray-900">1,000+ Businesses</p>
        </div>
      </div>
    );
  }
  export default AvatarStack;