import { NextRequest, NextResponse } from "next/server"
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

    const myPts = myRanking.finalPoints ?? 0
    const oppPts = opponentRanking.finalPoints ?? 0
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
}