const fs = require('fs')

const content = `"use client"
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
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-[#1a2035] border border-[#1e2640] rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap shadow-xl">
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
              return (
                <div key={r.userId} className={"rounded-xl border px-4 py-4 transition-all " + (isMe ? "bg-[#e8ff47]/05 border-[#e8ff47]/30" : i === 0 ? "bg-[#fbbf24]/05 border-[#fbbf24]/20" : "bg-[#111520] border-[#1e2640]")}>
                  <div className="flex items-center gap-3">
                    <div className={"text-2xl font-black w-10 text-center flex-shrink-0 " + (i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={"font-bold text-base " + (isMe ? "text-[#e8ff47]" : "text-white")}>
                          {r.name} {isMe && <span className="text-xs font-normal text-gray-500">(tu)</span>}
                        </span>
                        <div className="flex gap-1 flex-wrap">
                          {myBadges.map((b: string) => <BadgeTooltip key={b} badgeKey={b} />)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {r.rounds} etape · medie {r.average} pct · ⚽ {r.exact} exacte
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-3xl font-black text-[#e8ff47]">{r.total}</div>
                      <div className="text-xs text-gray-500">puncte</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3 pt-3 border-t border-[#1e2640]">
                    <div className="flex-1 text-center">
                      <div className="text-sm font-bold text-green-400">{r.exact}</div>
                      <div className="text-xs text-gray-600">Exacte</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-sm font-bold text-yellow-400">{r.diff}</div>
                      <div className="text-xs text-gray-600">Diferente</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-sm font-bold text-blue-400">{r.result}</div>
                      <div className="text-xs text-gray-600">Rezultate</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-sm font-bold text-[#fbbf24]">{r.captain}</div>
                      <div className="text-xs text-gray-600">Capitan</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}`

fs.writeFileSync('app/clasament/page.tsx', content)
console.log('Gata!')