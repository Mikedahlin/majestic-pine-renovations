import type { CSSProperties } from "react";

type UsFlagIconProps = {
  className?: string;
  style?: CSSProperties;
};

export function UsFlagIcon({ className = "", style }: UsFlagIconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="60" height="40" fill="#B22234" />
      <rect y="4" width="60" height="4" fill="white" />
      <rect y="12" width="60" height="4" fill="white" />
      <rect y="20" width="60" height="4" fill="white" />
      <rect y="28" width="60" height="4" fill="white" />
      <rect y="36" width="60" height="4" fill="white" />
      <rect width="24" height="20" fill="#3C3B6E" />
      {[0, 1, 2, 3, 4].map((r) =>
        Array.from({ length: 6 }).map((_, c) => (
          <circle key={`a-${r}-${c}`} cx={2.4 + c * 4} cy={2 + r * 4} r="0.7" fill="white" />
        )),
      )}
      {[0, 1, 2, 3].map((r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <circle key={`b-${r}-${c}`} cx={4.4 + c * 4} cy={4 + r * 4} r="0.7" fill="white" />
        )),
      )}
    </svg>
  );
}
