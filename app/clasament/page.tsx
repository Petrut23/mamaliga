"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function ClasamentPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/clasament").then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-gray-500">Se incarca...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <a href="/" className="text-2xl font-black tracking-widest">Mama<span className="text-[#e8ff47]">LIGA</span></a>
        <a href="/" className="text-xs text-gray-500 hover:text-white">← Acasa</a>
      </nav>

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
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">🏆</div>
            <div className="text-lg font-bold text-white mb-2">Niciun clasament inca</div>
            <div className="text-sm">Clasamentul apare dupa finalizarea primei etape</div>
          </div>
        ) : (
          <div className="space-y-2">
            {data.rankings.map((r: any, i: number) => {
              const isMe = session?.user?.name === r.name
              return (
                <div key={r.userId} className={"rounded-xl border px-4 py-4 transition-all " + (isMe ? "bg-[#e8ff47]/05 border-[#e8ff47]/30" : i === 0 ? "bg-[#fbbf24]/05 border-[#fbbf24]/20" : "bg-[#111520] border-[#1e2640]")}>
                  <div className="flex items-center gap-3">
                    <div className={"text-2xl font-black w-10 text-center flex-shrink-0 " + (i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={"font-bold text-base " + (isMe ? "text-[#e8ff47]" : "text-white")}>
                        {r.name} {isMe && <span className="text-xs font-normal text-gray-500">(tu)</span>}
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
}