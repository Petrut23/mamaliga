const fs = require('fs')

const content = `"use client"
import { useState, useEffect } from "react"

const COMPETITION_FLAGS: any = {
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "La Liga": "🇪🇸",
  "Serie A": "🇮🇹",
  "Bundesliga": "🇩🇪",
  "Ligue 1": "🇫🇷",
  "Liga 1 Romania": "🇷🇴",
  "Champions League": "🏆",
}

function getPointsColor(points: number | null) {
  if (points === null) return "text-gray-500"
  if (points >= 8) return "text-green-400"
  if (points >= 4) return "text-yellow-400"
  if (points >= 2) return "text-blue-400"
  if (points === 0) return "text-red-400"
  return "text-gray-400"
}

function getResultLabel(base: number | null) {
  if (base === null) return ""
  if (base === 5) return "✅ Scor exact"
  if (base === 2) return "🟡 Diferenta corecta"
  if (base === 1) return "🔵 Rezultat corect"
  return "❌ Gresit"
}

export default function RezultatePage() {
  const [rounds, setRounds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openRound, setOpenRound] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/rezultate").then(r => r.json()).then(d => {
      setRounds(d.rounds || [])
      if (d.rounds?.length > 0) setOpenRound(d.rounds[0].id)
      setLoading(false)
    })
  }, [])

  // Calculeaza statistici globale
  const stats = rounds.reduce((acc, round) => {
    round.matches.forEach((m: any) => {
      if (m.prediction && m.status === "FINISHED") {
        acc.total++
        if (m.prediction.basePoints === 5) acc.exact++
        else if (m.prediction.basePoints === 2) acc.diff++
        else if (m.prediction.basePoints === 1) acc.result++
        else acc.wrong++
        acc.points += m.prediction.points || 0
      }
    })
    return acc
  }, { total: 0, exact: 0, diff: 0, result: 0, wrong: 0, points: 0 })

  const bestRound = rounds.reduce((best: any, r) => 
    r.totalPoints > (best?.totalPoints || 0) ? r : best, null)

  const exactPct = stats.total > 0 ? Math.round(stats.exact / stats.total * 100) : 0

  if (loading) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-gray-500">Se incarca...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white pb-10">
      <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">Istoricul tau</div>
          <div className="text-3xl font-black">Rezultatele Mele</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {rounds.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <div className="text-lg font-bold text-white mb-2">Niciun rezultat inca</div>
            <div className="text-sm text-gray-500 mb-6">Rezultatele apar dupa finalizarea primei etape</div>
            <a href="/" className="text-[#e8ff47] hover:underline text-sm">← Inapoi acasa</a>
          </div>
        ) : (
          <>
            {/* Statistici globale */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-[#e8ff47]">{stats.points}</div>
                <div className="text-xs text-gray-500 mt-1">Total puncte</div>
              </div>
              <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-green-400">{stats.exact}</div>
                <div className="text-xs text-gray-500 mt-1">Scoruri exacte</div>
              </div>
              <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-blue-400">{exactPct}%</div>
                <div className="text-xs text-gray-500 mt-1">Rata exacte</div>
              </div>
              <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-[#fbbf24]">{bestRound?.totalPoints || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Cea mai buna etapa</div>
              </div>
            </div>

            {/* Grafic distributie */}
            {stats.total > 0 && (
              <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 mb-6">
                <div className="text-sm font-bold text-gray-400 mb-4">Distributia predictiilor ({stats.total} meciuri)</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-green-400">✅ Scoruri exacte</span>
                      <span className="text-green-400">{stats.exact} ({Math.round(stats.exact/stats.total*100)}%)</span>
                    </div>
                    <div className="bg-[#0a0d14] rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full transition-all" style={{width: Math.round(stats.exact/stats.total*100) + "%"}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-yellow-400">🟡 Diferente corecte</span>
                      <span className="text-yellow-400">{stats.diff} ({Math.round(stats.diff/stats.total*100)}%)</span>
                    </div>
                    <div className="bg-[#0a0d14] rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{width: Math.round(stats.diff/stats.total*100) + "%"}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-blue-400">🔵 Rezultate corecte</span>
                      <span className="text-blue-400">{stats.result} ({Math.round(stats.result/stats.total*100)}%)</span>
                    </div>
                    <div className="bg-[#0a0d14] rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full transition-all" style={{width: Math.round(stats.result/stats.total*100) + "%"}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-red-400">❌ Gresite</span>
                      <span className="text-red-400">{stats.wrong} ({Math.round(stats.wrong/stats.total*100)}%)</span>
                    </div>
                    <div className="bg-[#0a0d14] rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full transition-all" style={{width: Math.round(stats.wrong/stats.total*100) + "%"}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grafic puncte per etapa */}
            {rounds.length > 1 && (
              <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 mb-6">
                <div className="text-sm font-bold text-gray-400 mb-4">Puncte per etapa</div>
                <div className="flex items-end gap-2 h-24">
                  {[...rounds].reverse().map((r: any) => {
                    const maxPts = Math.max(...rounds.map((x: any) => x.totalPoints), 1)
                    const height = Math.max((r.totalPoints / maxPts) * 100, 5)
                    return (
                      <div key={r.id} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-xs text-[#e8ff47] font-bold">{r.totalPoints}</div>
                        <div className="w-full bg-[#e8ff47]/20 rounded-t-lg transition-all" style={{height: height + "%", minHeight: "4px", backgroundColor: r.id === bestRound?.id ? "#e8ff47" : "rgba(232,255,71,0.3)"}}></div>
                        <div className="text-xs text-gray-600 text-center truncate w-full">{r.title.split(" ")[1] || r.title}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Lista etape */}
            <div className="space-y-4">
              {rounds.map(round => (
                <div key={round.id} className="bg-[#111520] border border-[#1e2640] rounded-xl overflow-hidden">
                  <button onClick={() => setOpenRound(openRound === round.id ? null : round.id)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#1a2035] transition-colors">
                    <div className="text-left">
                      <div className="font-bold text-white">{round.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{round.matches.length} meciuri</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-black text-[#e8ff47]">{round.totalPoints}</div>
                        <div className="text-xs text-gray-500">puncte</div>
                      </div>
                      <span className="text-gray-500">{openRound === round.id ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {openRound === round.id && (
                    <div className="border-t border-[#1e2640]">
                      {round.matches.map((meci: any) => (
                        <div key={meci.id} className="px-5 py-3 border-b border-[#1e2640]/50 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">{COMPETITION_FLAGS[meci.competitionName] || "🏆"} {meci.competitionName}</span>
                            {meci.status === "FINISHED" && meci.prediction && (
                              <span className={"text-xs font-bold " + getPointsColor(meci.prediction.points)}>
                                {meci.prediction.points !== null ? "+" + meci.prediction.points + " pct" : ""}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="flex-1 text-right text-sm font-semibold">{meci.homeTeam}</span>
                            <div className="text-center min-w-24">
                              {meci.status === "FINISHED" ? (
                                <span className="text-sm font-black">{meci.finalHomeScore} - {meci.finalAwayScore}</span>
                              ) : (
                                <span className="text-xs text-gray-500">{new Date(meci.kickoffAt).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</span>
                              )}
                            </div>
                            <span className="flex-1 text-sm font-semibold">{meci.awayTeam}</span>
                          </div>
                          {meci.prediction && (
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {meci.prediction.isCaptain && <span className="text-xs">⭐</span>}
                                <span className="text-xs text-gray-400">Predictia ta:</span>
                                <span className="text-xs font-bold text-[#e8ff47]">{meci.prediction.predictedHome} - {meci.prediction.predictedAway}</span>
                              </div>
                              {meci.status === "FINISHED" && (
                                <span className="text-xs">{getResultLabel(meci.prediction.basePoints)}</span>
                              )}
                            </div>
                          )}
                          {!meci.prediction && (
                            <div className="mt-1 text-xs text-gray-600 italic">Fara predictie</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}`

fs.writeFileSync('app/rezultate/page.tsx', content)
console.log('Gata!')