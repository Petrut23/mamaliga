const fs = require('fs')

const content = `import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPER_ADMIN") redirect("/")

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between">
        <div className="text-2xl font-black tracking-widest">Mama<span className="text-[#e8ff47]">LIGA</span> <span className="text-sm font-normal text-gray-500">Admin</span></div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">{session.user?.name}</span>
          <a href="/" className="text-xs font-semibold text-gray-500 hover:text-white transition-colors">← Site</a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-black tracking-wide mb-2">Dashboard Admin</h1>
        <p className="text-gray-500 mb-10">Gestionează etapele, meciurile și utilizatorii</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <a href="/admin/etape" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors">
            <div className="text-3xl mb-3">🗓️</div>
            <div className="font-bold text-white mb-1">Etape</div>
            <div className="text-sm text-gray-500">Creează și gestionează etapele sezonului</div>
          </a>
          <a href="/admin/meciuri" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors">
            <div className="text-3xl mb-3">⚽</div>
            <div className="font-bold text-white mb-1">Meciuri</div>
            <div className="text-sm text-gray-500">Adaugă meciuri și sincronizează scoruri</div>
          </a>
          <a href="/admin/utilizatori" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors">
            <div className="text-3xl mb-3">👥</div>
            <div className="font-bold text-white mb-1">Utilizatori</div>
            <div className="text-sm text-gray-500">Vezi și gestionează utilizatorii</div>
          </a>
        </div>
      </div>
    </div>
  )
}`

fs.writeFileSync('app/admin/page.tsx', content)
console.log('Gata!')