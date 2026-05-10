/** Escrow lifecycle steps — same narrative end-to-end on Nervos CKB. */
export const howItWorksSteps: readonly {
  step: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
}[] = [
  {
    step: 1,
    title: "Post & recruit",
    description:
      "Clients publish scope and budget; freelancers apply. You match when you are ready.",
  },
  {
    step: 2,
    title: "Confirm terms",
    description:
      "Both sides agree on a frozen snapshot of deliverables, deadlines, and payout rules.",
  },
  {
    step: 3,
    title: "Fund escrow",
    description:
      "The client locks funds on-chain. Money stays locked until release, dispute resolution, or timeout.",
  },
  {
    step: 4,
    title: "Work & collaborate",
    description:
      "Workspace brings timeline, chat, and milestones together so progress stays visible.",
  },
  {
    step: 5,
    title: "Release or resolve",
    description:
      "Approve delivery to release funds, open a structured dispute if needed, or follow timeout rules.",
  },
];
