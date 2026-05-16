import { Link } from "react-router-dom";
import { ArticleLayout } from "../layouts/ArticleLayout";

export function HelpCenterPage() {
  return (
    <ArticleLayout
      eyebrow="Resources"
      title="Help Center"
      description="Answers to common questions about Escrow, CKB funding, and using the marketplace."
    >
      <h2>Getting started</h2>
      <p>
        <strong>Do I need a wallet?</strong> Yes. Escrow uses CKB on-chain; connect a supported wallet from{" "}
        <Link to="/connects">Connect wallet</Link> before funding or accepting milestones.
      </p>
      <p>
        <strong>Where do I find work or talent?</strong> Clients browse <Link to="/talent">talent</Link>; freelancers browse{" "}
        <Link to="/jobs">jobs</Link>.
      </p>
      <h2>Payments & milestones</h2>
      <p>
        <strong>When is CKB released?</strong> After the client approves a milestone (or per the dispute rules shown in your dashboard). Freelancers
        should never mark work complete until deliverables are actually ready for review.
      </p>
      <p>
        <strong>What if the client goes quiet?</strong> Use in-app messaging first. If you are blocked for a long period, contact{" "}
        <Link to="/contact">support</Link> with the engagement details.
      </p>
      <h2>Account & security</h2>
      <p>
        <strong>Never share your seed phrase.</strong> Escrow staff will never ask for it. See <Link to="/trust-and-safety">Trust & safety</Link> for
        more tips.
      </p>
      <p>
        <strong>Still need help?</strong> <Link to="/contact">Send us a message</Link> and we will reply by email.
      </p>
    </ArticleLayout>
  );
}
