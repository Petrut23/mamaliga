import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
export const dynamic = "force-dynamic"
const prisma = new PrismaClient()

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
  await prisma.match.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}