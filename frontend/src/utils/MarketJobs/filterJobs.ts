import type { JobCategory, MarketJob } from "./types";

export function filterMarketJobs(
  jobs: readonly MarketJob[],
  query: string,
  category: JobCategory | "all",
): MarketJob[] {
  const q = query.trim().toLowerCase();
  return jobs.filter((job) => {
    if (category !== "all" && job.category !== category) return false;
    if (!q) return true;
    const blob = [job.title, job.summary, job.clientLabel, job.description, ...job.skills].join(" ").toLowerCase();
    return blob.includes(q);
  });
}
