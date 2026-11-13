/** Material-style airliner pointing up, 24×24. */
export const PLANE_UP =
  "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";

/** Round brand badge: blue circle, small plane over a swoosh, the wordmark and a strip of sea. */
export function LogoBadge({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" role="img" aria-label="take off">
      <defs>
        <clipPath id="badge-clip">
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>
      <g clipPath="url(#badge-clip)">
        <rect width="120" height="120" fill="#1479d4" />
        <path d="M0 88c22-8 42-8 60-2s40 7 60-1v35H0Z" fill="#2fb4d8" />
        <path d="M0 97c22-6 42-5 60 0s40 5 60-1v24H0Z" fill="#7fd8e6" />
        <path
          d="M24 46c18 2 36-3 54-14"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path fill="#fff" d={PLANE_UP} transform="translate(73 14) rotate(62 12 12) scale(0.95)" />
        <text
          x="60"
          y="72"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Manrope, system-ui, sans-serif"
          fontWeight="800"
          fontSize="25"
          letterSpacing="-0.6"
        >
          take off
        </text>
      </g>
    </svg>
  );
}

/** Small plane glyph pointing right (used for decorative flight paths). */
export function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d={PLANE_UP} transform="rotate(90 12 12)" />
    </svg>
  );
}
