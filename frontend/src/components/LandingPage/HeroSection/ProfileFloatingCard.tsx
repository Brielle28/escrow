function ProfileFloatingCard({
    name,
    role,
    imageSrc,
    className,
    blur,
  }: {
    name: string;
    role: string;
    imageSrc: string;
    className?: string;
    blur?: boolean;
  }) {
    return (
      <div
        className={`absolute w-[148px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-200/80 ${blur ? "scale-90 opacity-60 blur-[2px]" : ""} ${className ?? ""}`}
      >
        <div className="aspect-4/3 overflow-hidden bg-slate-100">
          <img src={imageSrc} alt="" className="size-full object-cover" loading="lazy" decoding="async" />
        </div>
        <div className="px-3 py-2.5">
          <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
          <p className="truncate text-xs text-gray-500">{role}</p>
        </div>
      </div>
    );
  }
export default ProfileFloatingCard;