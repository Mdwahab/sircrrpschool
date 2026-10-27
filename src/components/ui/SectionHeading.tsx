"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { PREMIUM_EASE, DURATION_MAIN, DISTANCE_Y, VIEWPORT_MARGIN } from "./ScrollAnimation";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
  theme?: "light" | "dark";
  className?: string;
  replay?: boolean;
}

const headingContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const headingItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: DISTANCE_Y,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_MAIN,
      ease: PREMIUM_EASE,
    },
  },
};

const dividerVariants: Variants = {
  hidden: {
    scaleX: 0,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: PREMIUM_EASE,
    },
  },
};

export function HighlightedTitle({
  title,
  highlight,
}: {
  title: string;
  highlight?: string;
  replay?: boolean;
}) {
  if (!highlight) {
    return <>{title}</>;
  }

  // Split title by the highlight term (case-insensitive)
  const parts = title.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));

  return (
    <>
      {parts.map((part, idx) => {
        const isMatch = part.toLowerCase() === highlight.toLowerCase();
        if (!isMatch) return <span key={idx}>{part}</span>;

        return (
          <span
            key={idx}
            className="bg-gradient-to-r from-[#2F4156] via-[#3E5C6B] to-[#567C8D] bg-clip-text text-transparent font-extrabold inline-block"
          >
            {part}
          </span>
        );
      })}
    </>
  );
}

export function SectionHeading({
  badge,
  title,
  highlight,
  subtitle,
  centered = true,
  className = "",
  replay = true,
}: SectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className={`mb-12 sm:mb-14 ${
          centered ? "text-center mx-auto max-w-3xl" : "max-w-2xl"
        } ${className}`}
      >
        {badge && (
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3.5 bg-[#F5EEEB] border border-[#C8D9E6] text-[#2F4156] shadow-xs">
            <span>{badge}</span>
          </div>
        )}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-3 text-[#2F4156] leading-tight">
          <HighlightedTitle title={title} highlight={highlight} replay={false} />
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base leading-relaxed text-[#567C8D] font-normal">
            {subtitle}
          </p>
        )}
        <div
          className={`h-1 w-20 rounded-full mt-4 bg-gradient-to-r from-[#567C8D] to-[#C8D9E6] ${
            centered ? "mx-auto" : "origin-left"
          }`}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: !replay,
        amount: 0.2,
        margin: VIEWPORT_MARGIN,
      }}
      variants={headingContainerVariants}
      className={`mb-12 sm:mb-14 ${
        centered ? "text-center mx-auto max-w-3xl" : "max-w-2xl"
      } ${className}`}
    >
      {badge && (
        <motion.div
          variants={headingItemVariants}
          className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3.5 bg-[#F5EEEB] border border-[#C8D9E6] text-[#2F4156] shadow-xs hover:border-[#567C8D] transition-colors"
        >
          <span className="tracking-widest">{badge}</span>
        </motion.div>
      )}

      <motion.h2
        variants={headingItemVariants}
        className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-3 text-[#2F4156] leading-tight"
      >
        <HighlightedTitle title={title} highlight={highlight} replay={replay} />
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={headingItemVariants}
          className="text-sm sm:text-base leading-relaxed text-[#567C8D] font-normal max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Clean Divider Line */}
      <motion.div
        variants={dividerVariants}
        className={`relative flex items-center justify-center mt-5 ${
          centered ? "mx-auto w-24" : "origin-left w-20"
        }`}
      >
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-[#567C8D] to-[#C8D9E6]" />
      </motion.div>
    </motion.div>
  );
}
