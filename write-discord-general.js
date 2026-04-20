const fs = require('fs')
let content = fs.readFileSync('app/api/admin/sync-scoruri/route.ts', 'utf8')

const oldEnd = `  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    })
    console.log("Discord podium trimis")
  } catch (err) {
    console.error("Eroare Discord podium:", err)
  }
}`

const newEnd = `  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    })
    console.log("Discord podium trimis")
  } catch (err) {
    console.error("Eroare Discord podium:", err)
  }

  // Trimite clasamentul general
  try {
    const season = await prisma.season.findFirst({ where: { isActive: true } })
    if (!season) return

    const allRounds = await prisma.round.findMany({
      where: { seasonId: season.id, status: "COMPLETED" }
    })
    const allRoundIds = allRounds.map(r => r.id)

    const historicRankings = await prisma.$queryRaw\`
      SELECT hr.*, u.name, u.id as "userId"
      FROM "HistoricRanking" hr
      JOIN "User" u ON hr."userId" = u.id
    \` as any[]

    const allRoundRankings = await prisma.roundRanking.findMany({
      where: { roundId: { in: allRoundIds } },
      include: { user: { select: { id: true, name: true } } }
    })

    const userStats: any = {}

    for (const h of historicRankings) {
      userStats[h.userId] = {
        name: h.name,
        total: Number(h.totalPoints),
        rounds: Number(h.roundsPlayed),
        wins: Number(h.roundsWon),
        bestWeek: Number(h.bestRound),
      }
    }

    for (const rr of allRoundRankings) {
      if (!userStats[rr.userId]) {
        userStats[rr.userId] = { name: rr.user.name, total: 0, rounds: 0, wins: 0, bestWeek: 0 }
      }
      const pts = rr.finalPoints ?? 0
      userStats[rr.userId].total += pts
      userStats[rr.userId].rounds += 1
      if (rr.rank === 1) userStats[rr.userId].wins += 1
      if (pts > userStats[rr.userId].bestWeek) userStats[rr.userId].bestWeek = pts
    }

    const sorted = Object.entries(userStats)
      .map(([userId, s]: any) => ({
        userId, name: s.name, total: s.total, rounds: s.rounds, wins: s.wins,
        average: s.rounds > 0 ? Math.round((s.total / s.rounds) * 10) / 10 : 0,
        bestWeek: s.bestWeek
      }))
      .sort((a, b) => b.wins - a.wins || b.total - a.total || b.bestWeek - a.bestWeek)

    const medals2 = ["🥇", "🥈", "🥉"]
    const generalText = sorted.map((r, i) => {
      const medal = medals2[i] || \`\${i + 1}.\`
      return \`\${medal} **\${r.name}** — \${r.wins} câștigate | \${r.total} pct | avg \${r.average}\`
    }).join("\\n")

    const generalMessage = {
      embeds: [{
        title: \`📊 Clasament General după \${roundTitle}\`,
        description: generalText,
        color: 0x3b82f6,
        footer: { text: "MamaLIGA — Jocul de predicții al grupului" }
      }]
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(generalMessage)
    })
    console.log("Discord clasament general trimis")
  } catch (err) {
    console.error("Eroare Discord clasament general:", err)
  }
}`

content = content.replace(oldEnd, newEnd)
fs.writeFileSync('app/api/admin/sync-scoruri/route.ts', content)
console.log('Gata!')