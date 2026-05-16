import { Link } from "react-router-dom";
import { ArticleLayout } from "../layouts/ArticleLayout";

export function HowToHirePage() {
  return (
    <ArticleLayout
      eyebrow="For clients"
      title="How to hire on Escrow"
      description="Post work, choose talent, fund milestones in CKB, and release payment when deliverables are approved—all with on-chain escrow."
    >
      <p>
        Escrow is built for clients who want clear milestones, transparent funding, and a direct line to verified freelancers. Here is a simple flow
        that matches how the product works today.
      </p>
      <h2>1. Browse or search talent</h2>
      <p>
        Start in the <Link to="/talent">Talent Marketplace</Link> to review profiles, skills, and availability. When you find a strong match, open their
        profile and use invite flows from the app when you are ready to engage.
      </p>
      <h2>2. Align on scope and milestones</h2>
      <p>
        Break the engagement into milestones you can inspect—designs, builds, reviews, or launch checklists. Each milestone should have a clear
        acceptance criteria so both sides know when funds can move.
      </p>
      <h2>3. Fund escrow in CKB</h2>
      <p>
        Connect your wallet and fund the contract for the milestone you are activating. Funds stay locked until you approve the work or a dispute path
        is resolved according to the rules shown in the app.
      </p>
      <h2>4. Review and release</h2>
      <p>
        When a milestone is delivered, review it in the dashboard. If it meets the bar, release payment; if something is off, message the freelancer
        and use in-app support channels described in our <Link to="/help">Help Center</Link>.
      </p>
      <h2>Need a hand?</h2>
      <p>
        Questions before you commit? <Link to="/contact">Contact the team</Link> and we will route you to the right person.
      </p>
    </ArticleLayout>
  );
}
