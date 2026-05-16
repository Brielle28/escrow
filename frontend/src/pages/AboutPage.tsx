import { Link } from "react-router-dom";
import { ArticleLayout } from "../layouts/ArticleLayout";

export function AboutPage() {
  return (
    <ArticleLayout
      eyebrow="Company"
      title="About Escrow"
      description="We are building a secure marketplace where premium freelance talent and ambitious businesses meet—with CKB escrow at the core."
    >
      <p>
        Escrow exists to make high-trust freelance engagements routine. Clients get inspectable milestones and on-chain funding discipline; freelancers
        get predictable releases when work is accepted.
      </p>
      <h2>What we care about</h2>
      <ul>
        <li>Transparent scope and clear acceptance criteria.</li>
        <li>Wallet-native payments that match how CKB moves on-chain.</li>
        <li>A marketplace experience that feels fast, modern, and fair.</li>
      </ul>
      <h2>Talk to us</h2>
      <p>
        Questions, partnerships, or press? Visit <Link to="/contact">Contact</Link>. For product questions, the <Link to="/help">Help Center</Link> is
        the fastest place to start.
      </p>
    </ArticleLayout>
  );
}
