"use client"

import { ArrowRight, Plus, Store, Trash2 } from "lucide-react"
import { useApp } from "@/lib/store"
import { uid } from "@/lib/mock"
import type { LineItem, LineItemType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScreenHeader, StickyBar } from "./parts"

export function EstimateEditor() {
  const { t, current, updateCurrent, saveCurrent, totals, money, go } = useApp()
  if (!current) return null
  const items = current.lineItems
  const materials = items.filter((i) => i.type === "material")
  const labor = items.filter((i) => i.type === "labor")
  const s = current.estimate

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    updateCurrent({ lineItems: items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })

  const removeItem = (id: string) =>
    updateCurrent({ lineItems: items.filter((i) => i.id !== id) })

  const addItem = (type: LineItemType) =>
    updateCurrent({
      lineItems: [
        ...items,
        {
          id: uid(),
          type,
          description: "",
          qty: 1,
          unit: type === "labor" ? "hr" : "each",
          unitPrice: type === "labor" ? s.laborRate : 0,
          source: "manual",
        },
      ],
    })

  const setControl = (patch: Partial<typeof s>) =>
    updateCurrent({ estimate: { ...s, ...patch } })

  const goPrices = () => {
    saveCurrent()
    go("prices")
  }
  const goInvoice = () => {
    saveCurrent()
    go("invoice")
  }

  return (
    <div>
      <ScreenHeader title={t("estimate")} step={{ current: 3, total: 4 }} back="scan" />

      <div className="space-y-5 px-4 pt-4">
        <LineSection
          title={t("materials")}
          items={materials}
          money={money}
          unitLabel={t("unitPrice")}
          qtyLabel={t("qty")}
          storeLabel
          onUpdate={updateItem}
          onRemove={removeItem}
          onAdd={() => addItem("material")}
          addLabel={t("addLine")}
        />

        <LineSection
          title={t("labor")}
          items={labor}
          money={money}
          unitLabel={t("unitPrice")}
          qtyLabel={t("qty")}
          onUpdate={updateItem}
          onRemove={removeItem}
          onAdd={() => addItem("labor")}
          addLabel={t("addLine")}
        />

        {/* Controls */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">{t("adjustControls")}</p>
          <div className="grid grid-cols-2 gap-3">
            <NumField label={t("laborRate")} value={s.laborRate} onChange={(v) => setControl({ laborRate: v })} />
            <NumField label={t("wastePct")} value={s.wastePct} onChange={(v) => setControl({ wastePct: v })} />
            <NumField label={t("profitPct")} value={s.profitPct} onChange={(v) => setControl({ profitPct: v })} />
            <NumField label={t("taxPct")} value={s.taxPct} onChange={(v) => setControl({ taxPct: v })} />
            <NumField label={t("discount")} value={s.discount} onChange={(v) => setControl({ discount: v })} />
          </div>
        </div>

        {/* Totals */}
        <div className="rounded-xl bg-secondary p-4 text-secondary-foreground">
          <Row label={t("materials")} value={money(totals.materials)} muted />
          <Row label={t("labor")} value={money(totals.labor)} muted />
          <Row label={t("subtotal")} value={money(totals.subtotal)} muted />
          <Row label={`${t("withProfit")} (${s.profitPct}%)`} value={money(totals.withProfit)} muted />
          <Row label={`${t("tax")} (${s.taxPct}%)`} value={money(totals.tax)} muted />
          <div className="my-2 h-px bg-secondary-foreground/20" />
          <Row label={t("total")} value={money(totals.total)} big />
        </div>

        <Button variant="outline" onClick={goPrices} className="h-12 w-full text-base font-semibold">
          <Store className="size-5" />
          {t("comparePrices")}
        </Button>
      </div>

      <StickyBar>
        <Button onClick={goInvoice} className="h-12 w-full text-base font-semibold">
          {t("continueToInvoice")}
          <ArrowRight className="size-5" />
        </Button>
      </StickyBar>
    </div>
  )
}

function LineSection({
  title,
  items,
  money,
  qtyLabel,
  unitLabel,
  storeLabel,
  onUpdate,
  onRemove,
  onAdd,
  addLabel,
}: {
  title: string
  items: LineItem[]
  money: (n: number) => string
  qtyLabel: string
  unitLabel: string
  storeLabel?: boolean
  onUpdate: (id: string, patch: Partial<LineItem>) => void
  onRemove: (id: string) => void
  onAdd: () => void
  addLabel: string
}) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-start gap-2">
              <Input
                value={it.description}
                onChange={(e) => onUpdate(it.id, { description: e.target.value })}
                placeholder="Description"
                className="h-9 flex-1 border-0 bg-transparent px-0 text-sm font-medium shadow-none focus-visible:ring-0"
              />
              <button onClick={() => onRemove(it.id)} aria-label="Remove" className="mt-1.5 text-muted-foreground">
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <LabeledMini label={qtyLabel}>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={it.qty}
                  onChange={(e) => onUpdate(it.id, { qty: +e.target.value })}
                  className="h-9 w-16 text-sm"
                />
              </LabeledMini>
              <span className="self-end pb-2 text-xs text-muted-foreground">{it.unit}</span>
              <LabeledMini label={unitLabel}>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={it.unitPrice}
                  onChange={(e) => onUpdate(it.id, { unitPrice: +e.target.value })}
                  className="h-9 w-20 text-sm"
                />
              </LabeledMini>
              <span className="ml-auto self-end pb-1.5 text-sm font-semibold text-foreground">
                {money(it.qty * it.unitPrice)}
              </span>
            </div>
          </div>
        ))}
        <Button variant="ghost" onClick={onAdd} className="h-9 w-full justify-center text-sm text-primary">
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>
    </section>
  )
}

function LabeledMini({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="h-10"
      />
    </div>
  )
}

function Row({
  label,
  value,
  muted,
  big,
}: {
  label: string
  value: string
  muted?: boolean
  big?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={muted ? "text-sm text-secondary-foreground/70" : big ? "text-base font-bold" : "text-sm"}>
        {label}
      </span>
      <span className={big ? "text-xl font-bold text-primary" : "text-sm font-semibold"}>{value}</span>
    </div>
  )
}

