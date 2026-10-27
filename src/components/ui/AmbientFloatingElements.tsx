"use client";

import React from "react";

/**
 * Clean ambient background lighting layer without floating icons or symbols.
 */
export function AmbientFloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#C8D9E6]/25 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-[#F5EEEB]/50 blur-3xl" />
    </div>
  );
}
