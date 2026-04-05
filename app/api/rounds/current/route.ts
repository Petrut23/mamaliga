import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
export const dynamic = "force-dynamic"
const prisma = new PrismaClient()

export async function GET() {
  const round = await prisma.round.findFirst({
    where: { status: { in: ["OPEN", "LOCKED", "LIVE"] } },
    orderBy: { createdAt: "desc" }
  })

  if (!round) {
    const draft = await prisma.round.findFirst({
      where: { status: "DRAFT" },
      orderBy: { createdAt: "desc" }
    })
    if (!draft) return NextResponse.json({ round: null, matches: [] })
    const matches = await prisma.match.findMany({ where: { roundId: draft.id }, orderBy: { kickoffAt: "asc" } })
    return NextResponse.json({ round: draft, matches })
  }

  const matches = await prisma.match.findMany({ where: { roundId: round.id }, orderBy: { kickoffAt: "asc" } })
  return NextResponse.json({ round, matches })
}