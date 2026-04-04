import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
export const dynamic = "force-dynamic"
const prisma = new PrismaClient()

export async function GET() {
  const sezoane = await prisma.season.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json({ sezoane })
}

export async function POST(req: NextRequest) {
  const { name } = await req.json()
  const sezon = await prisma.season.create({ data: { name, isActive: true } })
  return NextResponse.json({ sezon }, { status: 201 })
}