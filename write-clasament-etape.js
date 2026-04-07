const fs = require('fs')

// Update API clasament sa numere etapele castigate
const clasamentApi = `import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const season = await prisma.season.findFirst({ where: { isActive: true } })
    if (!season) return NextResponse.json({ rankings: [], season: null })

    const rounds = await prisma.round.findMany({
      where: { seasonId: season.id, status: "COMPLETED" }
    })

    const roundIds = rounds.map(r => r.id)
    if (roundIds.length === 0) return NextResponse.json({ rankings: [], season })

    const roundRankings = await prisma.roundRanking.findMany({
      where: { roundId: { in: roundIds } },
      include: { user: { select: { id: true, name: true } } }
    })

    const userStats: any = {}
    for (const rr of roundRankings) {
      if (!userStats[rr.userId]) {
        userStats[rr.userId] = { name: rr.user.name, total: 0, rounds: 0, exact: 0, diff: 0, result: 0, captain: 0, wins: 0 }
      }
      userStats[rr.userId].total += rr.finalPoints || rr.confirmedPoints
      userStats[rr.userId].rounds += 1
      userStats[rr.userId].exact += rr.exactHits
      userStats[rr.userId].diff += rr.goalDiffHits
      userStats[rr.userId].result += rr.resultHits
      userStats[rr.userId].captain += rr.captainPoints
      if (rr.rank === 1) userStats[rr.userId].wins += 1
    }

    const rankings = Object.entries(userStats)
      .map(([userId, s]: any) => ({
        userId, name: s.name, total: s.total, rounds: s.rounds, wins: s.wins,
        average: s.rounds > 0 ? Math.round((s.total / s.rounds) * 10) / 10 : 0,
        exact: s.exact, diff: s.diff, result: s.result, captain: s.captain
      }))
      .sort((a, b) => b.wins - a.wins || b.total - a.total || b.exact - a.exact || b.diff - a.diff || b.result - a.result)
      .map((r, i) => ({ ...r, rank: i + 1 }))

    return NextResponse.json({ rankings, season })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}`

fs.writeFileSync('app/api/clasament/route.ts', clasamentApi)

