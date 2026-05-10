export type ExploreTalentIconKey =
  | "code"
  | "palette"
  | "megaphone"
  | "writing"
  | "music"
  | "video"
  | "architecture"
  | "finance";

export const exploreTalentCategories: readonly {
  iconKey: ExploreTalentIconKey;
  title: string;
  freelancersLabel: string;
  highlighted?: boolean;
}[] = [
  {
    iconKey: "code",
    title: "Development & IT",
    freelancersLabel: "12k+ Freelancers",
    highlighted: true,
  },
  {
    iconKey: "palette",
    title: "Design & Creative",
    freelancersLabel: "8k+ Freelancers",
  },
  {
    iconKey: "megaphone",
    title: "Digital Marketing",
    freelancersLabel: "4k+ Freelancers",
  },
  {
    iconKey: "writing",
    title: "Writing & Translation",
    freelancersLabel: "6k+ Freelancers",
  },
  {
    iconKey: "music",
    title: "Music & Audio",
    freelancersLabel: "3k+ Freelancers",
  },
  {
    iconKey: "video",
    title: "Video & Animation",
    freelancersLabel: "1.2k+ Freelancers",
  },
  {
    iconKey: "architecture",
    title: "Architecture",
    freelancersLabel: "900+ Freelancers",
  },
  {
    iconKey: "finance",
    title: "Finance & Accounting",
    freelancersLabel: "1.5k+ Freelancers",
  },
];
