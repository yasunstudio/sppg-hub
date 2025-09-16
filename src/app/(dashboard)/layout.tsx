"use client"

import { SessionProvider } from "next-auth/react"
import { DashboardLayout } from "@/shared/components/layout/dashboard-layout"

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SessionProvider>
  )
}