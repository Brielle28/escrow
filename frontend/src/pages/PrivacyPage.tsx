import { ArticleLayout } from "../layouts/ArticleLayout";

export function PrivacyPage() {
  return (
    <ArticleLayout
      eyebrow="Legal"
      title="Privacy Policy"
      description="How Escrow handles information when you use our website and app. This is a high-level policy for the product as shipped today."
    >
      <p className="text-xs text-gray-500">Last updated: May 15, 2026</p>
      <h2>1. What we collect</h2>
      <p>
        We may collect information you provide (such as name, email, and messages when you contact us), technical data (such as device, browser, and
        coarse usage analytics), and on-chain data that is already public on CKB when you connect a wallet or transact.
      </p>
      <h2>2. How we use data</h2>
      <p>
        We use this information to operate and improve Escrow, respond to support requests, secure the service, and comply with law. We do not sell your
        personal information.
      </p>
      <h2>3. Wallets & on-chain activity</h2>
      <p>
        Connecting a wallet does not give us your private keys. Transaction details you submit to the network are public by design and outside our
        control once broadcast.
      </p>
      <h2>4. Retention</h2>
      <p>
        We retain information as long as needed to provide the service, meet legal obligations, and resolve disputes. Exact periods can depend on the
        type of record.
      </p>
      <h2>5. Your choices</h2>
      <p>
        Where applicable, you may request access or correction of personal data by contacting us. Some requests may be limited by law or legitimate
        security needs.
      </p>
      <h2>6. Contact</h2>
      <p>Privacy questions can be sent through the Contact page in the app.</p>
    </ArticleLayout>
  );
}
