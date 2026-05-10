import { Briefcase, ChevronRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { ActingRole } from "../../../utils/auth/session";
import { connectFlowCopy } from "../../../utils/wallet/connectFlow";
import { RoleOption } from "./RoleOption";

type RoleSelectionStepProps = {
  step1Done: boolean;
  selectedRole: ActingRole | null;
  onSelectRole: (role: ActingRole) => void;
  canContinue: boolean;
  submitState: "idle" | "working" | "error";
  errorMessage: string;
  onContinue: () => void;
};

export function RoleSelectionStep({
  step1Done,
  selectedRole,
  onSelectRole,
  canContinue,
  submitState,
  errorMessage,
  onContinue,
}: RoleSelectionStepProps) {
  return (
    <div
      className={`px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9 ${!step1Done ? "pointer-events-none opacity-[0.38]" : ""}`}
    >
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gray-500">{connectFlowCopy.step2.label}</h2>
      <p className="mt-1 text-base font-semibold text-gray-900">{connectFlowCopy.step2.title}</p>
      <p className="mt-1 text-sm text-gray-500">{connectFlowCopy.step2.hint}</p>

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5">
        <RoleOption
          selected={selectedRole === "client"}
          disabled={!step1Done}
          icon={<Briefcase className="size-6" strokeWidth={1.5} />}
          title={connectFlowCopy.roles.client.title}
          description={connectFlowCopy.roles.client.description}
          onSelect={() => onSelectRole("client")}
        />
        <RoleOption
          selected={selectedRole === "freelancer"}
          disabled={!step1Done}
          icon={<Users className="size-6" strokeWidth={1.5} />}
          title={connectFlowCopy.roles.freelancer.title}
          description={connectFlowCopy.roles.freelancer.description}
          onSelect={() => onSelectRole("freelancer")}
        />
      </div>

      <div className="mt-7 flex flex-col gap-4 border-t border-gray-100 pt-7">
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => void onContinue()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/15 transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
        >
          {submitState === "working" ? (
            connectFlowCopy.confirmInWallet
          ) : (
            <>
              {connectFlowCopy.continue}
              <ChevronRight className="size-4 opacity-80" strokeWidth={2} aria-hidden />
            </>
          )}
        </button>
        <Link to="/" className="text-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
          {connectFlowCopy.backHome}
        </Link>
        {submitState === "error" ? (
          <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
