import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster" // ✅ Import the Toaster

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your expenses and manage your budget with ease",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster /> 
        </ThemeProvider>
      </body>
    </html>
  )
}
