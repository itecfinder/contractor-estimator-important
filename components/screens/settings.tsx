"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import { toast } from "sonner"
import { storeLabels } from "@/lib/i18n"
import { useApp } from "@/lib/store"
import type { Lang, StoreKey } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const storeOrder: StoreKey[] = ["homeDepot", "lowes", "menards", "abcSupply", "lumber84"]
export function Settings() {
  const { t, lang, setLang, business, setBusiness } = useApp()
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setBusiness({
        ...business,
        logoUrl: URL.createObjectURL(file),
      })
    }
  }
const handleSave = async () => {
  try {
    setSaving(true)

    const email = business.email // already validated upstream

    // fire-and-forget BD sync
    fetch("/api/create-free-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: business.name.split(" ")[0] || "",
        last_name: business.name.split(" ").slice(1).join(" ") || "",
        email, // trusted from previous step
        phone: business.phone,
        address: business.address,
        city: "",
        state_code: "",
        zip_code: "",
        country_code: "US",
      }),
    }).catch((err) => {
      console.error("BD create failed (background):", err)
    })

    localStorage.setItem(
      `business_profile_${email}`,
      JSON.stringify(business)
    )

    localStorage.removeItem("pending_email")

    toast.success(t("saved"))

    router.push("/project-capture")
  } catch (error) {
    console.error(error)
    toast.error("Something went wrong")
  } finally {
    setSaving(false)
  }
}
  return (
    <div className="space-y-6 px-4 pt-5">
      <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
        {t("settings")}
      </h1>

      {/* Language */}
      <Section title={t("language")}>
        <div className="flex gap-2">
          {(["en", "es"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                "flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-colors",
                lang === l ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground",
              )}
            >
              {l === "en" ? "English" : "Español"}
            </button>
          ))}
        </div>
      </Section>

      {/* Business profile */}
      <Section title={t("businessProfile")}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted"
          >
            {business.logoUrl ? (
              <img src={business.logoUrl || "/placeholder.svg"} alt="logo" className="size-full object-contain" />
            ) : (
              <Upload className="size-5 text-muted-foreground" />
            )}
          </button>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="h-9">
            <Upload className="size-4" />
            {t("uploadLogo")}
          </Button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onLogo} />
        </div>
        <LabeledInput label={t("businessName")} value={business.name} onChange={(v) => setBusiness({ ...business, name: v })} />
        <LabeledInput label={t("phone")} value={business.phone} onChange={(v) => setBusiness({ ...business, phone: v })} />
        <LabeledInput label={t("email")} value={business.email} onChange={(v) => setBusiness({ ...business, email: v })} />
        <LabeledInput label={t("address")} value={business.address} onChange={(v) => setBusiness({ ...business, address: v })} />
      </Section>

      {/* Defaults */}
      <Section title={t("defaults")}>
        <div className="space-y-1.5">
          <Label className="text-sm">{t("preferredStore")}</Label>
          <Select
            value={business.preferredStore ?? undefined}
            onValueChange={(v) => setBusiness({ ...business, preferredStore: v as StoreKey })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {storeOrder.map((s) => (
                <SelectItem key={s} value={s}>
                  {storeLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">{t("currency")}</Label>
          <Select value={business.currency} onValueChange={(v) => v && setBusiness({ ...business, currency: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="MXN">MXN ($)</SelectItem>
              <SelectItem value="CAD">CAD ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>
<Button onClick={handleSave} disabled={saving}
  className="h-12 w-full text-base font-semibold">
  {saving ? "Saving..." : t("save")}
</Button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-10" />
    </div>
  )
}
