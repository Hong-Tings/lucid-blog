"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView, type Variants } from "motion/react"

interface BlurFadeProps {
  children: ReactNode
  className?: string
  variant?: {
    hidden: { y: number; opacity: number; filter: string }
    visible: { y: number; opacity: number; filter: string }
  }
  duration?: number
  delay?: number
  offset?: number
  direction?: "up" | "down" | "left" | "right"
  blur?: string
  once?: boolean
  margin?: string
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = "down",
  blur = "6px",
  once = true,
  margin = "-50px",
}: BlurFadeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin })

  const defaultVariants: Variants = {
    hidden: {
      [direction === "left" || direction === "right" ? "x" : "y"]:
        direction === "right" || direction === "down" ? -offset : offset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [direction === "left" || direction === "right" ? "x" : "y"]: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
  }

  const combinedVariants = variant ?? defaultVariants

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={combinedVariants}
      transition={{
        delay: 0.04 + delay,
        duration,
        ease: "easeOut",
        filter: { duration },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
