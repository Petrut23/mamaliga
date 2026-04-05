import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
export const dynamic = "force-dynamic"
const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })

  const roundId = req.nextUrl.searchParams.get("roundId")
  const userId = (session.user as any).id

  const predictions = await prisma.prediction.findMany({
    where: { userId, match: { roundId: roundId || undefined } },
    include: { match: true }
  })

  return NextResponse.json({ predictions })
}