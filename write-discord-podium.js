const fs = require('fs')

let sync = fs.readFileSync('app/api/admin/sync-scoruri/route.ts', 'utf8')

const podiumFunction = `
async function sendDiscordPodium(roundId: string, roundTitle: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return

  const rankings = await prisma.roundRanking.findMany({
    where: { roundId },
    orderBy: [{ finalPoints: "desc" }, { exactHits: "desc" }],
    include: { user: { select: { name: true } } },
    take: 3
  })

  if (rankings.length === 0) return

  const medals = ["🥇", "🥈", "🥉"]
  const podiumText = rankings.map((r, i) => 
    \`\${medals[i]} **\${r.user.name}** — \${r.finalPoints} puncte\`
  ).join("\\n")

  const message = {
    embeds: [{
      title: \`🏆 \${roundTitle} s-a încheiat!\`,
      description: \`Iată podiumul etapei:\\n\\n\${podiumText}\`,
      color: 0xe8ff47,
      fields: [
        {
          name: "📊 Vezi clasamentul complet",
          value: "[Intră pe MamaLIGA](https://mamaliga.vercel.app/clasament)",
          inline: false
        }
      ],
      footer: { text: "MamaLIGA — Jocul de predicții al grupului" }
    }]
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    })
    console.log("Discord podium trimis pentru", roundTitle)
  } catch (err) {
    console.error("Eroare Discord podium:", err)
  }
}`

sync = sync + podiumFunction

// Adaugam apelul in autoCompleteEtape
sync = sync.replace(
  `      await prisma.round.update({ where: { id: round.id }, data: { status: "COMPLETED" } })
      console.log("Etapa completata automat:", round.id)`,
  `      await prisma.round.update({ where: { id: round.id }, data: { status: "COMPLETED" } })
      console.log("Etapa completata automat:", round.id)
      await sendDiscordPodium(round.id, round.title)`
)

fs.writeFileSync('app/api/admin/sync-scoruri/route.ts', sync)
console.log('Gata!')