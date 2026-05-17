import { Link } from "react-router-dom";
import type { JobListItem } from "../../../types/dashboard";
import { truncateAddress } from "../../../utils/truncateAddress";
import { StatusBadge } from "../ui/StatusBadge";

type ContractTableProps = {
  jobs: JobListItem[];
  workspaceBasePath: string;
  emptyMessage?: string;
  embedded?: boolean;
};

export function ContractTable({ jobs, workspaceBasePath, emptyMessage, embedded }: ContractTableProps) {
  if (jobs.length === 0) {
    const empty = (
      <div className={`px-6 py-14 text-center ${embedded ? "" : "dashboard-card"}`}>
        <p className="text-sm text-gray-500">{emptyMessage ?? "No contracts in this view yet."}</p>
      </div>
    );
    return embedded ? empty : empty;
  }

  const table = (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            <th className="px-6 py-3 font-semibold">Contract</th>
            <th className="px-6 py-3 font-semibold">Status</th>
            <th className="px-6 py-3 font-semibold">Budget</th>
            <th className="px-6 py-3 font-semibold">Counterparty</th>
            <th className="px-6 py-3 font-semibold">Next step</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const counterparty = job.freelancerAddress ?? job.clientAddress;
            return (
              <tr key={job.id} className="border-t border-gray-100 transition-colors hover:bg-gray-50/80">
                <td className="px-6 py-4 font-semibold text-gray-900">{job.title}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">{job.budgetCkb} CKB</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{truncateAddress(counterparty, 8, 6)}</td>
                <td className="px-6 py-4 text-gray-600">{job.nextActionHint}</td>
                <td className="px-6 py-4 text-right">
                  <Link to={`${workspaceBasePath}/${job.id}`} className="dashboard-btn-primary !px-3 !py-1.5 !text-xs">
                    Open
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (embedded) return table;
  return <div className="dashboard-card overflow-hidden">{table}</div>;
}
