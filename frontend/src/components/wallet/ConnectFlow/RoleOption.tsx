import { Check } from "lucide-react";
import { type ReactNode } from "react";

export type RoleOptionProps = {
  selected: boolean;
  disabled: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onSelect: () => void;
};

export function RoleOption({ selected, disabled, icon, title, description, onSelect }: RoleOptionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={[
        "group relative flex w-full flex-col rounded-2xl border-2 p-4 text-left transition-[border-color,box-shadow,background-color] sm:p-5",
        selected
          ? "border-brand-500 bg-brand-50/60 shadow-[inset_0_0_0_1px_rgba(85,179,107,0.12)]"
          : "border-transparent bg-gray-50/80 hover:border-gray-200 hover:bg-gray-50",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {selected ? (
        <span className="absolute right-2.5 top-2.5 flex size-6 items-center justify-center rounded-full bg-brand-500 text-white sm:right-3 sm:top-3">
          <Check className="size-3.5" strokeWidth={3} aria-hidden />
        </span>
      ) : null}
      <span className="flex size-11 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-gray-200/80">
        {icon}
      </span>
      <span className="mt-3 block text-sm font-bold text-gray-900 sm:text-base">{title}</span>
      <span className="mt-1 block text-xs leading-snug text-gray-600 sm:text-sm">{description}</span>
    </button>
  );
}
