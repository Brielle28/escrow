import type { ReactNode } from "react";
import { LandingLayout } from "./LandingLayout";

type ArticleLayoutProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function ArticleLayout({ eyebrow, title, description, children }: ArticleLayoutProps) {
  return (
    <LandingLayout>
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-3xl px-6 pb-16 pt-10 sm:pb-20 sm:pt-12 lg:max-w-4xl lg:pb-24 lg:pt-14">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h1>
          {description ? (
            <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-gray-600 sm:text-lg">{description}</p>
          ) : null}
          <div className="mt-10 space-y-5 text-sm leading-relaxed text-gray-600 sm:text-base [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:first:mt-0 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_a]:font-semibold [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-700">
            {children}
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
