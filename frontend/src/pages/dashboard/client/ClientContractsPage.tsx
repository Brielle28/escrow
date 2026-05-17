import { ContractsListPage } from "../shared/ContractsListPage";

export function ClientContractsPage() {
  return (
    <ContractsListPage
      role="client"
      title="Contracts"
      publishHref="/dashboard/client/contracts/new"
    />
  );
}
