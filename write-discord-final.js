const fs = require('fs')
let content = fs.readFileSync('app/api/admin/sync-scoruri/route.ts', 'utf8')

const oldFunction = content.substring(
  content.indexOf('async function sendDiscordPodium'),
  content.indexOf('async function sendDiscordPodium') + 
  content.substring(content.indexOf('async function sendDiscordPodium')).indexOf('\nasync function')
)

const newFunction = `async function sendDiscordPodium(roundId: string, roundTitle: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return

  const rankings = await prisma.roundRanking.findMany({
    where: { roundId },
    orderBy: [{ finalPoints: "desc" }, { exactHits: "desc" }],
    include: { user: { select: { name: true, id: true } } }
  })

  if (rankings.length === 0) return

  const medals = ["🥇", "🥈", "🥉"]
  
  // Construim clasamentul complet
  const clasamentText = rankings.map((r, i) => {
    const medal = medals[i] || \`\${i + 1}.\`
    return \`\${medal} **\${r.user.name}** — \${r.finalPoints} pct (⚽ \${r.exactHits} exacte)\`
  }).join("\\n")

  // Badge-uri castigate in aceasta etapa
  const badgeLines = []
  for (const r of rankings) {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: r.user.id, roundId },
      include: { badge: true }
    }).catch(() => [])
    
    if (userBadges.length > 0) {
      const badgeText = userBadges.map((ub: any) => ub.badge.emoji + " " + ub.badge.name).join(" ")
      badgeLines.push(\`**\${r.user.name}**: \${badgeText}\`)
    }
  }

  const message: any = {
    embeds: [{
      title: \`🏆 \${roundTitle} s-a încheiat!\`,
      description: \`**Clasament final:**\\n\\n\${clasamentText}\`,
      color: 0xe8ff47,
      fields: [],
      footer: { text: "MamaLIGA — Jocul de predicții al grupului" }
    }]
  }

  if (badgeLines.length > 0) {
    message.embeds[0].fields.push({
      name: "🏅 Badge-uri câștigate în această etapă",
      value: badgeLines.join("\\n"),
      inline: false
    })
  }

  message.embeds[0].fields.push({
    name: "📊 Vezi clasamentul complet",
    value: "[Intră pe MamaLIGA](https://mamaliga.vercel.app/clasament)",
    inline: false
  })

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    })
  } catch (err) {
    console.error("Eroare Discord podium:", err)
  }
}
`

content = content.replace(oldFunction, newFunction)
fs.writeFileSync('app/api/admin/sync-scoruri/route.ts', content)
console.log('Gata!')