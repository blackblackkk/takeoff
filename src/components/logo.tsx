export const PLANE_PATH =
  "M-10 -1.4 4.5 -1.4C7.5 -1.4 10.5 -0.8 10.5 0S7.5 1.4 4.5 1.4L-10 1.4ZM-1 -1.4-5.5 -9H-3L4 -1.4ZM-1 1.4-5.5 9H-3L4 1.4ZM-8 -1.4-10.5 -5.5H-8.6L-5.5 -1.4ZM-8 1.4-10.5 5.5H-8.6L-5.5 1.4Z";

export function PlaneGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-12 -10 24 20" aria-hidden="true">
      <path fill="currentColor" d={PLANE_PATH} />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      take
      <PlaneGlyph className="logo-plane" />
      off
    </span>
  );
}
