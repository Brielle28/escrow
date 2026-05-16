import { ContactForm } from "../components/Contact/ContactForm";
import { ContactHero } from "../components/Contact/ContactHero";
import { LandingLayout } from "../layouts/LandingLayout";

export function ContactPage() {
  return (
    <LandingLayout>
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
          <div className="mx-auto w-full max-w-2xl space-y-8 sm:max-w-3xl sm:space-y-10 md:max-w-4xl lg:max-w-5xl">
            <ContactHero />
            <ContactForm />
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
