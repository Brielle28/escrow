import { Link } from "react-router-dom";
import { ArticleLayout } from "../layouts/ArticleLayout";

export function BlogPage() {
  return (
    <ArticleLayout
      eyebrow="Resources"
      title="Blog"
      description="Product notes and guides from the Escrow team. New posts will land here as we ship."
    >
      <div className="mt-10! space-y-8">
        <article className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 ring-1 ring-black/5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Guide</p>
          <h2 className="mt-0! text-xl font-bold text-gray-900">Milestone escrow in plain language</h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Why we split client and freelancer flows around approvals, and how CKB stays locked until everyone agrees the milestone is done. Pair this
            with <Link to="/how-to-hire">How to hire</Link> or <Link to="/direct-contracts">Direct contracts</Link>.
          </p>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 ring-1 ring-black/5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Product</p>
          <h2 className="mt-0! text-xl font-bold text-gray-900">What is new on the marketplace</h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Talent profiles, job discovery, and wallet connect improvements ship continuously. Follow releases in-app and check the{" "}
            <Link to="/help">Help Center</Link> when behavior changes.
          </p>
        </article>
      </div>
    </ArticleLayout>
  );
}
