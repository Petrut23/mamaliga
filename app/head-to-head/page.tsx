"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function HeadToHeadPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState("")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/head-to-head").then(r => r.json()).then(d => setUsers(d.users || []))
  }, [])

  useEffect(() => {
    if (!selectedUser) return
    setLoading(true)
    fetch("/api/head-to-head?opponentId=" + selectedUser)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [selectedUser])

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white pb-10">
      <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">Comparatie</div>
          <div className="text-3xl font-black">Head-to-Head</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Alege adversarul</label>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}
            className="bg-[#111520] border border-[#1e2640] text-white rounded-lg px-4 py-2.5 min-w-64">
            <option value="">Selecteaza un jucator...</option>
            {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        {loading && <div className="text-gray-500 text-center py-10">Se incarca...</div>}

        {data && !loading && (
          <>
            {/* Scor general */}
            <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-4xl font-black text-[#e8ff47]">{data.myWins}</div>
                  <div className="text-sm font-bold text-white mt-1">{session?.user?.name}</div>
                  <div className="text-xs text-gray-500">victorii</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-2xl font-black text-gray-500">{data.draws}</div>
                  <div className="text-xs text-gray-500">egaluri</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-4xl font-black text-red-400">{data.opponentWins}</div>
                  <div className="text-sm font-bold text-white mt-1">{data.opponentName}</div>
                  <div className="text-xs text-gray-500">victorii</div>
                </div>
              </div>
            </div>

            {/* Lista etape */}
            {data.h2hRounds.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Nu exista etape comune finalizate.</div>
            ) : (
              <div className="space-y-3">
                {data.h2hRounds.map((r: any, i: number) => (
                  <div key={i} className={"rounded-xl border px-5 py-4 " + (r.result === "win" ? "bg-green-500/05 border-green-500/20" : r.result === "loss" ? "bg-red-500/05 border-red-500/20" : "bg-[#111520] border-[#1e2640]")}>
                    <div className="text-sm font-bold text-gray-400 mb-3">{r.title}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <div className={"text-2xl font-black " + (r.result === "win" ? "text-green-400" : "text-white")}>{r.myPoints}</div>
                        <div className="text-xs text-gray-500">{r.myExact} exacte</div>
                      </div>
                      <div className="text-center px-4">
                        <div className={"text-xs font-bold px-2 py-1 rounded-full " + (r.result === "win" ? "bg-green-500/20 text-green-400" : r.result === "loss" ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400")}>
                          {r.result === "win" ? "CASTIGAT" : r.result === "loss" ? "PIERDUT" : "EGAL"}
                        </div>
                      </div>
                      <div className="text-center flex-1">
                        <div className={"text-2xl font-black " + (r.result === "loss" ? "text-red-400" : "text-white")}>{r.opponentPoints}</div>
                        <div className="text-xs text-gray-500">{r.opponentExact} exacte</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!selectedUser && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚔️</div>
            <div className="text-lg font-bold text-white mb-2">Alege un adversar</div>
            <div className="text-sm text-gray-500">Selecteaza un jucator pentru a vedea statisticile voastre</div>
          </div>
        )}
      </div>
    </div>
  )
}