import type { Metadata } from "next"
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
}