"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const WC_SEASON_ID = "ca080bd2-7691-4396-a123-5264ffaeceef"

export default function WCClasamentPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/clasament?seasonId=" + WC_SEASON_ID)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
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
          <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">🌍 World Cup 2026</div>
          <div className="text-3xl font-black">Clasament General</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {!data?.rankings || data.rankings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌍</div>
            <div className="text-lg font-bold text-white mb-2">Niciun clasament inca</div>
            <div className="text-sm text-gray-500 mb-6">Clasamentul apare dupa finalizarea primei etape WC</div>
            <a href="/world-cup" className="text-[#e8ff47] hover:underline text-sm">← Inapoi la World Cup</a>
          </div>
        ) : (
          <div className="space-y-2">
            {data.rankings.map((r: any, i: number) => {
              const isMe = session?.user?.name === r.name
              return (
                <div key={r.userId} className={"rounded-xl border px-4 py-4 flex items-center gap-3 " + (isMe ? "bg-[#e8ff47]/05 border-[#e8ff47]/30" : i === 0 ? "bg-[#fbbf24]/05 border-[#fbbf24]/20" : "bg-[#111520] border-[#1e2640]")}>
                  <div className={"text-2xl font-black w-10 text-center " + (i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.rank}
                  </div>
                  <div className="flex-1">
                    <span className={"font-bold " + (isMe ? "text-[#e8ff47]" : "text-white")}>{r.name} {isMe && <span className="text-xs font-normal text-gray-500">(tu)</span>}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#e8ff47]">{r.wins}</div>
                    <div className="text-xs text-gray-500">câștigate</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-white">{r.total}</div>
                    <div className="text-xs text-gray-500">puncte</div>
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
