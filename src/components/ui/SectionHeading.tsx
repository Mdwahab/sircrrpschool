import React from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-12 ${centered ? "text-center mx-auto max-w-3xl" : "max-w-2xl"} ${className}`}
    >
      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0E2548] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-3.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
          {badge}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={`h-1 w-20 bg-gradient-to-r from-[#D4AF37] to-[#F3CA52] rounded-full mt-4 ${
          centered ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
