import { Mail } from "lucide-react";
import { contactPageCopy } from "../../utils/Contact/contactCopy";

export function ContactHero() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-gray-50/60 px-6 py-10 ring-1 ring-black/5 sm:px-10 sm:py-12 lg:px-12">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-600">{contactPageCopy.heroEyebrow}</p>
      <h1 className="mt-3 max-w-2xl text-balance text-3xl font-bold tracking-tight text-gray-900 sm:max-w-3xl sm:text-4xl md:max-w-4xl lg:max-w-5xl">
        {contactPageCopy.heroTitle}
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-gray-600 sm:max-w-3xl sm:text-lg md:max-w-4xl lg:max-w-5xl">
        {contactPageCopy.heroSubtitle}
      </p>
      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 shadow-sm">
        <Mail className="size-4 shrink-0 text-brand-500" strokeWidth={2} aria-hidden />
        <span>support@escrow.example</span>
      </div>
    </section>
  );
}
