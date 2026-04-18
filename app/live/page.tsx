"use client"
import { useState, useEffect, useCallback } from "react"

const COMPETITION_FLAGS: any = {
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "La Liga": "🇪🇸",
  "Serie A": "🇮🇹",
  "Bundesliga": "🇩🇪",
  "Ligue 1": "🇫🇷",
  "Liga 1 Romania": "🇷🇴",
  "Champions League": "🏆",
}

const STATUS_LABELS: any = {
  SCHEDULED: "Programat",
  LIVE: "🔴 LIVE",
  HALFTIME: "⏸ Pauza",
  FINISHED: "✅ Final",
  CANCELED: "Anulat",
}

function calcPuncte(predHome: number, predAway: number, realHome: number, realAway: number): number {
  if (predHome === realHome && predAway === realAway) return 5
  if ((predHome - predAway) === (realHome - realAway)) return 2
  const predRes = predHome > predAway ? 1 : predHome < predAway ? 2 : 0
  const realRes = realHome > realAway ? 1 : realHome < realAway ? 2 : 0
  if (predRes === realRes) return 1
  return 0
}

function getPuncteColor(pct: number) {
  if (pct >= 8) return "text-green-400"
  if (pct >= 4) return "text-yellow-400"
  if (pct >= 2) return "text-blue-400"
  if (pct === 0) return "text-red-400"
  return "text-gray-400"
}

function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    function update() {
      const diff = new Date(deadline).getTime() - new Date().getTime()
      if (diff <= 0) { setTimeLeft("Expirat"); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(h + "h " + m + "m " + s + "s")
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [deadline])

  return <span className="font-black text-[#e8ff47]">{timeLeft}</span>
}

