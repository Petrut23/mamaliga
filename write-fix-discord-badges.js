const fs = require('fs')

let content = fs.readFileSync('app/api/admin/sync-scoruri/route.ts', 'utf8')

const oldFunction = content.substring(
  content.indexOf('async function sendDiscordPodium'),
  content.indexOf('\nexport async function GET')
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

  const BADGE_MAP: any = {
    sniper: "🎯 Sniper", dominator: "👑 Dominator", capitan_aur: "⭐ Căpitan de Aur",
    all_in: "🎲 All In", on_fire: "🔥 On Fire", constant: "🏃 Constant",
    perfect: "💎 Perfect", campion: "🏆 Campion", lingura: "🥄 Lingura de Lemn",
    ghinionist: "😅 Ghinionist", etern_secund: "😤 Etern Secund",
    aproape: "🥈 Aproape", podium: "🥉 Podium", veteranul: "🦕 Veteranul", fidel: "📅 Fidel",
  }

  const userIds = rankings.map(r => r.user.id)
  const roundStart = await prisma.roundRanking.findFirst({ 
    where: { roundId }, 
    orderBy: { createdAt: "asc" },
    select: { createdAt: true } 
  })

  const allBadges = await prisma.$queryRawUnsafe(
    \`SELECT "userId", "badge" FROM "UserBadge" WHERE "userId" = ANY($1) AND "earnedAt" >= $2\`,
    userIds,
    roundStart?.createdAt || new Date()
  ) as any[]

  const userBadges: any = {}
  for (const b of allBadges) {
    if (!userBadges[b.userId]) userBadges[b.userId] = []
    userBadges[b.userId].push(BADGE_MAP[b.badge] || b.badge)
  }

  const medals = ["🥇", "🥈", "🥉"]
  
  const clasamentText = rankings.map((r, i) => {
    const medal = medals[i] || \`\${i + 1}.\`
    return \`\${medal} **\${r.user.name}** — \${r.finalPoints ?? 0} pct (⚽ \${r.exactHits} exacte)\`
  }).join("\\n")

  const badgeSection = rankings
    .filter(r => userBadges[r.user.id]?.length > 0)
    .map(r => \`**\${r.user.name}**: \${userBadges[r.user.id].join(" ")}\`)
    .join("\\n")

  const fields: any[] = []
  
  if (badgeSection) {
    fields.push({
      name: "🏅 Badge-uri câștigate",
      value: badgeSection,
      inline: false
    })
  }

  fields.push({
    name: "📊 Vezi clasamentul complet",
    value: "[Intră pe MamaLIGA](https://mamaliga.vercel.app/clasament)",
    inline: false
  })

  const message = {
    embeds: [{
      title: \`🏆 \${roundTitle} s-a încheiat!\`,
      description: \`**Clasament etapă:**\\n\\n\${clasamentText}\`,
      color: 0xe8ff47,
      fields,
      footer: { text: "MamaLIGA — Jocul de predicții al grupului" }
    }]
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    })
    console.log("Discord podium trimis")
  } catch (err) {
    console.error("Eroare Discord podium:", err)
  }
}

`

content = content.replace(oldFunction, newFunction)
fs.writeFileSync('app/api/admin/sync-scoruri/route.ts', content)
console.log('Gata!')