"use client"
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
            <div className="text-sm text-gray-500">Rezultatele apar dupa finalizarea primei etape</div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}