function MatchCard({ meci, matchPredictions, matchStats, expandedMatch, setExpandedMatch }: any) {
  const isExpanded = expandedMatch === meci.id
  const allPreds = matchPredictions?.[meci.id] || []
  const myPred = allPreds.find((p: any) => p.isMe)
  const stats = matchStats?.[meci.id]

  const currentHome = meci.status === "FINISHED" ? meci.finalHomeScore : meci.liveHomeScore
  const currentAway = meci.status === "FINISHED" ? meci.finalAwayScore : meci.liveAwayScore

  const getMyPuncte = () => {
    if (currentHome === null || currentAway === null || !myPred) return null
    const base = calcPuncte(myPred.home, myPred.away, currentHome, currentAway)
    return base * (myPred.isCaptain ? 2 : 1)
  }

  const getPredPuncte = (pred: any) => {
    if (currentHome === null || currentAway === null) return null
    const base = calcPuncte(pred.home, pred.away, currentHome, currentAway)
    return base * (pred.isCaptain ? 2 : 1)
  }

  const myPuncte = getMyPuncte()

  return (
    <div className={"rounded-xl border transition-all " + (meci.status === "LIVE" || meci.status === "HALFTIME" ? "bg-red-500/05 border-red-500/20" : meci.status === "FINISHED" ? "bg-[#111520] border-[#1e2640] opacity-90" : "bg-[#111520] border-[#1e2640]")}>
      <div className="px-4 py-3 cursor-pointer" onClick={() => setExpandedMatch(isExpanded ? null : meci.id)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{new Date(meci.kickoffAt).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</span>
          <div className="flex items-center gap-2">
            <span className={"text-xs font-bold " + (meci.status === "LIVE" ? "text-red-400" : meci.status === "HALFTIME" ? "text-yellow-400" : meci.status === "FINISHED" ? "text-gray-500" : "text-blue-400")}>
              {STATUS_LABELS[meci.status] || meci.status}
            </span>
            <span className="text-gray-600 text-xs">{isExpanded ? "▲" : "▼"}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 text-right font-bold text-sm">{meci.homeTeam}</div>
          <div className="text-center min-w-20">
            {meci.status === "SCHEDULED" ? (
              <span className="text-gray-500 text-sm font-bold">vs</span>
            ) : meci.status === "FINISHED" ? (
              <span className="text-xl font-black">{meci.finalHomeScore} - {meci.finalAwayScore}</span>
            ) : (
              <span className="text-xl font-black text-red-400">{meci.liveHomeScore ?? 0} - {meci.liveAwayScore ?? 0}</span>
            )}
          </div>
          <div className="flex-1 font-bold text-sm">{meci.awayTeam}</div>
        </div>
        {myPred && (
          <div className="flex items-center mt-2 pt-2 border-t border-[#1e2640]/50">
            <span className="w-5 flex-shrink-0 text-sm">{myPred.isCaptain ? "⭐" : ""}</span>
            <span className="text-xs text-gray-400 w-20 flex-shrink-0 truncate">Tu:</span>
            <span className="text-sm font-black text-[#e8ff47] w-12 flex-shrink-0">{myPred.home} - {myPred.away}</span>
            {myPuncte !== null && meci.status !== "SCHEDULED" && (
              <span className={"text-sm font-black ml-2 " + getPuncteColor(myPuncte)}>+{myPuncte}</span>
            )}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-[#1e2640] px-4 py-3">
          <div className="mb-3">
            {allPreds.filter((p: any) => !p.isMe).length === 0 ? (
              <div className="text-xs text-gray-600 italic py-2">Nicio alta predictie</div>
            ) : (
              allPreds
                .filter((p: any) => !p.isMe)
                .map((pred: any) => ({ ...pred, calculatedPts: getPredPuncte(pred) ?? -1 }))
                .sort((a: any, b: any) => b.calculatedPts !== a.calculatedPts ? b.calculatedPts - a.calculatedPts : a.userName.localeCompare(b.userName))
                .map((pred: any, i: number) => {
                  const puncPred = getPredPuncte(pred)
                  return (
                    <div key={i} className="flex items-center py-1.5 px-1 border-b border-[#1e2640]/30 last:border-0">
                      <span className="w-5 flex-shrink-0 text-xs">{pred.isCaptain ? "⭐" : ""}</span>
                      <span className="text-xs text-gray-400 w-20 flex-shrink-0 truncate">{pred.userName}:</span>
                      <span className="text-sm font-bold text-white w-12 flex-shrink-0">{pred.home} - {pred.away}</span>
                      {puncPred !== null && meci.status !== "SCHEDULED" && (
                        <span className={"text-sm font-bold ml-2 " + getPuncteColor(puncPred)}>+{puncPred}</span>
                      )}
                    </div>
                  )
                })
            )}
          </div>
          {stats && (
            <div className="flex gap-2 pt-2 border-t border-[#1e2640]/50">
              <div className="flex-1 bg-blue-500/10 border border-blue-500/20 rounded-lg px-2 py-1.5 text-center">
                <div className="text-xs font-black text-blue-400">{stats.homeWinPct}%</div>
                <div className="text-xs text-gray-500">1</div>
              </div>
              <div className="flex-1 bg-gray-500/10 border border-gray-500/20 rounded-lg px-2 py-1.5 text-center">
                <div className="text-xs font-black text-gray-400">{stats.drawPct}%</div>
                <div className="text-xs text-gray-500">X</div>
              </div>
              <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1.5 text-center">
                <div className="text-xs font-black text-red-400">{stats.awayWinPct}%</div>
                <div className="text-xs text-gray-500">2</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GroupedMatches({ matches, matchPredictions, matchStats, expandedMatch, setExpandedMatch }: any) {
  const grouped = matches.reduce((acc: any, m: any) => {
    if (!acc[m.competitionName]) acc[m.competitionName] = []
    acc[m.competitionName].push(m)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([comp, compMatches]: any) => (
        <div key={comp}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="text-lg">{COMPETITION_FLAGS[comp] || "🏆"}</span>
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{comp}</span>
          </div>
          <div className="space-y-3">
            {compMatches.map((meci: any) => (
              <MatchCard key={meci.id} meci={meci} matchPredictions={matchPredictions} matchStats={matchStats} expandedMatch={expandedMatch} setExpandedMatch={setExpandedMatch} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LivePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState<"meciuri" | "clasament">("meciuri")
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/live")
      const d = await res.json()
      setData(d)
      setLastSync(new Date())
      fetch("/api/admin/sync-scoruri").catch(() => {})
    } catch (err) {
      console.error("Eroare fetch live:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-gray-500">Se incarca...</div>
    </div>
  )

  if (data?.scenario === "active") {
    const liveMatches = data.matches.filter((m: any) => m.status === "LIVE" || m.status === "HALFTIME")
    const finishedMatches = data.matches.filter((m: any) => m.status === "FINISHED")
    const upcomingMatches = data.matches.filter((m: any) => m.status === "SCHEDULED")

    if (data?.round?.status === "COMPLETED" && data.matches.every((m: any) => m.status === "FINISHED")) return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-7xl mb-6">🏆</div>
          <div className="text-3xl font-black text-white mb-3">Etapa s-a incheiat!</div>
          <div className="text-gray-400 mb-2">{data.round.title}</div>
          <div className="text-gray-500 text-sm mb-8">Toate meciurile au fost jucate!</div>
          <a href="/clasament" className="bg-[#e8ff47] text-black font-black px-8 py-3 rounded-xl hover:bg-[#f5ff6e] transition-colors inline-block">
            Vezi Clasamentul Final 🏆
          </a>
        </div>
      </div>
    )

    return (
      <div className="min-h-screen bg-[#0a0d14] text-white">
        <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">{data.round.title}</div>
              <div className="text-sm text-gray-500">
                ✅ {finishedMatches.length} finale · 🔴 {liveMatches.length} live · ⏳ {upcomingMatches.length} urmeaza
              </div>
            </div>
            {lastSync && <div className="text-xs text-gray-500">Actualizat: {lastSync.toLocaleTimeString("ro-RO")} · urmator in 10 min</div>}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex gap-2 mb-6">
            <button onClick={() => setActiveTab("meciuri")} className={"px-5 py-2 rounded-lg font-bold text-sm transition-colors " + (activeTab === "meciuri" ? "bg-[#e8ff47] text-black" : "bg-[#111520] text-gray-400 border border-[#1e2640]")}>⚽ Meciuri</button>
            <button onClick={() => setActiveTab("clasament")} className={"px-5 py-2 rounded-lg font-bold text-sm transition-colors " + (activeTab === "clasament" ? "bg-[#e8ff47] text-black" : "bg-[#111520] text-gray-400 border border-[#1e2640]")}>🏆 Clasament</button>
          </div>

          {activeTab === "meciuri" && (
            <GroupedMatches matches={data.matches} matchPredictions={data.matchPredictions} matchStats={data.matchStats} expandedMatch={expandedMatch} setExpandedMatch={setExpandedMatch} />
          )}

          {activeTab === "clasament" && (
            <div className="space-y-2">
              {data.rankings.length === 0 ? (
                <div className="text-center py-20 text-gray-500">Nicio predictie inca.</div>
              ) : data.rankings.map((r: any, i: number) => {
                const hasLive = data.matches.some((m: any) => m.status === "LIVE" || m.status === "HALFTIME" || m.status === "SCHEDULED")
                return (
                  <div key={r.userId} className={"rounded-xl border px-4 py-3 flex items-center gap-3 " + (i === 0 ? "bg-[#fbbf24]/05 border-[#fbbf24]/20" : "bg-[#111520] border-[#1e2640]")}>
                    <div className={"text-2xl font-black w-8 text-center " + (i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.rank}
                    </div>
                    <div className="flex-1 font-bold">{r.name}</div>
                    <div className="flex items-center gap-2">
                      {hasLive && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>}
                      <div className="text-2xl font-black text-[#e8ff47]">{r.total}</div>
                      <div className="text-xs text-gray-500">pct</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      {data?.nextRound && (
        <div className="bg-[#111520] border-b border-[#e8ff47]/20 px-6 py-5">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Urmatoarea etapa</div>
            <div className="text-xl font-black text-white mb-1">{data.nextRound.title}</div>
            <div className="text-sm text-gray-400 mb-3">Mai ai timp sa iti pui predictiile</div>
            <div className="text-3xl font-black mb-4">
              <Countdown deadline={data.nextRound.deadlineAt} />
            </div>
            <a href="/predictii" className="bg-[#e8ff47] text-black font-black px-6 py-2.5 rounded-xl hover:bg-[#f5ff6e] transition-colors inline-block text-sm">
              📋 Pune-ti predictiile acum
            </a>
          </div>
        </div>
      )}

      {data?.previousRound && (
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <div className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-0.5">Etapa finalizata</div>
              <div className="text-xl font-black text-white">{data.previousRound.title}</div>
            </div>
            <span className="ml-auto text-xs bg-gray-500/10 border border-gray-500/20 text-gray-400 px-3 py-1 rounded-full font-bold">✅ Final</span>
          </div>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setActiveTab("meciuri")} className={"px-4 py-2 rounded-lg font-bold text-sm transition-colors " + (activeTab === "meciuri" ? "bg-[#e8ff47] text-black" : "bg-[#111520] text-gray-400 border border-[#1e2640]")}>⚽ Meciuri</button>
            <button onClick={() => setActiveTab("clasament")} className={"px-4 py-2 rounded-lg font-bold text-sm transition-colors " + (activeTab === "clasament" ? "bg-[#e8ff47] text-black" : "bg-[#111520] text-gray-400 border border-[#1e2640]")}>🏆 Clasament</button>
          </div>

          {activeTab === "meciuri" && (
            <GroupedMatches matches={data.prevMatches} matchPredictions={data.prevMatchPredictions} matchStats={{}} expandedMatch={expandedMatch} setExpandedMatch={setExpandedMatch} />
          )}

          {activeTab === "clasament" && (
            <div className="space-y-2">
              {data.prevRankings.map((r: any, i: number) => (
                <div key={r.userId} className={"rounded-xl border px-4 py-3 flex items-center gap-3 " + (i === 0 ? "bg-[#fbbf24]/05 border-[#fbbf24]/20" : "bg-[#111520] border-[#1e2640]")}>
                  <div className={"text-2xl font-black w-8 text-center " + (i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.rank}
                  </div>
                  <div className="flex-1 font-bold">{r.name}</div>
                  <div className="text-2xl font-black text-[#e8ff47]">{r.total}</div>
                  <div className="text-xs text-gray-500">pct</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!data?.previousRound && !data?.nextRound && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">⚽</div>
            <div className="text-xl font-bold text-white mb-2">Nicio etapa inca</div>
            <div className="text-gray-500">Adminul nu a configurat nicio etapa.</div>
          </div>
        </div>
      )}
    </div>
  )
}
