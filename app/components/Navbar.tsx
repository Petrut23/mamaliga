"use client"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const isAdmin = (session?.user as any)?.role === "ADMIN" || (session?.user as any)?.role === "SUPER_ADMIN"
  const isOnAdmin = pathname?.startsWith("/admin")
  const [menuOpen, setMenuOpen] = useState(false)

  const userLinks = [
    { href: "/predictii", label: "Predicții", icon: "📋" },
    { href: "/live", label: "Live", icon: "🔴" },
    { href: "/clasament", label: "Clasament", icon: "🏆" },
    { href: "/rezultate", label: "Rezultate", icon: "📊" },
    { href: "/head-to-head", label: "H2H", icon: "⚔️" },
    { href: "/regulament", label: "Regulament", icon: "📜" },
  ]

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: "🏠" },
    { href: "/admin/etape", label: "Etape", icon: "🗓️" },
    { href: "/admin/meciuri", label: "Meciuri", icon: "⚽" },
    { href: "/admin/utilizatori", label: "Utilizatori", icon: "👥" },
  ]

  const links = isOnAdmin ? adminLinks : userLinks

  return (
    <>
      <nav className="bg-[#111520] border-b border-[#1e2640] sticky top-0 z-50">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-widest flex-shrink-0">
            <span className="text-white">Mama</span><span className="text-[#e8ff47]">LIGA</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {links.map(link => (
              <Link key={link.href} href={link.href}
                className={"text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors " +
                  (pathname === link.href ? "bg-[#e8ff47]/10 text-[#e8ff47]" : "text-gray-400 hover:text-white")}>
                {link.label}
              </Link>
            ))}
            {isAdmin && !isOnAdmin && (
              <Link href="/admin" className="text-sm font-bold px-3 py-1.5 rounded-lg border text-[#e8ff47] border-[#e8ff47]/40 bg-[#e8ff47]/10 hover:bg-[#e8ff47]/20">Admin</Link>
            )}
            {isOnAdmin && (
              <Link href="/" className="text-sm font-semibold px-3 py-1.5 rounded-lg text-gray-400 hover:text-white">← Site</Link>
            )}
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-[#1e2640]">
              <span className="text-sm font-bold text-white">{session?.user?.name}</span>
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs font-bold text-gray-300 hover:text-white border border-[#1e2640] px-2 py-1 rounded-lg">Logout</button>
            </div>
          </div>

          {/* Mobile - hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <span className="text-sm font-bold text-white">{session?.user?.name}</span>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-lg border border-[#1e2640]">
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#1e2640] bg-[#111520] px-4 py-3 space-y-1">
            {links.map(link => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className={"flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors " +
                  (pathname === link.href ? "bg-[#e8ff47]/10 text-[#e8ff47]" : "text-gray-400 hover:text-white hover:bg-[#1e2640]")}>
                <span>{link.icon}</span>
                <span className="text-sm font-semibold">{link.label}</span>
              </Link>
            ))}
            {isAdmin && !isOnAdmin && (
              <Link href="/admin" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#e8ff47] bg-[#e8ff47]/10">
                <span>⚙️</span>
                <span className="text-sm font-bold">Admin</span>
              </Link>
            )}
            {isOnAdmin && (
              <Link href="/" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e2640]">
                <span>🏠</span>
                <span className="text-sm font-semibold">← Site</span>
              </Link>
            )}
            <div className="pt-2 border-t border-[#1e2640]">
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10">
                <span>🚪</span>
                <span className="text-sm font-semibold">Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}