"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

// ─── Fade In Up Animation ────────────────────────────────────────────────
interface FadeInUpProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeInUp({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── Fade In Animation ──────────────────────────────────────────────────
interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── Scale In Animation ─────────────────────────────────────────────────
interface ScaleInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Container ──────────────────────────────────────────────────
interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  staggerDelay?: number;
  delay?: number;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  delay = 0,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Item ───────────────────────────────────────────────────────
interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function StaggerItem({ children, ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { ease: "easeOut" } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── Float Animation (for decorative elements) ─────────────────────────
interface FloatProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
}

export function Float({
  children,
  duration = 3,
  distance = 10,
  ...props
}: FloatProps) {
  return (
    <motion.div
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── Pulse Glow Animation ───────────────────────────────────────────────
interface PulseGlowProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function PulseGlow({ children, ...props }: PulseGlowProps) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 20px rgba(244, 114, 182, 0.2)",
          "0 0 40px rgba(244, 114, 182, 0.4)",
          "0 0 20px rgba(244, 114, 182, 0.2)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
