"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface BorderBeamProps {
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  reverse?: boolean
  borderWidth?: number
  className?: string
}

export function BorderBeam({
  className,
  size = 60,
  delay = 0,
  duration = 6,
  colorFrom = "#00ff88",
  colorTo = "#00ddff",
  reverse = false,
  borderWidth = 1.5,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className
      )}
    >
      <motion.div
        className="absolute"
        style={{
          width: size,
          height: size * 0.6,
          offsetPath: `rect(0 auto auto 0 round inherit)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          filter: `blur(1px)`,
          boxShadow: `0 0 10px 3px ${colorFrom}66, 0 0 20px 6px ${colorTo}44`,
        }}
        initial={{ offsetDistance: "0%" }}
        animate={{
          offsetDistance: reverse ? ["100%", "0%"] : ["0%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
        }}
      />
    </div>
  )
}
