"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const COMPETITION_FLAGS: any = {
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "La Liga": "🇪🇸",
  "Serie A": "🇮🇹",
  "Bundesliga": "🇩🇪",
  "Ligue 1": "🇫🇷",
  "Liga 1 Romania": "🇷🇴",
  "Champions League": "🏆",
}

function getPuncteColor(pts: number) {
  if (pts >= 8) return "text-green-400"
  if (pts >= 4) return "text-yellow-400"
  if (pts >= 2) return "text-blue-400"
  if (pts === 0) return "text-red-400"
  return "text-gray-400"
}

export default function HeadToHeadPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [opponentId, setOpponentId] = useState("")
  const [opponent, setOpponent] = useState<any>(null)
  const [seasons, setSeasons] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedSeason, setExpandedSeason] = useState<string | null>(null)
  const [expandedEtapa, setExpandedEtapa] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/head-to-head").then(r => r.json()).then(d => setUsers(d.users || []))
  }, [])

  async function loadH2H(oppId: string) {
    if (!oppId) return
    setLoading(true)
    const res = await fetch("/api/head-to-head?opponentId=" + oppId)
    const d = await res.json()
    setSeasons(d.seasons || [])
    setOpponent(d.opponent || null)
    setExpandedSeason(d.seasons?.[0]?.id || null)
    setExpandedEtapa(null)
    setLoading(false)
  }

  const myName = session?.user?.name || "Tu"

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white pb-10">
      <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">Comparatie directa</div>
          <div className="text-3xl font-black">Head-to-Head</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Selector opponent */}
        <div className="bg-[#111520] border border-[#1e2640] rounded-xl px-5 py-4 mb-6">
          <div className="text-sm font-bold text-gray-400 mb-3">Alege un jucator</div>
          <select
            value={opponentId}
            onChange={e => { setOpponentId(e.target.value); loadH2H(e.target.value) }}
            className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e8ff47] transition-colors">
            <option value="">— Selecteaza jucator —</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        {loading && (
          <div className="text-center py-10 text-gray-500">Se incarca...</div>
        )}

        {!loading && opponent && seasons.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">😔</div>
            <div className="text-gray-400">Nicio etapa comuna cu {opponent.name}</div>
          </div>
        )}

        {!loading && seasons.map(season => {
          const isSeasonOpen = expandedSeason === season.id
          const totalWins = season.wins
          const totalDraws = season.draws
          const totalLosses = season.losses
          const total = totalWins + totalDraws + totalLosses

          return (
            <div key={season.id} className="mb-4 bg-[#111520] border border-[#1e2640] rounded-xl overflow-hidden">
              
              {/* Header sezon */}
              <button
                onClick={() => setExpandedSeason(isSeasonOpen ? null : season.id)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#1a2035] transition-colors">
                <div className="text-left">
                  <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-0.5">Sezon</div>
                  <div className="font-black text-lg text-white">{season.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{total} etape comune</div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Scor general */}
                  <div className="text-center">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-green-400">{totalWins}</span>
                      <span className="text-gray-600 font-bold">-</span>
                      <span className="text-2xl font-black text-gray-400">{totalDraws}</span>
                      <span className="text-gray-600 font-bold">-</span>
                      <span className="text-2xl font-black text-red-400">{totalLosses}</span>
                    </div>
                    <div className="text-xs text-gray-600">V - E - I</div>
                  </div>
                  <span className="text-gray-500 text-xs">{isSeasonOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* Etape */}
              {isSeasonOpen && (
                <div className="border-t border-[#1e2640]">
                  {season.etape.map((etapa: any) => {
                    const isEtapaOpen = expandedEtapa === etapa.id
                    return (
                      <div key={etapa.id} className="border-b border-[#1e2640] last:border-0">
                        
                        {/* Header etapa */}
                        <button
                          onClick={() => setExpandedEtapa(isEtapaOpen ? null : etapa.id)}
                          className="w-full px-5 py-3 flex items-center justify-between hover:bg-[#1a2035] transition-colors">
                          <div className="text-left flex items-center gap-3">
                            <span className={"text-lg " + (etapa.winner === "me" ? "text-green-400" : etapa.winner === "draw" ? "text-gray-400" : "text-red-400")}>
                              {etapa.winner === "me" ? "✓" : etapa.winner === "draw" ? "=" : "✗"}
                            </span>
                            <div>
                              <div className="font-bold text-sm text-white">{etapa.title}</div>
                              <div className="text-xs text-gray-500">
                                <span className="text-[#e8ff47] font-bold">{etapa.myTotal} pct</span>
                                <span className="text-gray-600"> vs </span>
                                <span className="font-bold">{etapa.oppTotal} pct</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-gray-500 text-xs">{isEtapaOpen ? "▲" : "▼"}</span>
                        </button>

                        {/* Meciuri */}
                        {isEtapaOpen && (
                          <div className="bg-[#0a0d14] border-t border-[#1e2640]">
                            {/* Header coloane */}
                            <div className="grid grid-cols-3 px-5 py-2 border-b border-[#1e2640]">
                              <div className="text-xs font-bold text-[#e8ff47]">{myName}</div>
                              <div className="text-xs text-gray-500 text-center">Meci</div>
                              <div className="text-xs font-bold text-gray-400 text-right">{opponent?.name}</div>
                            </div>
                            {etapa.meciuri.map((meci: any) => (
                              <div key={meci.id} className="px-5 py-3 border-b border-[#1e2640]/50 last:border-0">
                                {/* Scor real */}
                                <div className="text-xs text-gray-500 text-center mb-2">
                                  {COMPETITION_FLAGS[meci.competitionName] || "🏆"} {meci.homeTeam} {meci.finalHomeScore}-{meci.finalAwayScore} {meci.awayTeam}
                                </div>
                                {/* Predictii */}
                                <div className="grid grid-cols-3 items-center">
                                  <div>
                                    {meci.my ? (
                                      <div>
                                        <div className="flex items-center gap-1">
                                          {meci.my.isCaptain && <span className="text-xs">⭐</span>}
                                          <span className="text-sm font-bold text-white">{meci.my.home}-{meci.my.away}</span>
                                        </div>
                                        <div className={"text-xs font-bold " + getPuncteColor(meci.my.points)}>+{meci.my.points} pct</div>
                                      </div>
                                    ) : <span className="text-xs text-gray-600">—</span>}
                                  </div>
                                  <div className="text-center text-xs text-gray-600">vs</div>
                                  <div className="text-right">
                                    {meci.opp ? (
                                      <div>
                                        <div className="flex items-center gap-1 justify-end">
                                          <span className="text-sm font-bold text-white">{meci.opp.home}-{meci.opp.away}</span>
                                          {meci.opp.isCaptain && <span className="text-xs">⭐</span>}
                                        </div>
                                        <div className={"text-xs font-bold text-right " + getPuncteColor(meci.opp.points)}>+{meci.opp.points} pct</div>
                                      </div>
                                    ) : <span className="text-xs text-gray-600">—</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {/* Total etapa */}
                            <div className="grid grid-cols-3 px-5 py-3 bg-[#111520]">
                              <div className={"text-sm font-black " + (etapa.winner === "me" ? "text-green-400" : "text-[#e8ff47]")}>{etapa.myTotal} pct</div>
                              <div className="text-xs text-gray-500 text-center font-bold">TOTAL</div>
                              <div className={"text-sm font-black text-right " + (etapa.winner === "opp" ? "text-green-400" : "text-gray-400")}>{etapa.oppTotal} pct</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}