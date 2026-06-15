"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { projectTypeLabels } from "@/lib/i18n"
import { useApp } from "@/lib/store"
import type { ProjectTypeKey } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScreenHeader, StickyBar } from "./parts"

const typeOrder: ProjectTypeKey[] = [
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

export function ProjectCapture() {
  const { t, lang, current, updateCurrent, saveCurrent, go } = useApp()
  const [touched, setTouched] = useState(false)
  if (!current) return null
  const c = current.customer

  const emailValid = !c.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)
  const zipValid = !c.zip || /^\d{5}$/.test(c.zip)
  const nameError = touched && !c.name.trim()
  const emailError = touched && !emailValid
  const zipError = touched && !zipValid

  const setC = (patch: Partial<typeof c>) =>
    updateCurrent({ customer: { ...c, ...patch } })

  const next = () => {
    setTouched(true)
    if (!c.name.trim() || !emailValid || !zipValid || !current.type) return
    saveCurrent()
    go("scan")
  }

  return (
    <div>
      <ScreenHeader title={t("customerInfo")} step={{ current: 1, total: 4 }} back="dashboard" />

      <div className="space-y-4 px-4 pt-4">
        <Field label={t("customerName")} error={nameError ? t("required") : undefined}>
          <Input
            value={c.name}
            onChange={(e) => setC({ name: e.target.value })}
            placeholder="John Carter"
            aria-invalid={nameError}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("phone")}>
            <Input
              type="tel"
              inputMode="tel"
              value={c.phone}
              onChange={(e) => setC({ phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </Field>
          <Field label={t("zip")} error={zipError ? t("invalidZip") : undefined}>
            <Input
              inputMode="numeric"
              maxLength={5}
              value={c.zip}
              onChange={(e) => setC({ zip: e.target.value.replace(/\D/g, "") })}
              placeholder="60601"
              aria-invalid={zipError}
            />
          </Field>
        </div>
        <Field label={t("email")} error={emailError ? t("invalidEmail") : undefined}>
          <Input
            type="email"
            inputMode="email"
            value={c.email}
            onChange={(e) => setC({ email: e.target.value })}
            placeholder="john@email.com"
            aria-invalid={emailError}
          />
        </Field>
        <Field label={t("address")}>
          <Input
            value={c.address}
            onChange={(e) => setC({ address: e.target.value })}
            placeholder="123 Main St, Chicago, IL"
          />
        </Field>

        <div className="h-px bg-border" />

        <Field
          label={t("projectType")}
          error={touched && !current.type ? t("required") : undefined}
        >
          <Select
            value={current.type ?? undefined}
            onValueChange={(v) => updateCurrent({ type: v as ProjectTypeKey })}
          >
            <SelectTrigger aria-invalid={touched && !current.type}>
              <SelectValue placeholder={t("projectType")} />
            </SelectTrigger>
            <SelectContent>
              {typeOrder.map((key) => (
                <SelectItem key={key} value={key}>
                  {projectTypeLabels[key][lang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label={t("notes")}>
          <Textarea
            rows={4}
            value={current.notes}
            onChange={(e) => updateCurrent({ notes: e.target.value })}
            placeholder={t("notesPlaceholder")}
          />
        </Field>
      </div>

      <StickyBar>
        <Button onClick={next} className="h-12 w-full text-base font-semibold">
          {t("continueToScan")}
          <ArrowRight className="size-5" />
        </Button>
      </StickyBar>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}

