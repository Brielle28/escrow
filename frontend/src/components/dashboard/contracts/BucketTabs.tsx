type BucketTab = { id: string; label: string };

type BucketTabsProps = {
  tabs: BucketTab[];
  active: string;
  onChange: (id: string) => void;
};

export function BucketTabs({ tabs, active, onChange }: BucketTabsProps) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-gray-200/80" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={
              isActive
                ? "rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                : "rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
