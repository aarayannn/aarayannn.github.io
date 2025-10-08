import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "PE-NOVTRA — Inovasi Panen Sawit Elektrik Self-Charging",
  description:
    "PE-NOVTRA menghadirkan alat panen sawit elektrik berbasis piezoelektrik untuk modernisasi perkebunan berkelanjutan, hemat energi, dan ramah lingkungan.",
  icons: {
    icon: "/penovtra-logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={poppins.variable}>
      <body className={cn("bg-slate-950 font-sans", poppins.className)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
