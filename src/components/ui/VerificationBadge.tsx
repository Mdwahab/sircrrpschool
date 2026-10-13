import React from "react";
import { ShieldCheck, Info } from "lucide-react";

interface VerificationBadgeProps {
  verified: boolean;
  label?: string;
  notes?: string;
  className?: string;
}

export function VerificationBadge({
  verified,
  label,
  notes,
  className = "",
}: VerificationBadgeProps) {
  if (verified) {
    return (
      <span
        title={notes || "Verified by official CBSE directory record"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>{label || "Official CBSE Record Verified"}</span>
      </span>
    );
  }

  return (
    <span
      title={notes || "Pending formal school management confirmation"}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-600/40 ${className}`}
    >
      <Info className="w-3.5 h-3.5 text-amber-400" />
      <span>{label || "Requires Management Verification"}</span>
    </span>
  );
}
