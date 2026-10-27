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
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-[#2F4156] border border-[#C8D9E6] shadow-2xs ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#567C8D]" />
        <span>{label || "Official CBSE Record Verified"}</span>
      </span>
    );
  }

  return (
    <span
      title={notes || "Pending formal school management confirmation"}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5EEEB] text-[#2F4156] border border-[#C8D9E6] shadow-2xs ${className}`}
    >
      <Info className="w-3.5 h-3.5 text-[#567C8D]" />
      <span>{label || "Requires Management Verification"}</span>
    </span>
  );
}
