 "use client"

import {
  CarFront,
  CookingPot,
  Frame,
  Grid3x3,
  House,
  Layers,
  PaintRoller,
  PanelsTopLeft,
  Plus,
  Triangle,
  type LucideIcon,
} from "lucide-react"
import { projectTypeLabels } from "@/lib/i18n"
import { computeTotals, useApp } from "@/lib/store"
import type { ProjectTypeKey } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"
import { useState } from "react"
import { Input } from "@/components/ui/input"
const typeIcons: Record<ProjectTypeKey, LucideIcon> = {
  kitchenBath: CookingPot,
  homeRemodel: House,
  flooring: Grid3x3,
  drywall: Frame,
  siding: PanelsTopLeft,
  painting: PaintRoller,
  insulation: Layers,
  driveway: CarFront,
  roofing: Triangle,
}
const order: ProjectTypeKey[] = [
  "kitchenBath",
  "homeRemodel",
  "flooring",
  "drywall",
  "siding",
  "painting",
  "insulation",
  "driveway",
  "roofing",
]
export function Dashboard() {
  const { t, lang, startProject, projects, openProject, money } = useApp()

  const [identifier, setIdentifier] = useState("")
  const createProject = async (
  projectType?: ProjectTypeKey
) => {
  if (!identifier.trim()) {
    alert("Please enter your email address or phone number")
    return
  }

  try {
    const response = await fetch("/api/profile/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
      }),
    })

    const result = await response.json()

    if (!result.found) {
      localStorage.setItem(
        "pending_identifier",
        identifier
      )

      window.location.href = "/business-profile"
      return
    }

    const profile = result.profile

    if ((profile.estimatesUsed ?? 0) === 0) {
      startProject(projectType ?? null)
      return
    }

    const verifyResponse = await fetch(
      "/api/verify-membership",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
        }),
      }
    )

    const membership =
      await verifyResponse.json()

    if (membership.access === "paid") {
      startProject(projectType ?? null)
      return
    }

    alert("Create a Business Account")
  } catch (error) {
    console.error(error)
    alert("Unable to verify account")
  }
}
  return (
    <div className="space-y-6 px-4 pt-5">
      {/* Hero */}
      <div className="rounded-2xl bg-secondary p-5 text-secondary-foreground">
        <p className="text-sm font-medium text-primary">{t("appName")}</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-balance font-[family-name:var(--font-heading)]">
          {t("tagline")}
        </h1>
<Input
  placeholder="Email or Phone Number"
  value={identifier}
  onChange={(e) => setIdentifier(e.target.value)}
  className="mt-4 border-white/30 bg-transparent text-white placeholder:text-white/60"
/>
<Button
  onClick={() => createProject()}
  className="mt-4 h-12 w-full text-base font-semibold"
>
  <Plus className="size-5" />
  {t("newProject")}
</Button>
</div>
      {/* Quick start */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("quickStart")}
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          {order.map((key) => {
            const Icon = typeIcons[key]
            return (
              
          <button
  key={key}
  onClick={() => createProject(key)}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-2 text-center transition-colors active:bg-accent"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="text-[11px] font-medium leading-tight text-foreground text-pretty">
                  {projectTypeLabels[key][lang]}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Recent */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("recentProjects")}
        </h2>
        {projects.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
            {t("noProjects")}
          </p>
        ) : (
          <ul className="space-y-2">
            {projects.slice(0, 4).map((p) => {
              const total = computeTotals(p.lineItems, p.estimate).total
              return (
                <li key={p.id}>
                  <button
                    onClick={() => openProject(p.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {p.customer.name || t("newProject")}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.type ? projectTypeLabels[p.type][lang] : "—"}
                      </p>
                    </div>
                    <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                      <span className="font-semibold text-foreground">{money(total)}</span>
                      <StatusBadge status={p.status} />
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
