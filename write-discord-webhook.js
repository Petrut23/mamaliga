const fs = require('fs')

// Adaugam trimitere webhook Discord la schimbarea statusului etapei
let etapeApi = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')

const discordFunction = `
async function sendDiscordNotification(round: any) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return

  const deadline = new Date(round.deadlineAt).toLocaleString("ro-RO", { 
    timeZone: "Europe/Bucharest",
    weekday: "long",
    day: "2-digit", 
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  })

  const message = {
    embeds: [{
      title: "🏆 " + round.title + " este LIVE!",
      description: "E timpul să îți pui predicțiile!",
      color: 0xe8ff47,
      fields: [
        {
          name: "⏰ Deadline",
          value: deadline,
          inline: false
        },
        {
          name: "🔗 Link",
          value: "[Intră pe MamaLIGA](https://mamaliga.vercel.app)",
          inline: false
        }
      ],
      footer: {
        text: "Mult succes! 🎯"
      }
    }]
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    })
  } catch (err) {
    console.error("Eroare Discord webhook:", err)
  }
}`

etapeApi = etapeApi + discordFunction

// Adaugam apelul la sendDiscordNotification cand status devine OPEN
etapeApi = etapeApi.replace(
  `  const { id, status } = await req.json()
  const etapa = await prisma.round.update({ where: { id }, data: { status } })
  return NextResponse.json({ etapa })`,
  `  const { id, status, ...rest } = await req.json()
  const etapa = await prisma.round.update({ where: { id }, data: { status, ...rest } })
  if (status === "OPEN") {
    await sendDiscordNotification(etapa)
  }
  return NextResponse.json({ etapa })`
)

fs.writeFileSync('app/api/admin/etape/route.ts', etapeApi)
console.log('Gata!')