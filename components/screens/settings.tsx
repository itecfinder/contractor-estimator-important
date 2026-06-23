"use client"

import { useRef } from "react"
import { Upload } from "lucide-react"
import { useBusinessQuery, useBusinessMutation } from "./useBusiness"
import { useApp } from "@/lib/store"

function Header({ dirty }: { dirty: boolean }) {
  return (
    <div className="flex justify-between">
      <h1 className="text-xl font-bold">Settings</h1>
      <span className="text-xs text-muted-foreground">
        {dirty ? "Unsaved changes" : "Saved"}
      </span>
    </div>
  )
}

export function Settings() {
  const { data } = useBusinessQuery()
  const mutation = useBusinessMutation()
  const fileRef = useRef<HTMLInputElement>(null)

  if (!data) return null

  const setField = (key: string, value: any) => {
    mutation.mutate({ [key]: value })
  }

  return (
    <div className="space-y-6 px-4 pt-5">
      <Header dirty={mutation.isPending} />

      <section className="space-y-3">
        <input
          value={data.name || ""}
          onChange={(e) => setField("name", e.target.value)}
          className="input"
        />

        <input
          value={data.email || ""}
          onChange={(e) => setField("email", e.target.value)}
          className="input"
        />

        <select
          value={data.currency || "USD"}
          onChange={(e) => setField("currency", e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="MXN">MXN</option>
          <option value="CAD">CAD</option>
        </select>

        <button onClick={() => fileRef.current?.click()}>
          <Upload className="w-4 h-4" />
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
      </section>
    </div>
  )
}
