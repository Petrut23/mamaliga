const fs = require('fs')

const content = `import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await auth()
  if (!session) redirect("/login")
  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between">
        <div className="text-2xl font-black tracking-widest">Mama<span className="text-[#e8ff47]">LIGA</span></div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">{session.user?.name}</span>
          <a href="/api/auth/signout" className="text-xs font-semibold text-gray-500 hover:text-white">Ieși</a>
        </div>
      </nav>
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

fs.writeFileSync('app/page.tsx', content)
console.log('Gata!')