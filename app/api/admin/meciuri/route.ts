import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const roundId = req.nextUrl.searchParams.get("roundId")
  if (!roundId) return NextResponse.json({ meciuri: [] })
  const meciuri = await prisma.match.findMany({ where: { roundId }, orderBy: { kickoffAt: "asc" } })
  return NextResponse.json({ meciuri })
}

export async function POST(req: NextRequest) {
  const { roundId, homeTeam, awayTeam, competitionName, kickoffAt } = await req.json()
  const meci = await prisma.match.create({
    data: { roundId, homeTeam, awayTeam, competitionName, kickoffAt: new Date(kickoffAt) }
  })
  return NextResponse.json({ meci }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID lipsa" }, { status: 400 })
  await prisma.matchPoint.deleteMany({ where: { matchId: id } })
  await prisma.prediction.deleteMany({ where: { matchId: id } })
  await prisma.match.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
export async function PATCH(req: NextRequest) {
  const { id, homeTeam, awayTeam, competitionName, kickoffAt } = await req.json()
  const meci = await prisma.match.update({
    where: { id },
    data: { homeTeam, awayTeam, competitionName, kickoffAt: new Date(kickoffAt) }
  })
  return NextResponse.json({ meci })
}