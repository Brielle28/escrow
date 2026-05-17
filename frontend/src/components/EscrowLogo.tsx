type EscrowLogoProps = {
  /** Tailwind classes for the pin mark (size / spacing). */
  markClassName?: string;
  /** When true, render only the pin — no “Escrow” wordmark. */
  markOnly?: boolean;
  /** Extra classes on the wordmark wrapper (full logo only). */
  className?: string;
};

function LogoMark({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M16 3C11.03 3 7 7.03 7 12c0 5.25 6.5 14.5 8.36 17.05a1 1 0 0 0 1.28 0C18.5 26.5 25 17.25 25 12 25 7.03 20.97 3 16 3z"
        fill="#55B36B"
      />
      <circle cx="16" cy="12" r="5.5" fill="#fff" opacity="0.95" />
      <ellipse cx="16" cy="11.5" rx="4.5" ry="4.5" stroke="#55B36B" strokeWidth="1.2" fill="none" />
      <path
        d="M13 11.5c.8-.9 2.2-.9 3 0 .45.5.35 1.2-.2 1.55l-1.3.85c-.35.25-.85.25-1.2 0l-1.3-.85c-.55-.35-.65-1.05-.2-1.55z"
        fill="#55B36B"
        opacity="0.85"
      />
    </svg>
  );
}

export function EscrowLogo({
  markClassName = "size-7 -mx-1",
  markOnly = false,
  className = "",
}: EscrowLogoProps) {
  if (markOnly) {
    return (
      <span className={`inline-flex shrink-0 items-center justify-center ${className}`} aria-label="Escrow">
        <LogoMark className={`block ${markClassName}`} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-0 whitespace-nowrap text-[1.375rem] font-bold leading-none tracking-tight text-gray-900 ${className}`}
      aria-label="Escrow"
    >
      <span>Escr</span>
      <span className={`inline-flex shrink-0 items-center justify-center align-middle ${markClassName}`}>
        <LogoMark className="block size-full" />
      </span>
      <span>ow</span>
    </span>
  );
}
