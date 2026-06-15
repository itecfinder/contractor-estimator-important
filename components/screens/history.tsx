"use client"

import { ChevronRight, FolderClock, Plus } from "lucide-react"
import { projectTypeLabels } from "@/lib/i18n"
import { computeTotals, useApp } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"

export function History() {
  const { t, lang, projects, openProject, startProject, money } = useApp()

  return (
    <div className="px-4 pt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
          {t("history")}
        </h1>
        <Button size="sm" onClick={() => startProject(null)} className="h-9">
          <Plus className="size-4" />
          {t("newProject")}
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FolderClock className="size-7" />
          </span>
          <p className="max-w-[16rem] text-sm text-muted-foreground text-pretty">{t("noHistory")}</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {projects.map((p) => {
            const total = computeTotals(p.lineItems, p.estimate).total
            return (
              <li key={p.id}>
                <button
                  onClick={() => openProject(p.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-foreground">
                        {p.customer.name || t("newProject")}
                      </p>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.type ? projectTypeLabels[p.type][lang] : "—"}
                      {p.invoiceNumber ? ` · ${p.invoiceNumber}` : ""}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString(lang === "es" ? "es-US" : "en-US")}
                    </p>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-1">
                    <span className="font-semibold text-foreground">{money(total)}</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
