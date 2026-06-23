"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { translate, type DictKey } from "./i18n"
import { uid } from "./mock"
import type {
  BusinessProfile,
  EstimateSettings,
  Lang,
  LineItem,
  Project,
  ProjectTypeKey,
  ScreenKey,
} from "./types"

function blankProject(type: ProjectTypeKey | null = null): Project {
  return {
    id: uid(),
    createdAt: Date.now(),
    status: "draft",
    type,
    customer: { name: "", phone: "", email: "", address: "", zip: "" },
    notes: "",
    images: [],
    analysis: null,
    estimate: { ...defaultEstimate },
    lineItems: [],
    paymentTerms: "Due on receipt",
    invoiceNumber: null,
  }
}
type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (k: DictKey) => string

  screen: ScreenKey
  go: (s: ScreenKey) => void

  business: BusinessProfile
  setBusiness: (b: BusinessProfile) => void

  projects: Project[]
  current: Project | null

  startProject: (type?: ProjectTypeKey | null) => void
  openProject: (id: string) => void
  updateCurrent: (patch: Partial<Project>) => void
  saveCurrent: () => void

  totals: Totals
  money: (n: number) => string
}

const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")
  const [screen, setScreen] = useState<ScreenKey>("dashboard")

  const [projects, setProjects] = useState<Project[]>([])
  const [current, setCurrent] = useState<Project | null>(null)

  const [business, setBusiness] = useState<BusinessProfile>({
    name: "",
    category: "",
    phone: "",
    email: "",
    address: "",
    logoUrl: null,
    preferredStore: "homeDepot",
    currency: "USD",
  })

  const t = useCallback((k: DictKey) => translate(k, lang), [lang])

  /**
   * SAFE NAVIGATION (prevents invalid transitions)
   */
  const go = useCallback(
    (next: ScreenKey) => {
      setScreen((prev) => {
        if (prev === next) return prev
        return next
      })
    },
    [],
  )

  const startProject = useCallback(
    (type: ProjectTypeKey | null = null) => {
      setCurrent(blankProject(type))
      setScreen("projectCapture")
    },
    [],
  )

  const openProject = useCallback(
    (id: string) => {
      const p = projects.find((x) => x.id === id)
      if (!p) return

      setCurrent({ ...p })
      setScreen(p.status === "draft" ? "projectCapture" : "estimate")
    },
    [projects],
  )

  const updateCurrent = useCallback((patch: Partial<Project>) => {
    setCurrent((c) => (c ? { ...c, ...patch } : c))
  }, [])

  const saveCurrent = useCallback(() => {
    setCurrent((c) => {
      if (!c) return c

      setProjects((prev) => {
        const exists = prev.some((p) => p.id === c.id)
        return exists
          ? prev.map((p) => (p.id === c.id ? c : p))
          : [c, ...prev]
      })

      return c
    })
  }, [])

  const money = useCallback(
    (n: number) =>
      new Intl.NumberFormat(lang === "es" ? "es-US" : "en-US", {
        style: "currency",
        currency: business.currency || "USD",
      }).format(n || 0),
    [lang, business.currency],
  )

  const totals = useMemo(
    () =>
      current
        ? computeTotals(current.lineItems, current.estimate)
        : {
            materials: 0,
            labor: 0,
            subtotal: 0,
            withProfit: 0,
            tax: 0,
            total: 0,
          },
    [current],
  )

  const value: Ctx = {
    lang,
    setLang,
    t,
    screen,
    go,
    business,
    setBusiness,
    projects,
    current,
    startProject,
    openProject,
    updateCurrent,
    saveCurrent,
    totals,
    money,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
