import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#D4AF37] via-[#F3CA52] to-[#D4AF37] text-[#07172F] shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-[0.98] font-bold border border-[#FDE047]/60",
    secondary:
      "bg-[#0E2548] text-white hover:bg-[#143566] border border-[#D4AF37]/30 shadow-md active:scale-[0.98]",
    outline:
      "bg-transparent text-[#D4AF37] border-2 border-[#D4AF37] hover:bg-[#D4AF37]/10 active:scale-[0.98]",
    ghost:
      "bg-transparent text-slate-200 hover:text-white hover:bg-white/10 active:scale-[0.98]",
  };

  const combinedClass = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClass} {...props}>
      {children}
    </button>
  );
}
