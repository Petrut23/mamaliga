import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
export const dynamic = "force-dynamic"
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

  const { roundId, predictions } = await req.json()
  const userId = (session.user as any).id

  const round = await prisma.round.findUnique({ where: { id: roundId } })
  if (!round) return NextResponse.json({ error: "Etapa negasita" }, { status: 404 })
  if (new Date() > new Date(round.deadlineAt)) return NextResponse.json({ error: "Deadline expirat" }, { status: 400 })

  const captainCount = predictions.filter((p: any) => p.isCaptain).length
  if (captainCount > 1) return NextResponse.json({ error: "Poti alege un singur meci capitan" }, { status: 400 })

  for (const pred of predictions) {
    await prisma.prediction.upsert({
      where: { userId_matchId: { userId, matchId: pred.matchId } },
      update: { predictedHome: pred.predictedHome, predictedAway: pred.predictedAway, isCaptain: pred.isCaptain },
      create: { userId, matchId: pred.matchId, predictedHome: pred.predictedHome, predictedAway: pred.predictedAway, isCaptain: pred.isCaptain }
    })
  }

  return NextResponse.json({ ok: true })
}