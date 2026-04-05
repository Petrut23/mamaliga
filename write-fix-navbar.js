const fs = require('fs')

const layout = `import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import NavbarWrapper from "./components/NavbarWrapper"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MamaLIGA",
  description: "Jocul de predictii al grupului",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className={geist.className}>
        <Providers>
          <NavbarWrapper />
          {children}
        </Providers>
      </body>
    </html>
  )
}`

const navbarWrapper = `"use client"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function NavbarWrapper() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const hideOn = ["/login", "/register"]
  if (hideOn.includes(pathname || "")) return null
  if (status === "loading") return null
  if (!session) return null

  return <Navbar />
}`

fs.writeFileSync('app/layout.tsx', layout)
fs.writeFileSync('app/components/NavbarWrapper.tsx', navbarWrapper)
console.log('Gata!')