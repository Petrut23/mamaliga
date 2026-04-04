import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
export const dynamic = "force-dynamic"
const prisma = new PrismaClient()

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
  await prisma.match.deleteMany({ where: { roundId: id } })
  await prisma.round.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}