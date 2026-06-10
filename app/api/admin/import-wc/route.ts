import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

const WC_SEASON_ID = "ca080bd2-7691-4396-a123-5264ffaeceef"
const WC_LEAGUE_ID = 27

export async function GET(req: NextRequest) {
  const dateFrom = req.nextUrl.searchParams.get("dateFrom")
  const dateTo = req.nextUrl.searchParams.get("dateTo")

  if (!dateFrom || !dateTo) {
    return NextResponse.json({ error: "dateFrom si dateTo sunt obligatorii" }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://sports.bzzoiro.com/api/events/?league=${WC_LEAGUE_ID}&date_from=${dateFrom}&date_to=${dateTo}&tz=Europe/Bucharest`,
      { headers: { "Authorization": `Token ${process.env.BZZOIRO_API_KEY}` } }
    )
    const data = await res.json()
    if (!data.results) return NextResponse.json({ error: "Eroare API" }, { status: 500 })

    const matches = data.results.map((m: any) => ({
      externalApiId: String(m.id),
      homeTeam: m.home_team,
      awayTeam: m.away_team,
      competitionName: "World Cup 2026",
      kickoffAt: m.event_date,
    }))

    return NextResponse.json({ matches })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}