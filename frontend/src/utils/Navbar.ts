export const navGroups = [
    {
      label: "Find Work",
      links: [
        { to: "#", label: "Browse jobs" },
        { to: "#", label: "Saved searches" },
        { to: "#", label: "Proposals" },
      ],
    },
    {
      label: "Find Talent",
      links: [
        { to: "#", label: "Post a job" },
        { to: "#", label: "Talent marketplace" },
        { to: "#", label: "Enterprise" },
      ],
    },
    {
      label: "What's New",
      links: [
        { to: "#", label: "Product updates" },
        { to: "#", label: "Roadmap" },
        { to: "#", label: "Blog" },
      ],
    },
  ];


export const summaryClass =
"flex cursor-pointer list-none items-center gap-1.5 rounded-md px-3 py-2 text-[0.9375rem] font-medium text-gray-600 transition-colors hover:bg-black/[0.03] hover:text-gray-900 [&::-webkit-details-marker]:hidden";

export const dropdownPanelClass =
"absolute left-0 top-full z-50 mt-1.5 min-w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.08)]";

export const dropdownLinkClass =
"block rounded-md px-2.5 py-2 text-sm font-medium text-gray-600 no-underline transition-colors hover:bg-brand-50 hover:text-brand-500";

export  const textLinkClass =
"rounded-md px-3 py-2 text-[0.9375rem] font-medium text-gray-600 no-underline transition-colors hover:bg-black/[0.03] hover:text-gray-900";
