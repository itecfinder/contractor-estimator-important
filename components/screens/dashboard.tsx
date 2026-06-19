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
import { useState } from "react"

import { projectTypeLabels } from "@/lib/i18n"
import { computeTotals, useApp } from "@/lib/store"
import type { ProjectTypeKey } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "./status-badge"

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

type VerificationResult = {
  allowed: boolean
  access?: "lead" | "free" | "paid"
  remainingPasses?: number
  message?: string
}

export function Dashboard() {
  const { t, lang, startProject, projects, openProject, money } = useApp()

  const [businessName, setBusinessName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const getPassKey = (access: "lead" | "free") => {
    return `single_pass_used_${access}_${phone || email}`
  }

  const createProject = async (projectType?: ProjectTypeKey) => {
    if (!businessName || !phone || !email) {
      alert("Please complete all fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/verify-membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          phone,
          email,
        }),
      })

      const result: VerificationResult = await response.json()

      if (!result.allowed) {
        alert(result.message || "Access denied")
        return
      }

      if (result.access === "paid") {
        startProject(projectType ?? null)
        return
      }

      if (result.access === "free" || result.access === "new") {
        const passKey = getPassKey(result.access)

        const passUsed = localStorage.getItem(passKey) === "true"

        if (passUsed) {
          alert("Your free pass has already been used. Please upgrade to continue.")
          return
        }

        localStorage.setItem(passKey, "true")
        startProject(projectType ?? null)
        return
      }

      startProject(projectType ?? null)
    } catch (error) {
      console.error(error)
      alert("Unable to verify account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 px-4 pt-5">
      <div className="rounded-2xl bg-secondary p-5 text-secondary-foreground">
        <p className="text-sm font-medium text-primary">{t("appName")}</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-balance font-[family-name:var(--font-heading)]">
          {t("tagline")}
        </h1>

        <Input
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="mt-4 border-white/30 bg-transparent text-white placeholder:text-white/60"
        />

        <Input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 border-white/30 bg-transparent text-white placeholder:text-white/60"
        />

        <Input
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 border-white/30 bg-transparent text-white placeholder:text-white/60"
        />

        <Button
          onClick={() => createProject()}
          disabled={loading}
          className="mt-4 h-12 w-full text-base font-semibold"
        >
          <Plus className="size-5" />
          {loading ? "Verifying..." : t("newProject")}
        </Button>
      </div>

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
                disabled={loading}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-2 text-center transition-colors active:bg-accent disabled:opacity-60"
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
                      <span className="font-semibold text-foreground">
                        {money(total)}
                      </span>
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
