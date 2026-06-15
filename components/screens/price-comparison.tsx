"use client"

import { useMemo, useState } from "react"
import { ArrowRight, BadgePercent, Check, RefreshCw, WifiOff } from "lucide-react"
import { toast } from "sonner"
import { storeLabels } from "@/lib/i18n"
import { generatePriceComparison } from "@/lib/mock"
import { useApp } from "@/lib/store"
import type { StoreKey } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ScreenHeader, StickyBar } from "./parts"
import { cn } from "@/lib/utils"

const storeOrder: StoreKey[] = ["homeDepot", "lowes", "menards", "abcSupply", "lumber84"]

export function PriceComparison() {
  const { t, current, updateCurrent, saveCurrent, money, business, setBusiness, go } = useApp()
  const [seed, setSeed] = useState(0)
  if (!current) return null

  const rows = useMemo(
    () => generatePriceComparison(current.lineItems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current.lineItems, seed],
  )

  const storeTotals = useMemo(() => {
    const totals: Record<StoreKey, { total: number; missing: number }> = {
      homeDepot: { total: 0, missing: 0 },
      lowes: { total: 0, missing: 0 },
      menards: { total: 0, missing: 0 },
      abcSupply: { total: 0, missing: 0 },
      lumber84: { total: 0, missing: 0 },
    }
    for (const row of rows) {
      const item = current.lineItems.find((i) => i.id === row.materialId)
      const qty = item?.qty ?? 1
      for (const p of row.prices) {
        if (p.inStock) totals[p.store].total += p.unitPrice * qty
        else totals[p.store].missing += 1
      }
    }
    return totals
  }, [rows, current.lineItems])

  const cheapestStore = storeOrder.reduce((a, b) =>
    storeTotals[a].total <= storeTotals[b].total ? a : b,
  )

  const applyCheapest = () => {
    const updated = current.lineItems.map((item) => {
      const row = rows.find((r) => r.materialId === item.id)
      if (!row) return item
      const best = row.prices.find((p) => p.store === row.cheapest)
      return best ? { ...item, unitPrice: best.unitPrice, store: row.cheapest } : item
    })
    updateCurrent({ lineItems: updated })
    saveCurrent()
    toast.success(t("applyCheapest"))
  }

  return (
    <div>
      <ScreenHeader title={t("priceComparison")} back="estimate" />

      <div className="space-y-4 px-4 pt-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          <WifiOff className="size-3.5" />
          {t("offlinePrices")}
        </div>

        {/* Preferred store */}
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">{t("preferredStore")}</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {storeOrder.map((store) => (
              <button
                key={store}
                onClick={() => setBusiness({ ...business, preferredStore: store })}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  business.preferredStore === store
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground",
                )}
              >
                {storeLabels[store]}
              </button>
            ))}
          </div>
        </div>

        {/* Store totals */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">{t("storeTotal")}</p>
          <ul className="space-y-1.5">
            {storeOrder
              .slice()
              .sort((a, b) => storeTotals[a].total - storeTotals[b].total)
              .map((store) => {
                const isCheapest = store === cheapestStore
                return (
                  <li key={store} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={isCheapest ? "font-semibold text-chart-2" : "text-foreground"}>
                        {storeLabels[store]}
                      </span>
                      {isCheapest && (
                        <span className="rounded-full bg-chart-2/15 px-2 py-0.5 text-[10px] font-semibold text-chart-2">
                          {t("cheapestInStock")}
                        </span>
                      )}
                      {storeTotals[store].missing > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {storeTotals[store].missing} {t("outOfStock")}
                        </span>
                      )}
                    </span>
                    <span className={cn("font-semibold", isCheapest ? "text-chart-2" : "text-foreground")}>
                      {money(storeTotals[store].total)}
                    </span>
                  </li>
                )
              })}
          </ul>
        </div>

        {/* Per material */}
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.materialId} className="rounded-xl border border-border bg-card p-3">
              <p className="mb-2 text-sm font-semibold text-foreground">{row.description}</p>
              <ul className="space-y-1">
                {row.prices
                  .slice()
                  .sort((a, b) => a.unitPrice - b.unitPrice)
                  .map((p) => {
                    const best = p.store === row.cheapest
                    return (
                      <li
                        key={p.store}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-2 py-1.5 text-sm",
                          best && p.inStock ? "bg-chart-2/10" : "",
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {best && p.inStock && <Check className="size-3.5 text-chart-2" />}
                          <span className={p.inStock ? "text-foreground" : "text-muted-foreground line-through"}>
                            {storeLabels[p.store]}
                          </span>
                          {p.promo && (
                            <span className="flex items-center gap-0.5 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                              <BadgePercent className="size-3" />
                              {p.promo}
                            </span>
                          )}
                        </span>
                        <span className="flex items-center gap-2">
                          {!p.inStock && (
                            <span className="text-[10px] uppercase text-muted-foreground">{t("outOfStock")}</span>
                          )}
                          <span className={cn("font-semibold", best && p.inStock ? "text-chart-2" : "text-foreground")}>
                            {money(p.unitPrice)}/{row.unit}
                          </span>
                        </span>
                      </li>
                    )
                  })}
              </ul>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setSeed((s) => s + 1)
            toast.success(t("refreshPrices"))
          }}
          className="h-11 w-full"
        >
          <RefreshCw className="size-4" />
          {t("refreshPrices")}
        </Button>
      </div>

      <StickyBar>
        <Button onClick={applyCheapest} className="h-12 w-full text-base font-semibold">
          {t("applyCheapest")}
          <ArrowRight className="size-5" />
        </Button>
      </StickyBar>
    </div>
  )
}

