import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

const COMPETITION_FLAGS: any = {
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "La Liga": "🇪🇸",
  "Serie A": "🇮🇹",
  "Bundesliga": "🇩🇪",
  "Ligue 1": "🇫🇷",
  "Liga 1 Romania": "🇷🇴",
  "Champions League": "🏆",
}

export async function GET() {
  try {
    const round = await prisma.round.findFirst({
      where: { status: { in: ["LOCKED", "LIVE", "OPEN"] } },
      include: {
        matches: {
          orderBy: { kickoffAt: "asc" }
        }
      }
    })

    if (!round) return NextResponse.json({ message: "Nicio etapa activa" })

    // Meciurile de azi
    const azi = new Date()
    const aziStart = new Date(azi.toLocaleDateString("en-CA", { timeZone: "Europe/Bucharest" }) + "T00:00:00+03:00")
    const aziEnd = new Date(azi.toLocaleDateString("en-CA", { timeZone: "Europe/Bucharest" }) + "T23:59:59+03:00")

    const meciuriAzi = round.matches.filter(m => {
      const kickoff = new Date(m.kickoffAt)
      return kickoff >= aziStart && kickoff <= aziEnd
    })

    if (meciuriAzi.length === 0) return NextResponse.json({ message: "Niciun meci azi" })

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) return NextResponse.json({ message: "Webhook lipsa" })

    // Grupeaza pe campionate
    const grouped: any = {}
    for (const m of meciuriAzi) {
      if (!grouped[m.competitionName]) grouped[m.competitionName] = []
      grouped[m.competitionName].push(m)
    }

    let meciuriText = ""
    for (const [comp, matches] of Object.entries(grouped) as any) {
      const flag = COMPETITION_FLAGS[comp] || "🏆"
      meciuriText += `\n${flag} **${comp}**\n`
      for (const m of matches) {
        const ora = new Date(m.kickoffAt).toLocaleString("ro-RO", {
          timeZone: "Europe/Bucharest",
          hour: "2-digit",
          minute: "2-digit"
        })
        meciuriText += `• ${m.homeTeam} vs ${m.awayTeam} — ${ora}\n`
      }
    }

    const ziua = new Date().toLocaleDateString("ro-RO", {
      timeZone: "Europe/Bucharest",
      weekday: "long",
      day: "2-digit",
      month: "long"
    })

    const message = {
      embeds: [{
        title: `📅 Meciurile de azi — ${ziua}`,
        description: meciuriText,
        color: 0x3b82f6,
        fields: [
          { name: "🔗 Link", value: "[Vezi Live](https://mamaliga.vercel.app/live)", inline: false }
        ],
        footer: { text: "MamaLIGA — Jocul de predicții al grupului" }
      }]
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    })

    return NextResponse.json({ message: "Discord trimis!", meciuri: meciuriAzi.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}