// Update pagina clasament cu expand/collapse
const clasamentPage = `"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const BADGES: any = {
  sniper: { icon: "🎯", name: "Sniper", desc: "3+ scoruri exacte intr-o etapa" },
  dominator: { icon: "👑", name: "Dominator", desc: "Locul 1 intr-o etapa" },
  capitan_aur: { icon: "⭐", name: "Capitan de Aur", desc: "Capitanul corect intr-o etapa" },
  all_in: { icon: "🎲", name: "All In", desc: "Toate meciurile prezise corect intr-o etapa" },
  on_fire: { icon: "🔥", name: "On Fire", desc: "Locul 1 in 3 etape consecutive" },
  constant: { icon: "🏃", name: "Constant", desc: "A jucat toate etapele sezonului" },
  perfect: { icon: "💎", name: "Perfect", desc: "Capitan corect 3 etape la rand" },
  campion: { icon: "🏆", name: "Campion", desc: "Locul 1 in clasamentul general" },
  lingura: { icon: "🥄", name: "Lingura de Lemn", desc: "Ultimul loc intr-o etapa" },
  ghinionist: { icon: "😅", name: "Ghinionist", desc: "0 puncte intr-o etapa" },
  etern_secund: { icon: "😤", name: "Etern Secund", desc: "Locul 2 in 3 etape consecutive" },
  aproape: { icon: "🥈", name: "Aproape", desc: "Locul 2 in clasamentul general" },
  podium: { icon: "🥉", name: "Podium", desc: "Locul 3 in clasamentul general" },
  veteranul: { icon: "🦕", name: "Veteranul", desc: "10+ etape jucate" },
  fidel: { icon: "📅", name: "Fidel", desc: "5 etape consecutive jucate" },
}

function BadgeTooltip({ badgeKey }: { badgeKey: string }) {
  const [show, setShow] = useState(false)
  const badge = BADGES[badgeKey]
  if (!badge) return null
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(!show)}>
      <span className="cursor-pointer text-lg">{badge.icon}</span>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-[#1a2035] border border-[#1e2640] rounded-lg px-3 py-2 text-xs text-white shadow-xl" style={{minWidth: "160px"}}>
          <div className="font-bold">{badge.icon} {badge.name}</div>
          <div className="text-gray-400 mt-0.5">{badge.desc}</div>
        </div>
      )}
    </div>
  )
}

export default function ClasamentPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [badgesData, setBadgesData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/clasament").then(r => r.json()),
      fetch("/api/badges/all").then(r => r.json())
    ]).then(([clasament, badges]) => {
      setData(clasament)
      setBadgesData(badges.userBadges || {})
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-gray-500">Se incarca...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">
            {data?.season?.name || "Sezon activ"}
          </div>
          <div className="text-3xl font-black">Clasament General</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {!data?.rankings || data.rankings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏆</div>
            <div className="text-lg font-bold text-white mb-2">Niciun clasament inca</div>
            <div className="text-sm text-gray-500 mb-6">Clasamentul apare dupa finalizarea primei etape</div>
            <a href="/" className="text-[#e8ff47] hover:underline text-sm">← Inapoi acasa</a>
          </div>
        ) : (
          <div className="space-y-2">
            {data.rankings.map((r: any, i: number) => {
              const isMe = session?.user?.name === r.name
              const myBadges = badgesData[r.userId] || []
              const isExpanded = expanded === r.userId

              return (
                <div key={r.userId} className={"rounded-xl border transition-all " + (isMe ? "bg-[#e8ff47]/05 border-[#e8ff47]/30" : i === 0 ? "bg-[#fbbf24]/05 border-[#fbbf24]/20" : "bg-[#111520] border-[#1e2640]")}>
                  
                  {/* Row principal - click expand */}
                  <div className="px-4 py-4 flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : r.userId)}>
                    <div className={"text-2xl font-black w-10 text-center flex-shrink-0 " + (i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={"font-bold text-base " + (isMe ? "text-[#e8ff47]" : "text-white")}>
                        {r.name} {isMe && <span className="text-xs font-normal text-gray-500">(tu)</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-black text-[#e8ff47]">{r.wins}</div>
                        <div className="text-xs text-gray-500">etape castigate</div>
                      </div>
                      <span className="text-gray-500 text-xs">{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Expand - toate detaliile */}
                  {isExpanded && (
                    <div className="border-t border-[#1e2640] px-4 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-[#0a0d14] rounded-lg p-3 text-center">
                          <div className="text-xl font-black text-[#e8ff47]">{r.total}</div>
                          <div className="text-xs text-gray-500">Total puncte</div>
                        </div>
                        <div className="bg-[#0a0d14] rounded-lg p-3 text-center">
                          <div className="text-xl font-black text-white">{r.average}</div>
                          <div className="text-xs text-gray-500">Medie/etapa</div>
                        </div>
                        <div className="bg-[#0a0d14] rounded-lg p-3 text-center">
                          <div className="text-xl font-black text-green-400">{r.exact}</div>
                          <div className="text-xs text-gray-500">Scoruri exacte</div>
                        </div>
                        <div className="bg-[#0a0d14] rounded-lg p-3 text-center">
                          <div className="text-xl font-black text-[#fbbf24]">{r.captain}</div>
                          <div className="text-xs text-gray-500">Pct capitan</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-[#0a0d14] rounded-lg p-3 text-center">
                          <div className="text-xl font-black text-yellow-400">{r.diff}</div>
                          <div className="text-xs text-gray-500">Diferente</div>
                        </div>
                        <div className="bg-[#0a0d14] rounded-lg p-3 text-center">
                          <div className="text-xl font-black text-blue-400">{r.result}</div>
                          <div className="text-xs text-gray-500">Rezultate</div>
                        </div>
                        <div className="bg-[#0a0d14] rounded-lg p-3 text-center">
                          <div className="text-xl font-black text-white">{r.rounds}</div>
                          <div className="text-xs text-gray-500">Etape jucate</div>
                        </div>
                      </div>
                      {myBadges.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 mb-2">Badge-uri</div>
                          <div className="flex gap-2 flex-wrap">
                            {myBadges.map((b: string) => <BadgeTooltip key={b} badgeKey={b} />)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}`

fs.writeFileSync('app/api/clasament/route.ts', clasamentApi)
fs.writeFileSync('app/clasament/page.tsx', clasamentPage)
console.log('Gata!')