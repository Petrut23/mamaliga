import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"

const COMPETITIONS: any = {
  "Premier League": "PL",
  "La Liga": "PD",
  "Serie A": "SA",
  "Bundesliga": "BL1",
  "Ligue 1": "FL1",
  "Champions League": "CL",
}

export async function GET(req: NextRequest) {
  const dateFrom = req.nextUrl.searchParams.get("dateFrom")
  const dateTo = req.nextUrl.searchParams.get("dateTo")

  if (!dateFrom || !dateTo) {
    return NextResponse.json({ error: "dateFrom si dateTo sunt obligatorii" }, { status: 400 })
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  const allMatches: any[] = []

  // Football-data.org - 5 campionate mari
  for (const [name, code] of Object.entries(COMPETITIONS)) {
    try {
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${code}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&status=SCHEDULED`,
        { headers: { "X-Auth-Token": apiKey || "" } }
      )
      const data = await res.json()
      if (data.matches) {
        const matches = data.matches.map((m: any) => ({
          externalApiId: String(m.id),
          provider: "football-data",
          competitionName: name,
          homeTeam: m.homeTeam.name,
          awayTeam: m.awayTeam.name,
          kickoffAt: m.utcDate,
        }))
        allMatches.push(...matches)
      }
    } catch (err) {
      console.error(`Eroare la ${name}:`, err)
    }
  }

  // bzzoiro - Liga 1 Romania
  try {
    const dateFromObj = new Date(dateFrom)
    const dateToObj = new Date(dateTo)
    
    const res = await fetch(
      `https://sports.bzzoiro.com/api/events/?league=23`,
      {
        headers: {
          "Authorization": `Token ${process.env.BZZOIRO_API_KEY || ""}`,
          "Content-Type": "application/json"
        }
      }
    )
    const data = await res.json()
    if (data.results) {
      const matches = data.results
        .filter((m: any) => {
          const matchDate = new Date(m.event_date)
          return matchDate >= dateFromObj && matchDate <= dateToObj
        })
        .map((m: any) => ({
          externalApiId: String(m.id),
          provider: "bzzoiro",
          competitionName: "Liga 1 Romania",
          homeTeam: m.home_team,
          awayTeam: m.away_team,
          kickoffAt: m.event_date,
        }))
      allMatches.push(...matches)
    }
  } catch (err) {
    console.error("Eroare Liga 1 Romania:", err)
  }

  allMatches.sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime())

  return NextResponse.json({ matches: allMatches })
}