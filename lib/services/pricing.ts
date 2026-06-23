import type { EstimateSettings, LineItem } from "@/lib/types"

export const defaultEstimate: EstimateSettings = {
  laborRate: 60,
  wastePct: 10,
  profitPct: 20,
  taxPct: 7,
  discount: 0,
}

export type Totals = {
  materials: number
  labor: number
  subtotal: number
  withProfit: number
  tax: number
  total: number
}

export function computeTotals(
  items: LineItem[],
  s: EstimateSettings,
): Totals {
  let materials = 0
  let labor = 0

  for (const it of items) {
    const line = it.qty * it.unitPrice

    if (it.type === "material") {
      materials += line * (1 + s.wastePct / 100)
    } else {
      labor += line
    }
  }

  const subtotal = materials + labor
  const withProfit = subtotal * (1 + s.profitPct / 100) - s.discount
  const tax = withProfit * (s.taxPct / 100)
  const total = withProfit + tax

  return {
    materials: +materials.toFixed(2),
    labor: +labor.toFixed(2),
    subtotal: +subtotal.toFixed(2),
    withProfit: +withProfit.toFixed(2),
    tax: +tax.toFixed(2),
    total: +total.toFixed(2),
  }
}
