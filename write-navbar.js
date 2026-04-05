const fs = require('fs')

const navbar = `"use client"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const isAdmin = (session?.user as any)?.role === "ADMIN" || (session?.user as any)?.role === "SUPER_ADMIN"

  const links = [
    { href: "/predictii", label: "Predicții", icon: "📋" },
    { href: "/live", label: "Live", icon: "🔴" },
    { href: "/clasament", label: "Clasament", icon: "🏆" },
  ]

  return (
    <nav className="bg-[#111520] border-b border-[#1e2640] px-4 md:px-6 h-14 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="text-2xl font-black tracking-widest flex-shrink-0">
        Mama<span className="text-[#e8ff47]">LIGA</span>
      </Link>

      <div className="flex items-center gap-1 md:gap-3">
        {links.map(link => (
          <Link key={link.href} href={link.href} className={"text-xs md:text-sm font-semibold px-2 md:px-3 py-1.5 rounded-lg transition-colors " + (pathname === link.href ? "bg-[#e8ff47]/10 text-[#e8ff47]" : "text-gray-400 hover:text-white")}>
            <span className="md:hidden">{link.icon}</span>
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        ))}
        {isAdmin && (
          <Link href="/admin" className={"text-xs md:text-sm font-semibold px-2 md:px-3 py-1.5 rounded-lg transition-colors " + (pathname?.startsWith("/admin") ? "bg-[#e8ff47]/10 text-[#e8ff47]" : "text-gray-400 hover:text-white")}>
            <span className="md:hidden">⚙️</span>
            <span className="hidden md:inline">Admin</span>
          </Link>
        )}
        <div className="flex items-center gap-2 ml-1 md:ml-2 pl-2 md:pl-3 border-l border-[#1e2640]">
          <span className="text-xs text-gray-500 hidden md:block">{session?.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-xs text-gray-500 hover:text-white transition-colors">Ieși</button>
        </div>
      </div>
    </nav>
  )
}`

fs.writeFileSync('app/components/Navbar.tsx', navbar)

// Update homepage
const homepage = `import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-6xl font-black tracking-wide mb-4">Bine ai venit, <span className="text-[#e8ff47]">{session.user?.name}!</span></h1>
        <p className="text-gray-400 text-lg mb-12">Prezici scorurile, alegi meciul căpitan și urmărești live cum urci în clasament.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/predictii" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-left">
            <div className="text-3xl mb-3">📋</div>
            <div className="font-bold text-white mb-1">Predicții</div>
            <div className="text-sm text-gray-500">Completează scorurile pentru etapa curentă</div>
          </a>
          <a href="/live" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-left">
            <div className="text-3xl mb-3">🔴</div>
            <div className="font-bold text-white mb-1">Live</div>
            <div className="text-sm text-gray-500">Scoruri live și clasament în timp real</div>
          </a>
          <a href="/clasament" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-left">
            <div className="text-3xl mb-3">🏆</div>
            <div className="font-bold text-white mb-1">Clasament</div>
            <div className="text-sm text-gray-500">Vezi clasamentul general al sezonului</div>
          </a>
        </div>
      </div>
    </div>
  )
}`

fs.mkdirSync('app/components', { recursive: true })
fs.writeFileSync('app/page.tsx', homepage)
console.log('Gata!')