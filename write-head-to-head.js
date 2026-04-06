const fs = require('fs')

fs.mkdirSync('app/head-to-head', { recursive: true })
fs.mkdirSync('app/api/head-to-head', { recursive: true })

const h2hApi = `import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

  const opponentId = req.nextUrl.searchParams.get("opponentId")
  const myId = (session.user as any).id

  const users = await prisma.user.findMany({
    select: { id: true, name: true },
    where: { id: { not: myId } }
  })

  if (!opponentId) return NextResponse.json({ users })

  const rounds = await prisma.round.findMany({
    where: { status: "COMPLETED" },
    orderBy: { createdAt: "desc" }
  })

  const h2hRounds = []
  let myWins = 0, opponentWins = 0, draws = 0

  for (const round of rounds) {
    const myRanking = await prisma.roundRanking.findUnique({
      where: { roundId_userId: { roundId: round.id, userId: myId } },
      include: { user: { select: { name: true } } }
    })
    const opponentRanking = await prisma.roundRanking.findUnique({
      where: { roundId_userId: { roundId: round.id, userId: opponentId } },
      include: { user: { select: { name: true } } }
    })

    if (!myRanking || !opponentRanking) continue

    const myPts = myRanking.finalPoints
    const oppPts = opponentRanking.finalPoints
    let result = "draw"
    if (myPts > oppPts) { myWins++; result = "win" }
    else if (myPts < oppPts) { opponentWins++; result = "loss" }
    else draws++

    h2hRounds.push({
      title: round.title,
      myPoints: myPts,
      opponentPoints: oppPts,
      myExact: myRanking.exactHits,
      opponentExact: opponentRanking.exactHits,
      result
    })
  }

  const opponent = await prisma.user.findUnique({ where: { id: opponentId }, select: { name: true } })

  return NextResponse.json({ users, h2hRounds, myWins, opponentWins, draws, opponentName: opponent?.name })
}`

const h2hPage = `"use client"
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
}`

fs.writeFileSync('app/api/head-to-head/route.ts', h2hApi)
fs.writeFileSync('app/head-to-head/page.tsx', h2hPage)
console.log('Gata!')