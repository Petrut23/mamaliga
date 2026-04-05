const fs = require('fs')

const layout = `import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import Navbar from "./components/Navbar"

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
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}`

fs.writeFileSync('app/layout.tsx', layout)
console.log('Gata!')