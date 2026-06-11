import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const seasonId = req.nextUrl.searchParams.get("seasonId")

  const whereClause: any = { status: { in: ["OPEN", "LOCKED", "LIVE"] } }
  if (seasonId) whereClause.seasonId = seasonId

  const round = await prisma.round.findFirst({
    where: whereClause,
    orderBy: { createdAt: "desc" }
  })

  if (!round) {
    const draftWhere: any = { status: "DRAFT" }
    if (seasonId) draftWhere.seasonId = seasonId
    const draft = await prisma.round.findFirst({
      where: draftWhere,
      orderBy: { createdAt: "desc" }
    })
    if (!draft) return NextResponse.json({ round: null, matches: [] })
    const matches = await prisma.match.findMany({ where: { roundId: draft.id }, orderBy: { kickoffAt: "asc" } })
    return NextResponse.json({ round: draft, matches })
  }

  const matches = await prisma.match.findMany({ where: { roundId: round.id }, orderBy: { kickoffAt: "asc" } })
  return NextResponse.json({ round, matches })
}
