"use client"
import { useState, useEffect } from "react"

export default function HistoryPage() {
  const [seasons, setSeasons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/history").then(r => r.json()).then(d => {
      setSeasons(d.seasons || [])
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-gray-500">Se incarca...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white pb-10">
      <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">Arhivă</div>
          <div className="text-3xl font-black">History</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {seasons.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <div className="text-lg font-bold text-white mb-2">Niciun sezon finalizat</div>
            <div className="text-sm text-gray-500 mb-6">Istoricul apare după finalizarea primului sezon</div>
            <a href="/" className="text-[#e8ff47] hover:underline text-sm">← Inapoi acasa</a>
          </div>
        ) : (
          <div className="space-y-4">
            {seasons.map(season => (
              <div key={season.id} className="bg-[#111520] border border-[#1e2640] rounded-xl overflow-hidden">
                <button onClick={() => setExpanded(expanded === season.id ? null : season.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#1a2035] transition-colors">
                  <div className="text-left">
                    <div className="font-bold text-white">Sezon {season.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{season.seasonRankings.length} jucători</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {season.isActive && (
                      <span className="text-xs bg-[#e8ff47]/10 text-[#e8ff47] border border-[#e8ff47]/20 px-2 py-1 rounded-full font-bold">Activ</span>
                    )}
                    <span className="text-gray-500">{expanded === season.id ? "▲" : "▼"}</span>
                  </div>
                </button>

                {expanded === season.id && (
                  <div className="border-t border-[#1e2640]">
                    {season.seasonRankings.length === 0 ? (
                      <div className="px-5 py-4 text-sm text-gray-500 italic">
                        Niciun clasament salvat pentru acest sezon.
                      </div>
                    ) : (
                      season.seasonRankings.map((r: any, i: number) => (
                        <div key={r.id} className={"px-5 py-3 flex items-center gap-3 border-b border-[#1e2640]/50 last:border-0 " + (i === 0 ? "bg-[#fbbf24]/05" : "")}>
                          <div className={"text-xl font-black w-8 text-center " + (i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.finalRank}
                          </div>
                          <div className="flex-1 font-bold">{r.user.name}</div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-black text-[#e8ff47]">{r.totalPoints}</div>
                              <div className="text-xs text-gray-500">puncte</div>
                            </div>
                            <div>
                              <div className="text-lg font-black text-white">{r.roundsWon}</div>
                              <div className="text-xs text-gray-500">câștigate</div>
                            </div>
                            <div>
                              <div className="text-lg font-black text-gray-400">{Number(r.average).toFixed(1)}</div>
                              <div className="text-xs text-gray-500">medie</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
