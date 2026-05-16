import { Link } from "react-router-dom";
import { ArticleLayout } from "../layouts/ArticleLayout";

export function FreelancerResourcesPage() {
  return (
    <ArticleLayout
      eyebrow="For freelancers"
      title="Freelancer resources"
      description="Quick links and guidance for getting work done on Escrow—jobs, profiles, escrow basics, and help."
    >
      <h2>Get started</h2>
      <ul>
        <li>
          <Link to="/jobs">Browse open jobs</Link> and save searches you care about.
        </li>
        <li>
          Polish your public profile in <Link to="/talent">Find talent</Link> so clients see clear skills and availability.
        </li>
        <li>
          <Link to="/connects">Connect your wallet</Link> before you accept funded work so payouts are seamless.
        </li>
      </ul>
      <h2>Understand escrow</h2>
      <p>
        Read <Link to="/direct-contracts">Direct contracts & milestones</Link> for how approvals and CKB releases work, and{" "}
        <Link to="/trust-and-safety">Trust & safety</Link> for how we think about risk on the marketplace.
      </p>
      <h2>When you are stuck</h2>
      <p>
        Start with the <Link to="/help">Help Center</Link>. If you need a human, use <Link to="/contact">Contact</Link> and include your wallet
        address (never share a seed phrase) and a short summary of the issue.
      </p>
    </ArticleLayout>
  );
}
