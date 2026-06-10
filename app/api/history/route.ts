import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        seasonRankings: {
          orderBy: { finalRank: "asc" },
          include: { user: { select: { name: true } } }
        }
      }
    })

    return NextResponse.json({ seasons })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
