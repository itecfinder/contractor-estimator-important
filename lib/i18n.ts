import type { Lang, ProjectTypeKey, StoreKey } from "./types"

type Entry = { en: string; es: string }

export const dict = {
  appName: { en: "ContractPro", es: "ProContrata" },
  tagline: { en: "Scan it. Estimate it. Invoice it.", es: "Escanéalo. Estímalo. Factúralo." },
  // nav
  navHome: { en: "Home", es: "Inicio" },
  navProjects: { en: "Projects", es: "Proyectos" },
  navHistory: { en: "History", es: "Historial" },
  navSettings: { en: "Settings", es: "Ajustes" },
  // dashboard
  newProject: { en: "New Project", es: "Nuevo Proyecto" },
  quickStart: { en: "Quick start by project type", es: "Inicio rápido por tipo" },
  recentProjects: { en: "Recent Projects", es: "Proyectos Recientes" },
  noProjects: { en: "No projects yet. Start one above.", es: "Aún no hay proyectos. Crea uno arriba." },
  // capture
  customerInfo: { en: "Customer Info", es: "Datos del Cliente" },
  customerName: { en: "Customer Name", es: "Nombre del Cliente" },
  phone: { en: "Phone", es: "Teléfono" },
  email: { en: "Email", es: "Correo Electrónico" },
  address: { en: "Project Address", es: "Dirección del Proyecto" },
  businessAddress: { en: "Business Address", es: "Dirección del Negocio" },
  zip: { en: "ZIP Code", es: "Código Postal" },
  jobDetails: { en: "Job Details", es: "Detalles del Trabajo" },
  projectType: { en: "Project Type", es: "Tipo de Proyecto" },
  notes: { en: "Job Notes", es: "Notas del Trabajo" },
  notesPlaceholder: { en: "Describe the scope, materials, special requests...", es: "Describa el alcance, materiales, solicitudes especiales..." },
  continueToScan: { en: "Continue to Scan", es: "Continuar a Escanear" },
  // scan
  scanProject: { en: "Scan Project", es: "Escanear Proyecto" },
  takePhoto: { en: "Take Photo", es: "Tomar Foto" },
  uploadPhotos: { en: "Upload from Gallery", es: "Subir de Galería" },
  scanRoof: { en: "Scan Roof", es: "Escanear Techo" },
  scanWalls: { en: "Scan Walls", es: "Escanear Paredes" },
  scanFloors: { en: "Scan Floors", es: "Escanear Pisos" },
  photos: { en: "Photos", es: "Fotos" },
  analyzeAI: { en: "Analyze with AI", es: "Analizar con IA" },
  analyzing: { en: "Analyzing photos...", es: "Analizando fotos..." },
  detectedSurfaces: { en: "Detected Surfaces", es: "Superficies Detectadas" },
  damageFindings: { en: "Damage & Conditions", es: "Daños y Condiciones" },
  scopeItems: { en: "Scope of Work", es: "Alcance del Trabajo" },
  followUps: { en: "A few questions to improve your estimate", es: "Preguntas para mejorar su estimado" },
  buildEstimate: { en: "Build Estimate", es: "Crear Estimado" },
  confidence: { en: "confidence", es: "confianza" },
  // estimate
  estimate: { en: "Estimate", es: "Estimado" },
  materials: { en: "Materials", es: "Materiales" },
  labor: { en: "Labor", es: "Mano de Obra" },
  addLine: { en: "Add line", es: "Agregar línea" },
  laborRate: { en: "Labor Rate ($/hr)", es: "Tarifa de M.O. ($/hr)" },
  wastePct: { en: "Waste %", es: "% Desperdicio" },
  profitPct: { en: "Profit %", es: "% Ganancia" },
  taxPct: { en: "Tax %", es: "% Impuesto" },
  discount: { en: "Discount", es: "Descuento" },
  subtotal: { en: "Subtotal", es: "Subtotal" },
  withProfit: { en: "With profit", es: "Con ganancia" },
  tax: { en: "Tax", es: "Impuesto" },
  total: { en: "Total", es: "Total" },
  qty: { en: "Qty", es: "Cant." },
  unitPrice: { en: "Unit $", es: "Precio U." },
  comparePrices: { en: "Compare Prices", es: "Comparar Precios" },
  continueToInvoice: { en: "Create Invoice", es: "Crear Factura" },
  adjustControls: { en: "Margins & Controls", es: "Márgenes y Controles" },
  // prices
  priceComparison: { en: "Price Comparison", es: "Comparación de Precios" },
  cheapestInStock: { en: "Cheapest in stock", es: "Más barato disponible" },
  outOfStock: { en: "Out of stock", es: "Agotado" },
  inStock: { en: "In stock", es: "Disponible" },
  preferredStore: { en: "Preferred Store", es: "Tienda Preferida" },
  applyCheapest: { en: "Apply cheapest prices", es: "Aplicar precios más baratos" },
  storeTotal: { en: "Cart total", es: "Total carrito" },
  offlinePrices: { en: "Offline prices — refresh when online", es: "Precios sin conexión — actualice en línea" },
  refreshPrices: { en: "Refresh prices", es: "Actualizar precios" },
  // invoice
  invoice: { en: "Invoice", es: "Factura" },
  businessLogo: { en: "Business Logo", es: "Logo del Negocio" },
  uploadLogo: { en: "Upload Logo", es: "Subir Logo" },
  billTo: { en: "Bill To", es: "Facturar A" },
  from: { en: "From", es: "De" },
  description: { en: "Description", es: "Descripción" },
  amount: { en: "Amount", es: "Monto" },
  paymentTerms: { en: "Payment Terms", es: "Términos de Pago" },
  preview: { en: "Preview", es: "Vista Previa" },
  sendInvoice: { en: "Send by Email", es: "Enviar por Correo" },
  shareInvoice: { en: "Share", es: "Compartir" },
  copyInvoice: { en: "Copy", es: "Copiar" },
  saveInvoice: { en: "Save to History", es: "Guardar en Historial" },
  invoiceNo: { en: "Invoice No.", es: "Factura No." },
  date: { en: "Date", es: "Fecha" },
  // history
  history: { en: "History", es: "Historial" },
  noHistory: { en: "Saved projects and invoices appear here.", es: "Los proyectos e invoices guardados aparecen aquí." },
  open: { en: "Open", es: "Abrir" },
  // settings
  settings: { en: "Settings", es: "Ajustes" },
  language: { en: "Language", es: "Idioma" },
  businessProfile: { en: "Business Profile", es: "Perfil del Negocio" },
  businessName: { en: "Business Name", es: "Nombre del Negocio" },
  city: { en: "City", es: "Ciudad" },
zipCode: { en: "ZIP Code", es: "Código Postal" },
  businessType: { en: "Business Type", es: "Tipo de Negocio" },
  defaults: { en: "Estimate Defaults", es: "Valores por Defecto" },
  currency: { en: "Currency", es: "Moneda" },
  save: { en: "Save", es: "Guardar" },
  saved: { en: "Saved", es: "Guardado" },
  // status
  statusDraft: { en: "Draft", es: "Borrador" },
  statusEstimated: { en: "Estimated", es: "Estimado" },
  statusInvoiced: { en: "Invoiced", es: "Facturado" },
  statusSent: { en: "Sent", es: "Enviado" },
  // validation
  required: { en: "Required", es: "Obligatorio" },
  invalidEmail: { en: "Enter a valid email", es: "Correo no válido" },
  invalidZip: { en: "Enter a valid ZIP", es: "Código postal no válido" },
  // misc
  back: { en: "Back", es: "Atrás" },
  step: { en: "Step", es: "Paso" },
  of: { en: "of", es: "de" },
  optional: { en: "optional", es: "opcional" },
  aiAssist: { en: "AI Assist", es: "Asistencia IA" },
  manualEntry: { en: "Manual entry available", es: "Entrada manual disponible" },
  photosAdded: { en: "photo(s) added", es: "foto(s) agregada(s)" },
  emailSent: { en: "Invoice sent to client", es: "Factura enviada al cliente" },
  copied: { en: "Invoice copied to clipboard", es: "Factura copiada al portapapeles" },
  projectSaved: { en: "Project saved", es: "Proyecto guardado" },
} satisfies Record<string, Entry>

export type DictKey = keyof typeof dict

export function translate(key: DictKey, lang: Lang): string {
  return dict[key][lang]
}

export const projectTypeLabels: Record<ProjectTypeKey, Entry> = {
  kitchenBath: { en: "Kitchen & Bath Remodel", es: "Remodelación Cocina y Baño" },
  homeRemodel: { en: "Home Remodeling", es: "Remodelación de Casa" },
  flooring: { en: "Carpet, Tile & Wood Flooring", es: "Pisos: Alfombra, Cerámica y Madera" },
  drywall: { en: "Drywall", es: "Tablaroca / Drywall" },
  siding: { en: "Siding", es: "Revestimiento (Siding)" },
  painting: { en: "Painting", es: "Pintura" },
  insulation: { en: "Insulation", es: "Aislamiento" },
  driveway: { en: "Driveway", es: "Entrada / Driveway" },
  roofing: { en: "Roofing", es: "Techos" },
}

export const storeLabels: Record<StoreKey, string> = {
  homeDepot: "Home Depot",
  lowes: "Lowe's",
  menards: "Menards",
  abcSupply: "ABC Supply",
  lumber84: "84 Lumber",
}

