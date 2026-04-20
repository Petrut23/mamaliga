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
      where: { status: "OPEN" },
      include: {
        matches: {
          orderBy: { kickoffAt: "asc" }
        }
      }
    })

    if (!round) return NextResponse.json({ message: "Nicio etapa OPEN" })
    if (round.matches.length === 0) return NextResponse.json({ message: "Niciun meci" })

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) return NextResponse.json({ message: "Webhook lipsa" })

    const deadline = new Date(round.deadlineAt).toLocaleString("ro-RO", {
      timeZone: "Europe/Bucharest",
      weekday: "long",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit"
    })

    // Grupeaza meciurile pe campionate
    const grouped: any = {}
    for (const m of round.matches) {
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
          weekday: "short",
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        })
        meciuriText += `• ${m.homeTeam} vs ${m.awayTeam} — ${ora}\n`
      }
    }

    const message = {
      embeds: [{
        title: `🏁 ${round.title} — Meciurile săptămânii`,
        description: meciuriText,
        color: 0xe8ff47,
        fields: [
          { name: "⏰ Deadline", value: deadline, inline: false },
          { name: "🔗 Link", value: "[Pune-ți predicțiile acum](https://mamaliga.vercel.app/predictii)", inline: false }
        ],
        footer: { text: "MamaLIGA — Jocul de predicții al grupului" }
      }]
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    })

    return NextResponse.json({ message: "Discord trimis!", round: round.title, meciuri: round.matches.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}