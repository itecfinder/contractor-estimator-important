"use client"

import { ChevronLeft } from "lucide-react"
import type { ReactNode } from "react"
import { useApp } from "@/lib/store"
import type { ScreenKey } from "@/lib/types"

export function ScreenHeader({
  title,
  step,
  back,
}: {
  title: string
  step?: { current: number; total: number }
  back?: ScreenKey
}) {
  const { t, go } = useApp()
  return (
    <div className="px-4 pt-4">
      {back && (
        <button
          onClick={() => go(back)}
          className="-ml-1 mb-2 flex items-center gap-1 text-sm font-medium text-muted-foreground"
        >
          <ChevronLeft className="size-4" />
          {t("back")}
        </button>
      )}
      <div className="flex items-end justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance font-[family-name:var(--font-heading)]">
          {title}
        </h1>
        {step && (
          <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            {t("step")} {step.current} {t("of")} {step.total}
          </span>
        )}
      </div>
    </div>
  )
}

export function StickyBar({ children }: { children: ReactNode }) {
  return (
    <div className="absolute bottom-16 left-0 right-0 z-10 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
      {children}
    </div>
  )
}

