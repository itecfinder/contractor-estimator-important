import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AppShell from "@/components/app-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const cookie = cookieStore.get("session")?.value

  let session = null

  try {
    session = cookie ? JSON.parse(cookie) : null
  } catch (e) {
    session = null
  }

  if (!session?.loggedIn) {
    redirect("/login")
  }

  return <AppShell session={session}>{children}</AppShell>
}
