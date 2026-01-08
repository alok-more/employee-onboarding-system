import type React from "react"
import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

// const _geist = Geist({ subsets: ["latin"] })
// const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Onboarding System",
  description: "Complete multi-step employee onboarding and management system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"  bbai-tooltip-injected="true">
      {/* <body className={`${_geist.className} ${_geistMono.className} font-sans antialiased`}> */}
      <body  style={{ fontFamily: 'Arial, sans-serif' }} className="antialiased">
        {children}
      </body>
    </html>
  )
}

