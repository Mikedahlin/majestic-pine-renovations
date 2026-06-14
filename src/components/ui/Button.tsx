import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const variants = {
  primary:
    "bg-charcoal text-warm-white hover:bg-bronze hover:text-charcoal border border-charcoal",
  secondary:
    "bg-transparent text-warm-white border border-warm-white hover:bg-warm-white hover:text-charcoal",
  outline:
    "bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-warm-white",
};

export function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  className = "",
  onClick,
  disabled,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center px-8 py-4 text-sm font-semibold uppercase tracking-widest transition-colors duration-300 ${variants[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
