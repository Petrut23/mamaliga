import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET() {
  const utilizatori = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true, isApproved: true }
  })
  return NextResponse.json({ utilizatori })
}

export async function PATCH(req: NextRequest) {
  const { id, role, receiveEmails, isApproved } = await req.json()
  const updateData: any = {}
  if (role !== undefined) updateData.role = role
  if (receiveEmails !== undefined) updateData.receiveEmails = receiveEmails
  if (isApproved !== undefined) updateData.isApproved = isApproved
  const user = await prisma.user.update({ where: { id }, data: updateData })
  return NextResponse.json({ user })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID lipsa" }, { status: 400 })
  await prisma.prediction.deleteMany({ where: { userId: id } })
  await prisma.roundRanking.deleteMany({ where: { userId: id } })
  await prisma.overallRanking.deleteMany({ where: { userId: id } })
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}