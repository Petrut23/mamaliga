const fs = require('fs')

// Fix homepage - adauga rezultate
const homepage = `import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-black tracking-wide mb-4">Bine ai venit, <span className="text-[#e8ff47]">{session.user?.name}!</span></h1>
        <p className="text-gray-400 text-lg mb-12">Prezici scorurile, alegi meciul căpitan și urmărești live cum urci în clasament.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <a href="/rezultate" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-left">
            <div className="text-3xl mb-3">📊</div>
            <div className="font-bold text-white mb-1">Rezultatele mele</div>
            <div className="text-sm text-gray-500">Istoricul predicțiilor și punctajelor tale</div>
          </a>
        </div>
      </div>
    </div>
  )
}`

fs.writeFileSync('app/page.tsx', homepage)

// Sterge navbar din pagina predictii
let predictii = fs.readFileSync('app/predictii/page.tsx', 'utf8')
predictii = predictii.replace(
  `      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <a href="/" className="text-2xl font-black tracking-widest">Mama<span className="text-[#e8ff47]">LIGA</span></a>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm hidden md:block">{session?.user?.name}</span>
          <a href="/" className="text-xs text-gray-500 hover:text-white">← Acasa</a>
        </div>
      </nav>`,
  ``
)
fs.writeFileSync('app/predictii/page.tsx', predictii)

// Sterge navbar din pagina live
let live = fs.readFileSync('app/live/page.tsx', 'utf8')
live = live.replace(
  `      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <a href="/" className="text-2xl font-black tracking-widest">Mama<span className="text-[#e8ff47]">LIGA</span></a>
        <div className="flex items-center gap-3">
          {liveMatches.length > 0 && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-xs font-bold text-red-400">{liveMatches.length} LIVE</span>
            </div>
          )}
          <a href="/" className="text-xs text-gray-500 hover:text-white">← Acasa</a>
        </div>
      </nav>`,
  ``
)
fs.writeFileSync('app/live/page.tsx', live)

// Sterge navbar din pagina clasament
let clasament = fs.readFileSync('app/clasament/page.tsx', 'utf8')
clasament = clasament.replace(
  `      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <a href="/" className="text-2xl font-black tracking-widest">Mama<span className="text-[#e8ff47]">LIGA</span></a>
        <a href="/" className="text-xs text-gray-500 hover:text-white">← Acasa</a>
      </nav>`,
  ``
)
fs.writeFileSync('app/clasament/page.tsx', clasament)

console.log('Gata!')