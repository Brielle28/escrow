export const connectFlowCopy = {
  eyebrow: "Wallet session",
  title: "Sign in with your wallet",
  subtitle: "Connect once, choose your role, then confirm with a signature.",
  step1: {
    label: "Step 1",
    title: "Wallet connection",
    hint: "JoyID, MetaMask, OKX, and other CKB wallets.",
  },
  connectButton: "Connect wallet",
  changeButton: "Change",
  step2: {
    label: "Step 2",
    title: "How will you use Escrow?",
    hint: "Choose one—you can switch later from your dashboard.",
  },
  roles: {
    client: {
      title: "Client",
      description: "Post work, fund escrow, approve delivery, release funds.",
    },
    freelancer: {
      title: "Freelancer",
      description: "Discover jobs, apply, deliver work, get paid from escrow.",
    },
  },
  continue: "Continue",
  confirmInWallet: "Confirm in wallet…",
  backHome: "← Back to home",
} as const;
