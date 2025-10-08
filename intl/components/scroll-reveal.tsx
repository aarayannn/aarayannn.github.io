"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ScrollRevealProps = {
  as?: keyof HTMLElementTagNameMap
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
  direction?: "up" | "down" | "left" | "right"
}

const directionMap: Record<NonNullable<ScrollRevealProps["direction"]>, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  once = true,
  direction = "up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out opacity-0 will-change-transform",
        directionMap[direction],
        visible && "opacity-100 translate-x-0 translate-y-0",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
