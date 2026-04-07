const fs = require('fs')

const navbar = `"use client"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const isAdmin = (session?.user as any)?.role === "ADMIN" || (session?.user as any)?.role === "SUPER_ADMIN"
  const isOnAdmin = pathname?.startsWith("/admin")

  const userLinks = [
    { href: "/predictii", label: "Predicții", icon: "📋" },
    { href: "/live", label: "Live", icon: "🔴" },
    { href: "/clasament", label: "Clasament", icon: "🏆" },
    { href: "/rezultate", label: "Rezultate", icon: "📊" },
    { href: "/head-to-head", label: "H2H", icon: "⚔️" },
  ]

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: "🏠" },
    { href: "/admin/etape", label: "Etape", icon: "🗓️" },
    { href: "/admin/meciuri", label: "Meciuri", icon: "⚽" },
    { href: "/admin/utilizatori", label: "Utilizatori", icon: "👥" },
  ]

  const links = isOnAdmin ? adminLinks : userLinks

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5"
      style={{
        background: "linear-gradient(180deg, rgba(17,21,32,0.98) 0%, rgba(10,13,20,0.95) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 1px 0 rgba(232,255,71,0.05), 0 4px 20px rgba(0,0,0,0.4)"
      }}>
      <div className="px-4 md:px-6 h-14 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-1 flex-shrink-0 group">
          <span className="text-2xl font-black tracking-widest"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #c0c8e0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Mama</span>
          <span className="text-2xl font-black tracking-widest"
            style={{
              background: "linear-gradient(135deg, #e8ff47 0%, #b8d400 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 8px rgba(232,255,71,0.4))"
            }}>LIGA</span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {links.map(link => (
            <Link key={link.href} href={link.href}
              className={"relative text-xs md:text-sm font-semibold px-2 md:px-3 py-1.5 rounded-lg transition-all duration-200 " +
                (pathname === link.href
                  ? "text-[#e8ff47]"
                  : "text-gray-400 hover:text-white")}
              style={pathname === link.href ? {
                background: "linear-gradient(135deg, rgba(232,255,71,0.12) 0%, rgba(232,255,71,0.06) 100%)",
                boxShadow: "inset 0 1px 0 rgba(232,255,71,0.15), 0 0 12px rgba(232,255,71,0.08)"
              } : {}}>
              <span className="md:hidden">{link.icon}</span>
              <span className="hidden md:inline">{link.label}</span>
            </Link>
          ))}

          {isAdmin && !isOnAdmin && (
            <Link href="/admin"
              className="text-xs md:text-sm font-bold px-2 md:px-3 py-1.5 rounded-lg transition-all duration-200 text-[#e8ff47]"
              style={{
                background: "linear-gradient(135deg, rgba(232,255,71,0.15) 0%, rgba(232,255,71,0.05) 100%)",
                border: "1px solid rgba(232,255,71,0.25)",
                boxShadow: "0 0 12px rgba(232,255,71,0.1), inset 0 1px 0 rgba(232,255,71,0.2)"
              }}>
              <span className="md:hidden">⚙️</span>
              <span className="hidden md:inline">Admin</span>
            </Link>
          )}

          {isOnAdmin && (
            <Link href="/"
              className="text-xs md:text-sm font-semibold px-2 md:px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-colors">
              <span className="md:hidden">🏠</span>
              <span className="hidden md:inline">← Site</span>
            </Link>
          )}

          <div className="flex items-center gap-2 ml-1 md:ml-2 pl-2 md:pl-3"
            style={{borderLeft: "1px solid rgba(255,255,255,0.08)"}}>
            <span className="text-sm font-bold hidden md:block"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #a0a8c0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>{session?.user?.name}</span>
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs font-bold text-gray-400 hover:text-white transition-all duration-200 px-2 py-1 rounded-lg"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)"
              }}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  )
}`

fs.writeFileSync('app/components/Navbar.tsx', navbar)
console.log('Gata!')