import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET() {
  const etape = await prisma.round.findMany({ orderBy: { createdAt: "desc" }, include: { season: true } })
  return NextResponse.json({ etape })
}

export async function POST(req: NextRequest) {
  const { seasonId, roundNumber, title, deadlineAt } = await req.json()
  const etapa = await prisma.round.create({ data: { seasonId, roundNumber: parseInt(roundNumber), title, deadlineAt: new Date(deadlineAt) } })
  return NextResponse.json({ etapa }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const etapa = await prisma.round.update({ where: { id }, data: { status } })
  return NextResponse.json({ etapa })
}
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID lipsa" }, { status: 400 })
  const matches = await prisma.match.findMany({ where: { roundId: id } })
  const matchIds = matches.map(m => m.id)
  await prisma.matchPoint.deleteMany({ where: { matchId: { in: matchIds } } })
  await prisma.prediction.deleteMany({ where: { matchId: { in: matchIds } } })
  await prisma.roundRanking.deleteMany({ where: { roundId: id } })
  await prisma.match.deleteMany({ where: { roundId: id } })
  await prisma.round.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}