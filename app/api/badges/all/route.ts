import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculeazaSiSalveazaBadges, BADGES } from "../route"
export const dynamic = "force-dynamic"

export async function GET() {
  const users = await prisma.user.findMany({ select: { id: true, name: true } })
  const userBadges: any = {}
  for (const user of users) {
    userBadges[user.id] = await calculeazaSiSalveazaBadges(user.id)
  }
  return NextResponse.json({ userBadges, badges: BADGES })
}