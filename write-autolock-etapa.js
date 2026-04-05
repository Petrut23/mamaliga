const fs = require('fs')

let sync = fs.readFileSync('app/api/admin/sync-scoruri/route.ts', 'utf8')

sync = sync.replace(
  `    await syncFootballData()
    await syncLiga1()
    await calculeazaToatePunctele()
    await autoCompleteEtape()`,
  `    await autoLockEtape()
    await syncFootballData()
    await syncLiga1()
    await calculeazaToatePunctele()
    await autoCompleteEtape()`
)

const autoLock = `
async function autoLockEtape() {
  const rounds = await prisma.round.findMany({
    where: { status: "OPEN" }
  })

  for (const round of rounds) {
    if (new Date() > new Date(round.deadlineAt)) {
      await prisma.round.update({ where: { id: round.id }, data: { status: "LOCKED" } })
      console.log("Etapa blocata automat:", round.id)
    }
  }
}`

sync = sync + autoLock
fs.writeFileSync('app/api/admin/sync-scoruri/route.ts', sync)
console.log('Gata!')