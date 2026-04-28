import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

function calculeazaPuncte(predHome: number, predAway: number, realHome: number, realAway: number): number {
  if (predHome === realHome && predAway === realAway) return 5
  if ((predHome - predAway) === (realHome - realAway)) return 2
  const predResult = predHome > predAway ? 1 : predHome < predAway ? 2 : 0
  const realResult = realHome > realAway ? 1 : realHome < realAway ? 2 : 0
  if (predResult === realResult) return 1
  return 0
}

export async function GET() {
  try {
    const round = await prisma.round.findFirst({
      where: { status: { in: ["LOCKED", "LIVE"] } },
      include: { matches: true }
    })

    if (!round) return NextResponse.json({ message: "Nicio etapa activa" })

    // Verifica daca mai sunt meciuri azi (duminica)
    const azi = new Date()
    const aziStart = new Date(azi.toLocaleDateString("en-CA", { timeZone: "Europe/Bucharest" }) + "T00:00:00+03:00")
    const aziEnd = new Date(azi.toLocaleDateString("en-CA", { timeZone: "Europe/Bucharest" }) + "T23:59:59+03:00")

    const meciuriAzi = round.matches.filter(m => {
      const kickoff = new Date(m.kickoffAt)
      return kickoff >= aziStart && kickoff <= aziEnd
    })

    if (meciuriAzi.length === 0) return NextResponse.json({ message: "Niciun meci azi" })

    // Calculeaza clasamentul intermediar
    const predictions = await prisma.prediction.findMany({
      where: { match: { roundId: round.id } },
      include: { user: { select: { id: true, name: true } } }
    })

    const finishedMatches = round.matches.filter(m => m.status === "FINISHED")
    const userPoints: any = {}

    for (const pred of predictions) {
      if (!userPoints[pred.userId]) {
        userPoints[pred.userId] = { name: pred.user.name, total: 0 }
      }
      const match = finishedMatches.find((m: any) => m.id === pred.matchId)
      if (!match || match.finalHomeScore === null || match.finalAwayScore === null) continue
      const base = calculeazaPuncte(pred.predictedHome, pred.predictedAway, match.finalHomeScore, match.finalAwayScore)
      userPoints[pred.userId].total += base * (pred.isCaptain ? 2 : 1)
    }

    const rankings = Object.entries(userPoints)
      .map(([_, pts]: any) => ({ name: pts.name, total: pts.total }))
      .sort((a, b) => b.total - a.total)

    if (rankings.length === 0) return NextResponse.json({ message: "Niciun punctaj inca" })

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) return NextResponse.json({ message: "Webhook lipsa" })

    const medals = ["🥇", "🥈", "🥉"]
    const clasamentText = rankings.map((r, i) => {
      const medal = medals[i] || `${i + 1}.`
      return `${medal} **${r.name}** — ${r.total} pct`
    }).join("\n")

    const meciuriRamase = meciuriAzi.filter((m: any) => m.status === "SCHEDULED" || m.status === "LIVE").length

    const message = {
      embeds: [{
        title: "📊 Clasament după prima zi de meciuri",
        description: `*Mai sunt **${meciuriRamase}** meciuri de jucat azi — totul se poate schimba!*\n\n${clasamentText}`,
        color: 0xe8ff47,
        fields: [
          {
            name: "🔗 Link",
            value: "[Vezi clasamentul live](https://mamaliga.vercel.app/live)",
            inline: false
          }
        ],
        footer: { text: "MamaLIGA — Jocul de predicții al grupului" }
      }]
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    })

    return NextResponse.json({ message: "Discord trimis!", rankings })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}