import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10 md:py-16 text-center">
        <h1 className="text-3xl md:text-5xl font-black tracking-wide mb-3">Bine ai venit, <span className="text-[#e8ff47]">{session.user?.name}!</span></h1>
        <p className="text-gray-400 text-sm md:text-lg mb-10">Prezici scorurile, alegi meciul căpitan și urmărești live cum urci în clasament.</p>
        
        {/* Rand 1 - Predictii si Live */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <a href="/predictii" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-2">📋</div>
            <div className="font-bold text-white text-sm md:text-base">Predicții</div>
            <div className="text-xs text-gray-500 mt-1 hidden md:block">Completează scorurile pentru etapa curentă</div>
          </a>
          <a href="/live" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-2">🔴</div>
            <div className="font-bold text-white text-sm md:text-base">Live</div>
            <div className="text-xs text-gray-500 mt-1 hidden md:block">Scoruri live și clasament în timp real</div>
          </a>
        </div>

        {/* Rand 2 - Clasament si Rezultate */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <a href="/clasament" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold text-white text-sm md:text-base">Clasament</div>
            <div className="text-xs text-gray-500 mt-1 hidden md:block">Vezi clasamentul general al sezonului</div>
          </a>
          <a href="/rezultate" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold text-white text-sm md:text-base">Rezultatele mele</div>
            <div className="text-xs text-gray-500 mt-1 hidden md:block">Istoricul predicțiilor și punctajelor tale</div>
          </a>
        </div>

        {/* Rand 3 - Head to Head si Regulament */}
        <div className="grid grid-cols-2 gap-3">
          <a href="/head-to-head" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-2">⚔️</div>
            <div className="font-bold text-white text-sm">Head-to-Head</div>
          </a>
          <a href="/regulament" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-2">📜</div>
            <div className="font-bold text-white text-sm">Regulament</div>
          </a>
        </div>
      </div>
    </div>
  )
}