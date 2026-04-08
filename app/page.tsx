import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl md:text-5xl font-black tracking-wide mb-4">Bine ai venit, <span className="text-[#e8ff47]">{session.user?.name}!</span></h1>
        <p className="text-gray-400 text-lg mb-12">Prezici scorurile, alegi meciul căpitan și urmărești live cum urci în clasament.</p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <a href="/predictii" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">📋</div>
            <div className="font-bold text-white mb-1">Predicții</div>
            <div className="text-sm text-gray-500">Completează scorurile pentru etapa curentă</div>
          </a>
          <a href="/live" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">🔴</div>
            <div className="font-bold text-white mb-1">Live</div>
            <div className="text-sm text-gray-500">Scoruri live și clasament în timp real</div>
          </a>
          <a href="/clasament" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">🏆</div>
            <div className="font-bold text-white mb-1">Clasament</div>
            <div className="text-sm text-gray-500">Vezi clasamentul general al sezonului</div>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          <a href="/rezultate" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">📊</div>
            <div className="font-bold text-white mb-1">Rezultatele mele</div>
            <div className="text-sm text-gray-500">Istoricul predicțiilor și punctajelor tale</div>
          </a>
          <a href="/head-to-head" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">⚔️</div>
            <div className="font-bold text-white mb-1">Head-to-Head</div>
            <div className="text-sm text-gray-500">Compara-te cu un alt jucator</div>
          </a>
        </div>
      </div>
    </div>
  )
}