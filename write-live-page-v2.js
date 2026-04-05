const fs = require('fs')

const liveApi = `import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
export const dynamic = "force-dynamic"
const prisma = new PrismaClient()

function calculeazaPuncte(predHome: number, predAway: number, realHome: number, realAway: number): number {
  if (predHome === realHome && predAway === realAway) return 5
  if ((predHome - predAway) === (realHome - realAway)) return 2
  const predResult = predHome > predAway ? 1 : predHome < predAway ? 2 : 0
  const realResult = realHome > realAway ? 1 : realHome < realAway ? 2 : 0
  if (predResult === realResult) return 1
  return 0
}

export async function GET() {
  const round = await prisma.round.findFirst({
    where: { status: { in: ["LOCKED", "LIVE", "COMPLETED"] } },
    orderBy: { createdAt: "desc" }
  })
  if (!round) return NextResponse.json({ round: null, matches: [], rankings: [], matchPredictions: {} })

  const matches = await prisma.match.findMany({
    where: { roundId: round.id },
    orderBy: { kickoffAt: "asc" }
  })

  const predictions = await prisma.prediction.findMany({
    where: { match: { roundId: round.id } },
    include: { user: { select: { id: true, name: true } } }
  })

  const userPoints: any = {}
  const matchPredictions: any = {}

  for (const pred of predictions) {
    if (!userPoints[pred.userId]) {
      userPoints[pred.userId] = { name: pred.user.name, confirmed: 0, live: 0, total: 0 }
    }
    if (!matchPredictions[pred.matchId]) matchPredictions[pred.matchId] = []
    matchPredictions[pred.matchId].push({
      userName: pred.user.name,
      home: pred.predictedHome,
      away: pred.predictedAway,
      isCaptain: pred.isCaptain
    })

    const match = matches.find(m => m.id === pred.matchId)
    if (!match) continue

    if (match.status === "FINISHED" && match.finalHomeScore !== null && match.finalAwayScore !== null) {
      const base = calculeazaPuncte(pred.predictedHome, pred.predictedAway, match.finalHomeScore, match.finalAwayScore)
      const pts = base * (pred.isCaptain ? 2 : 1)
      userPoints[pred.userId].confirmed += pts
    } else if ((match.status === "LIVE" || match.status === "HALFTIME") && match.liveHomeScore !== null && match.liveAwayScore !== null) {
      const base = calculeazaPuncte(pred.predictedHome, pred.predictedAway, match.liveHomeScore, match.liveAwayScore)
      const pts = base * (pred.isCaptain ? 2 : 1)
      userPoints[pred.userId].live += pts
    }
  }

  const rankings = Object.entries(userPoints)
    .map(([userId, pts]: any) => ({ userId, name: pts.name, confirmed: pts.confirmed, live: pts.live, total: pts.confirmed + pts.live }))
    .sort((a, b) => b.total - a.total || b.confirmed - a.confirmed)
    .map((r, i) => ({ ...r, rank: i + 1 }))

  return NextResponse.json({ round, matches, rankings, matchPredictions })
}`

