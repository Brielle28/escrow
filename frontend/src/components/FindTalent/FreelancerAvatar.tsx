type FreelancerAvatarSize = "sm" | "md" | "profile";

type FreelancerAvatarProps = {
  src: string;
  /** Screen reader label; use empty string when the name is already adjacent in the layout. */
  alt: string;
  size?: FreelancerAvatarSize;
  /** `profile` size implies a circular avatar (marketplace-style). */
  shape?: "rounded" | "circle";
  /** Card grid uses a light ring; profile sidebar uses a dark ring. */
  tone?: "light" | "dark";
  className?: string;
};

const sizeClass: Record<FreelancerAvatarSize, string> = {
  sm: "size-14 sm:size-[4.5rem]",
  md: "size-24 sm:size-28",
  profile: "size-28 sm:size-32",
};

export function FreelancerAvatar({
  src,
  alt,
  size = "sm",
  shape = "rounded",
  tone = "light",
  className = "",
}: FreelancerAvatarProps) {
  const isCircle = shape === "circle" || size === "profile";
  const corner = isCircle ? "rounded-full" : size === "md" ? "rounded-3xl" : "rounded-2xl";
  const ringClass = tone === "dark" ? "ring-2 ring-zinc-600 shadow-lg shadow-black/40" : "ring-2 ring-white shadow-md shadow-gray-900/10";

  return (
    <img
      src={src}
      alt={alt}
      className={`shrink-0 object-cover ${sizeClass[size]} ${corner} ${ringClass} ${className}`.trim()}
      loading="lazy"
      decoding="async"
    />
  );
}
