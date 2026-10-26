import type { Answer } from "@/lib/items";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function AnswerIcon({ k }: { k: Answer }) {
  if (k === "api")
    return (
      <svg viewBox="0 0 48 48" {...base} aria-hidden="true">
        <path d="M14 34a8 8 0 0 1-1-15.9A11 11 0 0 1 34 16a8 8 0 0 1 1 16" />
        <path d="M24 42V24" />
        <path d="M18 30l6-6 6 6" />
      </svg>
    );
  if (k === "no")
    return (
      <svg viewBox="0 0 48 48" {...base} aria-hidden="true">
        <rect x="13" y="5" width="22" height="38" rx="4" />
        <path d="M21 37h6" />
        <path d="M19 17l4 4-4 4" />
        <path d="M25 25h5" />
      </svg>
    );
  return (
    <svg viewBox="0 0 48 48" {...base} aria-hidden="true">
      <path d="M24 43V27" />
      <path d="M24 27L12 13" />
      <path d="M24 27l12-14" />
      <path d="M7 14l5-1 1 5" />
      <path d="M41 14l-5-1-1 5" />
    </svg>
  );
}

export function DeviceIcon() {
  return (
    <svg viewBox="0 0 48 48" {...base} aria-hidden="true">
      <rect x="13" y="5" width="22" height="38" rx="4" />
      <path d="M21 37h6" />
    </svg>
  );
}

export function ServerIcon() {
  return (
    <svg viewBox="0 0 48 48" {...base} aria-hidden="true">
      <rect x="8" y="8" width="32" height="13" rx="3" />
      <rect x="8" y="27" width="32" height="13" rx="3" />
      <path d="M14 14.5h.01M14 33.5h.01" />
      <path d="M22 14.5h12M22 33.5h12" />
    </svg>
  );
}

export function VerdictIcon({ k }: { k: "ok" | "bad" | "half" }) {
  const p = { ...base, strokeWidth: 2.6 };
  if (k === "ok")
    return (
      <svg viewBox="0 0 24 24" {...p} aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M7.5 12.5l3 3 6-6.5" />
      </svg>
    );
  if (k === "bad")
    return (
      <svg viewBox="0 0 24 24" {...p} aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" {...p} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
    </svg>
  );
}
