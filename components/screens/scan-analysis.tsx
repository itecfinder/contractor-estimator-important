"use client"

import { useState, useRef } from "react"
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  HelpCircle,
  ImagePlus,
  Loader2,
  Ruler,
  Sparkles,
  X,
} from "lucide-react"

import { useApp } from "@/lib/store"
import { generateLineItems, uid } from "@/lib/mock"
import type { ScanMode } from "@/lib/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { ScreenHeader, StickyBar } from "./parts"
import { cn } from "@/lib/utils"

const severityCls: Record<string, string> = {
  low: "text-chart-2",
  medium: "text-chart-5",
  high: "text-destructive",
}

export function ScanAnalysis() {
  const { t, current, updateCurrent, saveCurrent, go } = useApp()
  const [busy, setBusy] = useState(false)
  const [extraCosts, setExtraCosts] = useState([
  { description: "", amount: "" },
])
  const fileInputRef = useRef<HTMLInputElement>(null)
  if (!current) return null
const handleUpload = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const files = Array.from(event.target.files || [])
  if (!files.length) return
  updateCurrent({ images: [ ...current.images, ...files.map((file) => ({ id: uid(), url: URL.createObjectURL(file),
  scanMode: "generic" as ScanMode,
      })),
    ],
  })
} 
  const removeImage = (id: string) =>
    updateCurrent({ images: current.images.filter((i) => i.id !== id) })
  const analyze = async () => {
  if (!current.type) return

  setBusy(true)

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
    })

   const analysis = await response.json()
  console.log("AI RESULT:", analysis)
    updateCurrent({ analysis })
    
  } catch (error) {
    console.error("Analysis failed:", error)
  } finally {
    setBusy(false)
  }
}
 
  const buildEstimate = () => {
    if (!current.type) return
    const items = current.lineItems.length
      ? current.lineItems
      : generateLineItems(current.type)
    updateCurrent({ lineItems: items, status: "estimated" })
    saveCurrent()
    go("estimate")
  }
 
  return (
<>
<ScreenHeader
title={t("scanProject")}
step={{ current: 2, total: 4 }}
back="capture"
/>

<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  multiple
  onChange={handleUpload}
  className="hidden"/>
<div className="space-y-5 px-4 pt-4">

        {/* Capture actions */}
        <div className="grid grid-cols-2 gap-2.5">
<Button
  variant="secondary"
  className="h-12"
  onClick={() => fileInputRef.current?.click()}
>
  <Camera className="size-5" />
  {t("takePhoto")}
</Button>
          
<Button variant="outline" className="h-12" onClick={() => fileInputRef.current?.click()}>
   <ImagePlus className="size-5" /> {t("uploadPhotos")}
        </Button>
        </div>
        {/* Photos */}
        {current.images.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">
              {current.images.length} {t("photosAdded")}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {current.images.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                  <img
                    src={img.url || "/placeholder.svg"}
                    alt={img.scanMode}
                    className="size-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-secondary/80 text-secondary-foreground"
                    aria-label="Remove"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyze */}
        {!current.analysis && (
          <Button
            onClick={analyze}
            disabled={current.images.length === 0 || busy}
            className="h-12 w-full text-base font-semibold"
          >
            {busy ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                {t("analyzing")}
              </>
            ) : (
              <>
                <Sparkles className="size-5" />
                {t("analyzeAI")}
              </>
            )}
          </Button>
        )}
{/* Results */}
{current.analysis && (
  <div className="space-y-4">

    <ResultCard
      title={t("detectedSurfaces")}
      icon={<Ruler className="size-4 text-primary" />}
    >
      {current.analysis.surfaces.map((s, i) => (
        <li
          key={i}
          className="flex items-center justify-between py-1.5 text-sm"
        >
          <span>{s.label}</span>
          <span className="flex items-center gap-2">
            <span className="font-semibold">
              {s.area} {s.unit}
            </span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
              {Math.round(s.confidence * 100)}% {t("confidence")}
            </span>
          </span>
        </li>
      ))}
    </ResultCard>

    <ResultCard
      title={t("damageFindings")}
      icon={<AlertTriangle className="size-4 text-chart-5" />}
    >
      {current.analysis.damage.map((d, i) => (
        <li
          key={i}
          className="flex items-center justify-between py-1.5 text-sm"
        >
          <span>{d.label}</span>
          <span
            className={cn(
              "text-xs font-semibold uppercase",
              severityCls[d.severity]
            )}
          >
            {d.severity}
          </span>
        </li>
      ))}
    </ResultCard>

    <ResultCard
      title={t("scopeItems")}
      icon={<Sparkles className="size-4 text-primary" />}
    >
      {current.analysis.scope.map((s, i) => (
        <li
          key={i}
          className="flex items-center gap-2 py-1 text-sm"
        >
          <span className="size-1.5 rounded-full bg-primary" />
          {s}
        </li>
      ))}
    </ResultCard>

    <div className="rounded-xl border border-dashed border-primary/40 bg-accent/40 p-4">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <HelpCircle className="size-4 text-primary" />
        {t("followUps")}
      </p>

      <ul className="space-y-1.5">
        {current.analysis.followUps.map((q, i) => (
          <li key={i} className="text-sm text-muted-foreground">
            {q}
          </li>
        ))}
      </ul>
    </div>

    {/* Additional Costs */}
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-sm font-semibold">
        Additional Costs
      </p>

      <div className="space-y-3">
        {extraCosts.map((cost, index) => (
          <div key={index} className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Description"
              value={cost.description}
              onChange={(e) => {
                const updated = [...extraCosts]
                updated[index].description = e.target.value
                setExtraCosts(updated)
              }}
            />

            <Input
              type="number"
              placeholder="$0"
              value={cost.amount}
              onChange={(e) => {
                const updated = [...extraCosts]
                updated[index].amount = e.target.value
                setExtraCosts(updated)
              }}
            />
          </div>
        ))}

        <Button
          variant="outline"
          onClick={() =>
            setExtraCosts([
              ...extraCosts,
              { description: "", amount: "" },
            ])
          }
        >
          + Add Cost
        </Button>
      </div>
    </div>

  </div>
)}
    <Button
      variant="outline"
      onClick={() =>
        setExtraCosts([
          ...extraCosts,
          { description: "", amount: "" },
        ])
      }
    >
      + Add Cost
    </Button>
  </div>
</div>
        )}
      </div>

      {current.analysis && (
        <StickyBar>
          <Button onClick={buildEstimate} className="h-12 w-full text-base font-semibold">
            {t("buildEstimate")}
            <ArrowRight className="size-5" />
          </Button>
        </StickyBar>
      )}
    </div>
  )
}

function ResultCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </p>
      <ul className="divide-y divide-border/60">{children}</ul>
    </div>
  )
}

