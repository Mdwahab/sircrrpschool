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
    "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center select-none";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#2F4156] hover:bg-[#1E2B3A] text-white shadow-md shadow-[#2F4156]/20 hover:shadow-lg active:scale-[0.98] border border-[#2F4156] animate-shimmer",
    secondary:
      "bg-[#567C8D] hover:bg-[#456573] text-white shadow-xs active:scale-[0.98] border border-[#567C8D]",
    outline:
      "bg-white text-[#2F4156] border-2 border-[#2F4156] hover:bg-[#F5EEEB] hover:text-[#2F4156] active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#2F4156] hover:text-[#567C8D] hover:bg-[#F5EEEB]/60 active:scale-[0.98]",
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
