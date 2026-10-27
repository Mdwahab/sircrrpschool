"use client";

import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";

/**
 * Premium Cinematic Scroll Animation System
 * Sir C. R. Reddy Public School Web Platform
 *
 * Requirements Met:
 * - Coordinated bottom-to-top reveal (30–45px offset, standard y: 38px)
 * - Refined ease-out curve [0.22, 1, 0.36, 1]
 * - Standard entrance duration: 0.72s (in 0.6–0.85s range)
 * - Viewport trigger threshold: 18% (in 15–25% range)
 * - Replay on scroll re-entry: viewport { once: false }
 * - Zero Layout Shift: Transforms and opacity only
 * - Full prefers-reduced-motion accessibility compliance
 */

export const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;
export const DURATION_MAIN = 0.72;
export const DISTANCE_Y = 38;
export const STAGGER_STEP = 0.10;
export const VIEWPORT_AMOUNT = 0.18;
export const VIEWPORT_MARGIN = "-30px 0px -30px 0px";

// Standard Reveal Variants
export const scrollRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: DISTANCE_Y,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: (custom?: { delay?: number; duration?: number; y?: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom?.duration ?? DURATION_MAIN,
      delay: custom?.delay ?? 0,
      ease: PREMIUM_EASE,
    },
  }),
};

// Staggered Container Variants
export const scrollStaggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
  visible: (custom?: { stagger?: number; delayChildren?: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom?.stagger ?? STAGGER_STEP,
      delayChildren: custom?.delayChildren ?? 0.04,
    },
  }),
};

// Staggered Item Variants
export const scrollStaggerItemVariants: Variants = {
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

// Photo Showcase Variants (Gentle upward motion + subtle scale)
export const scrollImageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: DISTANCE_Y,
    scale: 0.96,
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  },
  visible: (custom?: { delay?: number }) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: custom?.delay ?? 0,
      ease: PREMIUM_EASE,
    },
  }),
};

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  viewportAmount?: number;
  replay?: boolean;
}

/**
 * Reusable single-element or content-group scroll reveal
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = DURATION_MAIN,
  distance = DISTANCE_Y,
  viewportAmount = VIEWPORT_AMOUNT,
  replay = true,
  ...rest
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: !replay,
        amount: viewportAmount,
        margin: VIEWPORT_MARGIN,
      }}
      custom={{ delay, duration, y: distance }}
      variants={scrollRevealVariants}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggerContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  viewportAmount?: number;
  replay?: boolean;
}

/**
 * Staggered container for card grids, lists, or sequential content blocks
 */
export function ScrollStaggerContainer({
  children,
  className = "",
  stagger = STAGGER_STEP,
  delayChildren = 0.04,
  viewportAmount = VIEWPORT_AMOUNT,
  replay = true,
  ...rest
}: ScrollStaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: !replay,
        amount: viewportAmount,
        margin: VIEWPORT_MARGIN,
      }}
      custom={{ stagger, delayChildren }}
      variants={scrollStaggerContainerVariants}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggerItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Individual item inside a ScrollStaggerContainer
 */
export function ScrollStaggerItem({
  children,
  className = "",
  ...rest
}: ScrollStaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={scrollStaggerItemVariants}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface ScrollImageRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  viewportAmount?: number;
  replay?: boolean;
}

/**
 * Photo & visual asset entrance with gentle upward rise and subtle scale
 */
export function ScrollImageReveal({
  children,
  className = "",
  delay = 0,
  viewportAmount = VIEWPORT_AMOUNT,
  replay = true,
  ...rest
}: ScrollImageRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: !replay,
        amount: viewportAmount,
        margin: VIEWPORT_MARGIN,
      }}
      custom={{ delay }}
      variants={scrollImageVariants}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Smooth Parallax Motion Container for photography and visual elements
 */
export function CinematicParallaxContainer({
  children,
  className = "",
  parallaxOffset = 25,
}: {
  children: React.ReactNode;
  className?: string;
  parallaxOffset?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [-parallaxOffset, parallaxOffset]);
  const y = useSpring(yRaw, { stiffness: 90, damping: 28, restDelta: 0.001 });

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Film-like Mask Expansion Reveal for photographs
 */
export function CinematicMaskReveal({
  children,
  className = "",
  delay = 0,
  replay = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  replay?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(8% 0% 8% 0% round 24px)", scale: 0.98 }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 24px)", scale: 1 }}
      viewport={{ once: !replay, amount: VIEWPORT_AMOUNT, margin: VIEWPORT_MARGIN }}
      transition={{ duration: 0.85, delay, ease: PREMIUM_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Pulsing Cinematic Scroll Prompt Indicator
 */
export function CinematicScrollIndicator({
  targetId = "about",
  className = "",
}: {
  targetId?: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={`#${targetId}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7, ease: PREMIUM_EASE }}
      className={`inline-flex flex-col items-center gap-2 group cursor-pointer text-[#2F4156]/70 hover:text-[#2F4156] transition-colors ${className}`}
      aria-label="Scroll to explore institutional legacy"
    >
      <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-[#567C8D]">
        Explore Campus
      </span>
      <div className="w-5 h-8 rounded-full border-2 border-[#567C8D]/60 flex items-start justify-center p-1 group-hover:border-[#2F4156] transition-colors">
        {shouldReduceMotion ? (
          <div className="w-1.5 h-1.5 rounded-full bg-[#567C8D]" />
        ) : (
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#567C8D] group-hover:bg-[#2F4156] transition-colors"
          />
        )}
      </div>
    </motion.a>
  );
}

/**
 * Seamless ambient section transition gradient
 */
export function CinematicSectionDivider({
  fromColor = "#FFFFFF",
  toColor = "#F5EEEB",
  className = "",
}: {
  fromColor?: string;
  toColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full h-10 pointer-events-none relative z-10 ${className}`}
      style={{
        background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
      }}
      aria-hidden="true"
    />
  );
}
