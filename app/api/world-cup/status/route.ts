import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

const WC_SEASON_ID = "ca080bd2-7691-4396-a123-5264ffaeceef"

export async function GET() {
  try {
    const round = await prisma.round.findFirst({
      where: {
        seasonId: WC_SEASON_ID,
        status: { in: ["OPEN", "LOCKED", "LIVE"] }
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json({ round })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}