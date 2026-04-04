const fs = require('fs')

fs.mkdirSync('app/api/admin/import-meciuri', { recursive: true })

const importApi = `import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"

const COMPETITIONS: any = {
  "Premier League": "PL",
  "La Liga": "PD",
  "Serie A": "SA",
  "Bundesliga": "BL1",
  "Ligue 1": "FL1",
}

export async function GET(req: NextRequest) {
  const dateFrom = req.nextUrl.searchParams.get("dateFrom")
  const dateTo = req.nextUrl.searchParams.get("dateTo")

  if (!dateFrom || !dateTo) {
    return NextResponse.json({ error: "dateFrom si dateTo sunt obligatorii" }, { status: 400 })
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  const allMatches: any[] = []

  for (const [name, code] of Object.entries(COMPETITIONS)) {
    try {
      const res = await fetch(
        \`https://api.football-data.org/v4/competitions/\${code}/matches?dateFrom=\${dateFrom}&dateTo=\${dateTo}&status=SCHEDULED\`,
        { headers: { "X-Auth-Token": apiKey || "" } }
      )
      const data = await res.json()
      if (data.matches) {
        const matches = data.matches.map((m: any) => ({
          externalApiId: String(m.id),
          competitionName: name,
          homeTeam: m.homeTeam.name,
          awayTeam: m.awayTeam.name,
          kickoffAt: m.utcDate,
        }))
        allMatches.push(...matches)
      }
    } catch (err) {
      console.error(\`Eroare la \${name}:\`, err)
    }
  }

  try {
    const res = await fetch(
      \`https://api-football-v1.p.rapidapi.com/v3/fixtures?league=283&season=2025&from=\${dateFrom}&to=\${dateTo}&status=NS\`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
        }
      }
    )
    const data = await res.json()
    if (data.response) {
      const matches = data.response.map((m: any) => ({
        externalApiId: String(m.fixture.id),
        competitionName: "Liga 1 Romania",
        homeTeam: m.teams.home.name,
        awayTeam: m.teams.away.name,
        kickoffAt: m.fixture.date,
      }))
      allMatches.push(...matches)
    }
  } catch (err) {
    console.error("Eroare Liga 1:", err)
  }

  allMatches.sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime())

  return NextResponse.json({ matches: allMatches })
}`

fs.writeFileSync('app/api/admin/import-meciuri/route.ts', importApi)
console.log('Gata!')