const livePage = `"use client"
import { useState, useEffect, useCallback } from "react"

const COMPETITION_FLAGS: any = {
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "La Liga": "🇪🇸",
  "Serie A": "🇮🇹",
  "Bundesliga": "🇩🇪",
  "Ligue 1": "🇫🇷",
  "Liga 1 Romania": "🇷🇴",
}

const STATUS_LABELS: any = {
  SCHEDULED: "Programat",
  LIVE: "LIVE",
  HALFTIME: "Pauza",
  FINISHED: "Final",
  CANCELED: "Anulat",
}

export default function LivePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState<"meciuri" | "clasament">("meciuri")

  const fetchData = useCallback(async () => {
    try {
      await fetch("/api/admin/sync-scoruri")
      const res = await fetch("/api/live")
      const d = await res.json()
      setData(d)
      setLastSync(new Date())
    } catch (err) {
      console.error("Eroare fetch live:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-gray-500">Se incarca...</div>
    </div>
  )

  if (!data?.round) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⏳</div>
        <div className="text-xl font-bold text-white mb-2">Etapa nu a inceput inca</div>
        <div className="text-gray-500 mb-6">Pagina live se activeaza dupa inchiderea predictiilor</div>
        <a href="/" className="text-[#e8ff47] hover:underline">← Inapoi acasa</a>
      </div>
    </div>
  )

  const liveMatches = data.matches.filter((m: any) => m.status === "LIVE" || m.status === "HALFTIME")
  const finishedMatches = data.matches.filter((m: any) => m.status === "FINISHED")
  const upcomingMatches = data.matches.filter((m: any) => m.status === "SCHEDULED")

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between sticky top-0 z-50">
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
      </nav>

      <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">{data.round.title}</div>
            <div className="text-sm text-gray-500">
              ✅ {finishedMatches.length} finale · 🔴 {liveMatches.length} live · ⏳ {upcomingMatches.length} urmeaza
            </div>
          </div>
          {lastSync && (
            <div className="text-xs text-gray-500">
              Actualizat: {lastSync.toLocaleTimeString("ro-RO")} · urmator in 5 min
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab("meciuri")} className={"px-5 py-2 rounded-lg font-bold text-sm transition-colors " + (activeTab === "meciuri" ? "bg-[#e8ff47] text-black" : "bg-[#111520] text-gray-400 border border-[#1e2640]")}>
            ⚽ Meciuri
          </button>
          <button onClick={() => setActiveTab("clasament")} className={"px-5 py-2 rounded-lg font-bold text-sm transition-colors " + (activeTab === "clasament" ? "bg-[#e8ff47] text-black" : "bg-[#111520] text-gray-400 border border-[#1e2640]")}>
            🏆 Clasament Live
          </button>
        </div>

        {activeTab === "meciuri" && (
          <div className="space-y-3">
            {data.matches.map((meci: any) => (
              <div key={meci.id} className={"rounded-xl border px-4 py-3 " + (meci.status === "LIVE" || meci.status === "HALFTIME" ? "bg-red-500/05 border-red-500/20" : meci.status === "FINISHED" ? "bg-[#111520] border-[#1e2640] opacity-80" : "bg-[#111520] border-[#1e2640]")}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{COMPETITION_FLAGS[meci.competitionName] || "🏆"} {meci.competitionName}</span>
                  <div className="flex items-center gap-2">
                    {(meci.status === "LIVE" || meci.status === "HALFTIME") && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                    <span className={"text-xs font-bold " + (meci.status === "LIVE" ? "text-red-400" : meci.status === "HALFTIME" ? "text-yellow-400" : meci.status === "FINISHED" ? "text-gray-500" : "text-blue-400")}>
                      {STATUS_LABELS[meci.status] || meci.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 text-right font-bold text-sm">{meci.homeTeam}</div>
                  <div className="text-center min-w-20">
                    {meci.status === "SCHEDULED" ? (
                      <span className="text-gray-500 text-sm">{new Date(meci.kickoffAt).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</span>
                    ) : meci.status === "FINISHED" ? (
                      <span className="text-xl font-black">{meci.finalHomeScore} - {meci.finalAwayScore}</span>
                    ) : (
                      <span className="text-xl font-black text-red-400">{meci.liveHomeScore ?? 0} - {meci.liveAwayScore ?? 0}</span>
                    )}
                  </div>
                  <div className="flex-1 font-bold text-sm">{meci.awayTeam}</div>
                </div>
                {data.matchPredictions[meci.id] && data.matchPredictions[meci.id].length > 0 && (
                  <div className="border-t border-[#1e2640] pt-2 mt-2">
                    <div className="flex flex-wrap gap-2">
                      {data.matchPredictions[meci.id].map((pred: any, i: number) => (
                        <div key={i} className="flex items-center gap-1 bg-[#0a0d14] rounded-lg px-2 py-1">
                          {pred.isCaptain && <span className="text-xs">⭐</span>}
                          <span className="text-xs text-gray-400">{pred.userName}:</span>
                          <span className="text-xs font-bold text-[#e8ff47]">{pred.home}-{pred.away}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "clasament" && (
          <div className="space-y-2">
            {data.rankings.length === 0 ? (
              <div className="text-center py-20 text-gray-500">Nicio predictie inca.</div>
            ) : (
              data.rankings.map((r: any, i: number) => (
                <div key={r.userId} className={"rounded-xl border px-4 py-3 flex items-center gap-3 " + (i === 0 ? "bg-[#fbbf24]/05 border-[#fbbf24]/20" : "bg-[#111520] border-[#1e2640]")}>
                  <div className={"text-2xl font-black w-8 text-center " + (i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.rank}
                  </div>
                  <div className="flex-1 font-bold">{r.name}</div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#e8ff47]">{r.total}</div>
                    <div className="text-xs text-gray-500">{r.confirmed} conf + {r.live} live</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}`

fs.writeFileSync('app/api/live/route.ts', liveApi)
fs.writeFileSync('app/live/page.tsx', livePage)
console.log('Gata!')