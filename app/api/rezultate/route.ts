import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
export const dynamic = "force-dynamic"

const WC_SEASON_ID = "ca080bd2-7691-4396-a123-5264ffaeceef"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
  const userId = (session.user as any).id

  const { searchParams } = new URL(req.url)
  const isWC = searchParams.get("wc") === "1"

  const seasonFilter = isWC
    ? { seasonId: WC_SEASON_ID }
    : { seasonId: { not: WC_SEASON_ID } }

  const rounds = await prisma.round.findMany({
    where: { status: { in: ["COMPLETED", "LIVE", "LOCKED"] }, ...seasonFilter },
    orderBy: { createdAt: "desc" },
    include: {
      matches: {
        orderBy: { kickoffAt: "asc" },
        include: {
          predictions: {
            where: { userId },
            include: { matchPoints: true }
          }
        }
      }
    }
  })

  const result = rounds.map(round => {
    const matches = round.matches.map(match => {
      const pred = match.predictions[0] || null
      const points = pred?.matchPoints[0] || null
      return {
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        competitionName: match.competitionName,
        kickoffAt: match.kickoffAt,
        status: match.status,
        finalHomeScore: match.finalHomeScore,
        finalAwayScore: match.finalAwayScore,
        prediction: pred ? {
          predictedHome: pred.predictedHome,
          predictedAway: pred.predictedAway,
          isCaptain: pred.isCaptain,
          points: points?.totalPoints ?? null,
          basePoints: points?.basePoints ?? null,
        } : null
      }
    })
    const totalPoints = matches.reduce((sum, m) => sum + (m.prediction?.points || 0), 0)
    return { id: round.id, title: round.title, status: round.status, matches, totalPoints }
  })

  return NextResponse.json({ rounds: result })
}
