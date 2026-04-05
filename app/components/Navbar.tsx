"use client"
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
}