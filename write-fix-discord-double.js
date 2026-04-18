const fs = require('fs')
let content = fs.readFileSync('app/api/admin/sync-scoruri/route.ts', 'utf8')

content = content.replace(
  `if (allFinished) {
      await prisma.round.update({ where: { id: round.id }, data: { status: "COMPLETED" } })
      console.log("Etapa completata automat:", round.id)
      await sendDiscordPodium(round.id, round.title)
    }`,
  `if (allFinished) {
      // Verificam daca nu e deja COMPLETED pentru a evita duplicate Discord
      const currentRound = await prisma.round.findUnique({ where: { id: round.id } })
      if (currentRound?.status !== "COMPLETED") {
        await prisma.round.update({ where: { id: round.id }, data: { status: "COMPLETED" } })
        console.log("Etapa completata automat:", round.id)
        await sendDiscordPodium(round.id, round.title)
      }
    }`
)

fs.writeFileSync('app/api/admin/sync-scoruri/route.ts', content)
console.log('Gata!')