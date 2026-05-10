function WireframeGlobe({ className }: { className?: string }) {
    return (
      <svg
        className={className}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="158" stroke="url(#globeGrad)" strokeWidth="1.5" opacity="0.9" />
        <ellipse cx="200" cy="200" rx="158" ry="52" stroke="#94a3b8" strokeWidth="1" opacity="0.45" />
        <ellipse cx="200" cy="200" rx="158" ry="104" stroke="#94a3b8" strokeWidth="1" opacity="0.38" />
        <ellipse cx="200" cy="200" rx="52" ry="158" stroke="#94a3b8" strokeWidth="1" opacity="0.42" />
        <ellipse cx="200" cy="200" rx="104" ry="158" stroke="#94a3b8" strokeWidth="1" opacity="0.35" />
        <ellipse cx="200" cy="200" rx="130" ry="158" stroke="#94a3b8" strokeWidth="0.8" opacity="0.28" transform="rotate(52 200 200)" />
        <ellipse cx="200" cy="200" rx="130" ry="158" stroke="#94a3b8" strokeWidth="0.8" opacity="0.28" transform="rotate(-52 200 200)" />
        <ellipse cx="200" cy="200" rx="120" ry="40" stroke="#64748b" strokeWidth="0.6" opacity="0.2" />
        <ellipse cx="200" cy="180" rx="140" ry="36" stroke="#64748b" strokeWidth="0.5" opacity="0.18" />
        <ellipse cx="200" cy="220" rx="140" ry="36" stroke="#64748b" strokeWidth="0.5" opacity="0.18" />
      </svg>
    );
  }

export default WireframeGlobe;