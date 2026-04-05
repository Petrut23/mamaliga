const fs = require('fs')

const providers = `"use client"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}`

const layout = `import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MamaLIGA",
  description: "Jocul de predictii al grupului",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className={geist.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}`

fs.writeFileSync('app/providers.tsx', providers)
fs.writeFileSync('app/layout.tsx', layout)
console.log('Gata!')