import { Play } from "lucide-react";
import { useMemo, useState } from "react";
import type { MarketFreelancer } from "../../utils/FindTalent/types";
import { freelancerDetailCopy } from "../../utils/FindTalent/findTalentCopy";
import { formatHourlyRange } from "../../utils/FindTalent/talentData";

export type ProfileTabId = "about" | "work" | "employment" | "skills" | "certs" | "education";

const tabs: { id: ProfileTabId; label: string }[] = [
  { id: "about", label: freelancerDetailCopy.tabAbout },
  { id: "work", label: freelancerDetailCopy.tabWorkHistory },
  { id: "employment", label: freelancerDetailCopy.tabEmployment },
  { id: "skills", label: freelancerDetailCopy.tabSkills },
  { id: "certs", label: freelancerDetailCopy.tabCertifications },
  { id: "education", label: freelancerDetailCopy.tabEducation },
];

type FreelancerProfileTabsProps = {
  freelancer: MarketFreelancer;
};

const tabListClass =
  "flex w-full min-h-11 flex-nowrap items-stretch justify-between gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1";
const tabBtnBase =
  "flex shrink-0 items-center justify-center border-0 rounded-lg px-2 py-2 text-center text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:px-3";
const tabInactive = "bg-transparent text-gray-600 hover:bg-white/90 hover:text-gray-900";
const tabActive = "bg-white text-gray-900 shadow-sm ring-2 ring-brand-500 ring-offset-0";

const panelClass = "rounded-2xl bg-gray-50/70 p-5 sm:p-6";

export function FreelancerProfileTabs({ freelancer }: FreelancerProfileTabsProps) {
  const [tab, setTab] = useState<ProfileTabId>("about");
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const firstName = useMemo(() => freelancer.displayName.split(" ")[0] ?? freelancer.displayName, [freelancer.displayName]);

  return (
    <div className="min-w-0">
      <div role="tablist" aria-label="Profile sections" className={tabListClass}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            id={`tab-${t.id}`}
            aria-controls={`panel-${t.id}`}
            className={`${tabBtnBase} ${tab === t.id ? tabActive : tabInactive}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "about" ? (
          <div role="tabpanel" id="panel-about" aria-labelledby="tab-about" className={panelClass}>
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">{freelancerDetailCopy.aboutHeading(firstName)}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-900">
                {freelancerDetailCopy.rateChip}: {formatHourlyRange(freelancer.hourlyMinCkb, freelancer.hourlyMaxCkb)}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800">
                {freelancerDetailCopy.languageChip}: {freelancer.languagesLabel}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800">
                {freelancer.category}
              </span>
            </div>

            {freelancer.aboutVideoPosterSrc ? (
              <div className="relative mt-6 overflow-hidden rounded-2xl shadow-sm">
                <img
                  src={freelancer.aboutVideoPosterSrc}
                  alt=""
                  className="aspect-video w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-transparent" aria-hidden />
                <button
                  type="button"
                  className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-xl transition-transform hover:scale-105"
                  aria-label={freelancerDetailCopy.playIntro}
                >
                  <Play className="ml-0.5 size-7 fill-current" strokeWidth={0} aria-hidden />
                </button>
              </div>
            ) : null}

            <div className="relative mt-6">
              <p
                className={`whitespace-pre-line text-sm leading-relaxed text-gray-600 sm:text-base ${aboutExpanded ? "" : "line-clamp-6"}`}
              >
                {freelancer.aboutExtended}
              </p>
              {freelancer.aboutExtended.length > 320 ? (
                <button
                  type="button"
                  onClick={() => setAboutExpanded((e) => !e)}
                  className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  {aboutExpanded ? freelancerDetailCopy.showLess : freelancerDetailCopy.showMore}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {tab === "work" ? (
          <div role="tabpanel" id="panel-work" aria-labelledby="tab-work" className={`${panelClass} space-y-4`}>
            {freelancer.workHistory.length === 0 ? (
              <p className="text-sm text-gray-500">{freelancerDetailCopy.emptyWorkHistory}</p>
            ) : (
              freelancer.workHistory.map((job) => (
                <article
                  key={job.id}
                  className="rounded-xl bg-white/80 p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-gray-900">{job.title}</h3>
                    <span className="shrink-0 text-xs font-medium tabular-nums text-gray-500">{job.dateRange}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{job.summary}</p>
                </article>
              ))
            )}
          </div>
        ) : null}

        {tab === "employment" ? (
          <div role="tabpanel" id="panel-employment" aria-labelledby="tab-employment" className={`${panelClass} space-y-5`}>
            {freelancer.employmentHistory.length === 0 ? (
              <p className="text-sm text-gray-500">{freelancerDetailCopy.emptyEmployment}</p>
            ) : (
              <ol className="m-0 list-none space-y-5 p-0">
                {freelancer.employmentHistory.map((e) => (
                  <li key={e.id} className="flex gap-3">
                    <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{e.dateRange}</p>
                      <h3 className="mt-1 text-base font-bold text-gray-900">{e.role}</h3>
                      <p className="text-sm font-medium text-brand-700">{e.company}</p>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{e.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        ) : null}

        {tab === "skills" ? (
          <div role="tabpanel" id="panel-skills" aria-labelledby="tab-skills" className={panelClass}>
            <ul className="flex flex-wrap gap-2">
              {freelancer.skills.map((skill) => (
                <li key={skill}>
                  <span className="inline-flex rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800">
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === "certs" ? (
          <div role="tabpanel" id="panel-certs" aria-labelledby="tab-certs" className={`${panelClass} space-y-6`}>
            {freelancer.certifications.length === 0 ? (
              <p className="text-sm text-gray-500">{freelancerDetailCopy.emptyCerts}</p>
            ) : (
              freelancer.certifications.map((c) => (
                <div key={c.id} className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <p className="mt-0.5 text-sm text-gray-600">{c.issuer}</p>
                  </div>
                  <span className="text-xs font-medium tabular-nums text-gray-500">{c.year}</span>
                </div>
              ))
            )}
          </div>
        ) : null}

        {tab === "education" ? (
          <div role="tabpanel" id="panel-education" aria-labelledby="tab-education" className={`${panelClass} space-y-6`}>
            {freelancer.education.length === 0 ? (
              <p className="text-sm text-gray-500">{freelancerDetailCopy.emptyEducation}</p>
            ) : (
              freelancer.education.map((ed) => (
                <div key={ed.id} className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{ed.degree}</h3>
                    <p className="mt-0.5 text-sm text-gray-600">{ed.school}</p>
                  </div>
                  <span className="text-xs font-medium tabular-nums text-gray-500">{ed.year}</span>
                </div>
              ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
