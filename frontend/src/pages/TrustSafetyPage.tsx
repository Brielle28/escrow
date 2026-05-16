import { Link } from "react-router-dom";
import { ArticleLayout } from "../layouts/ArticleLayout";

export function TrustSafetyPage() {
  return (
    <ArticleLayout
      eyebrow="Resources"
      title="Trust & safety"
      description="How we think about safety on Escrow—wallets, milestones, and staying in control of your CKB."
    >
      <h2>On-chain escrow</h2>
      <p>
        Funds for a milestone are intended to remain in escrow until release conditions you see in the app are met. Always read milestone terms before
        you fund or accept work.
      </p>
      <h2>Protect your wallet</h2>
      <ul>
        <li>Use a hardware wallet or reputable browser wallet for larger balances.</li>
        <li>Never paste a seed phrase into Escrow or any chat.</li>
        <li>Verify URLs and browser extensions before signing transactions.</li>
      </ul>
      <h2>Marketplace behavior</h2>
      <p>
        Keep communication on-platform when possible, document scope changes, and escalate early if a counterparty pressures you to skip escrow or
        send “fees” off-chain.
      </p>
      <h2>Report concerns</h2>
      <p>
        If you see abuse, scams, or policy violations, reach out via <Link to="/contact">Contact</Link> with screenshots and transaction IDs where
        safe to share.
      </p>
    </ArticleLayout>
  );
}
