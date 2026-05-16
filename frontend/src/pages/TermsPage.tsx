import { ArticleLayout } from "../layouts/ArticleLayout";

export function TermsPage() {
  return (
    <ArticleLayout
      eyebrow="Legal"
      title="Terms of Service"
      description="These terms describe how we expect you to use Escrow. They are not legal advice; have counsel review if you need a formal opinion."
    >
      <p className="text-xs text-gray-500">Last updated: May 15, 2026</p>
      <h2>1. The service</h2>
      <p>
        Escrow provides a web application and marketplace experiences that may interact with the Nervos CKB network through your wallet. Features,
        availability, and fees can change as we ship updates.
      </p>
      <h2>2. Eligibility & accounts</h2>
      <p>
        You must be able to form a binding contract in your jurisdiction. You are responsible for activity under your wallet and session. Keep your
        credentials and seed phrases private—we will never ask for a seed phrase.
      </p>
      <h2>3. On-chain transactions</h2>
      <p>
        Blockchain transactions are irreversible. You acknowledge that funding, releasing, or disputing milestones may incur network fees and is
        subject to network conditions outside our control.
      </p>
      <h2>4. Acceptable use</h2>
      <p>
        Do not use Escrow for unlawful activity, fraud, harassment, or to circumvent escrow protections agreed with a counterparty. We may suspend
        access when we reasonably believe terms or safety policies are violated.
      </p>
      <h2>5. Disclaimers</h2>
      <p>
        The service is provided “as is” to the maximum extent permitted by law. We do not guarantee uninterrupted operation or error-free behavior.
      </p>
      <h2>6. Contact</h2>
      <p>For questions about these terms, reach out through the Contact page in the app.</p>
    </ArticleLayout>
  );
}
