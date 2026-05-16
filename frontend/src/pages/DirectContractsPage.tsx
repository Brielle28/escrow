import { Link } from "react-router-dom";
import { ArticleLayout } from "../layouts/ArticleLayout";

export function DirectContractsPage() {
  return (
    <ArticleLayout
      eyebrow="For freelancers"
      title="Direct contracts & milestones"
      description="How fixed-price work fits with CKB escrow on Escrow—milestones, approvals, and what “direct” means here."
    >
      <p>
        On Escrow, a direct contract is still a structured agreement: you and the client agree on scope, you deliver in milestones, and CKB stays in
        escrow until each milestone is approved.
      </p>
      <h2>Why milestones matter</h2>
      <p>
        Milestones protect both sides. You get predictable payouts when work is accepted; the client gets inspectable slices of delivery instead of
        one large upfront payment with unclear checkpoints.
      </p>
      <h2>Typical flow</h2>
      <ul>
        <li>Client funds the next milestone in CKB.</li>
        <li>You ship the deliverable and mark it ready for review.</li>
        <li>Client approves; escrow releases to your wallet.</li>
        <li>Repeat for the next milestone until the engagement is complete.</li>
      </ul>
      <h2>Finding the next contract</h2>
      <p>
        Browse open roles on the <Link to="/jobs">jobs board</Link>, keep your talent profile current, and reply quickly when clients reach out.
      </p>
      <h2>Resources</h2>
      <p>
        See <Link to="/freelancer-resources">Freelancer resources</Link> for more links, or <Link to="/contact">contact us</Link> if something in the
        app does not match what you agreed with the client.
      </p>
    </ArticleLayout>
  );
}
