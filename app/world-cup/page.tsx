"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const WC_SEASON_ID = "ca080bd2-7691-4396-a123-5264ffaeceef"

export default function WorldCupPage() {
  const { data: session } = useSession()
  const [round, setRound] = useState<any>(null)

  useEffect(() => {
    fetch("/api/world-cup/status").then(r => r.json()).then(d => {
      setRound(d.round)
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">🏆 FIFA</div>
          <div className="text-3xl font-black">World Cup 2026</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/world-cup/predictii" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">📋</div>
            <div className="font-bold text-white mb-1">Predicții</div>
            <div className="text-sm text-gray-500">Pune-ți predicțiile pentru WC</div>
          </a>
          <a href="/world-cup/live" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">🔴</div>
            <div className="font-bold text-white mb-1">Live</div>
            <div className="text-sm text-gray-500">Scoruri live WC</div>
          </a>
          <a href="/world-cup/clasament" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">🏆</div>
            <div className="font-bold text-white mb-1">Clasament</div>
            <div className="text-sm text-gray-500">Clasament WC</div>
          </a>
          <a href="/world-cup/rezultate" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">📊</div>
            <div className="font-bold text-white mb-1">Rezultatele mele</div>
            <div className="text-sm text-gray-500">Istoricul predicțiilor WC</div>
          </a>
        </div>
      </div>
    </div>
  )
}