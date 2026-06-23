"use client"

import { useRef } from "react"
import { Upload } from "lucide-react"
import { useApp } from "@/lib/store"
import { useEnterpriseSettings } from "@/lib/hooks/useEnterpriseSettings"

export function Settings() {
  const { t, lang, setLang, business } = useApp()

  const { state, setField, status, dirtyKeys } =
    useEnterpriseSettings(business)

  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-6 px-4 pt-5">
      <Header status={status} dirty={dirtyKeys.size} />

      <Section title={t("businessProfile")}>
        <input
          value={state.name}
          onChange={(e) => setField("name", e.target.value)}
          className="input"
        />

        <input
          value={state.email}
          onChange={(e) => setField("email", e.target.value)}
          className="input"
        />

        <button onClick={() => fileRef.current?.click()}>
          <Upload />
          Upload logo
        </button>

        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setField("logoUrl", URL.createObjectURL(file))
          }}
        />
      </Section>

      <Section title="Language">
        {["en", "es"].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l as any)}
            className={lang === l ? "active" : ""}
          >
            {l}
          </button>
        ))}
      </Section>
    </div>
  )
}

function Header({
  status,
  dirty,
}: {
  status: string
  dirty: number
}) {
  return (
    <div className="flex justify-between">
      <h1 className="text-xl font-bold">Settings</h1>
      <span className="text-xs text-muted-foreground">
        {dirty > 0 ? "Unsaved changes" : status}
      </span>
    </div>
  )
}
