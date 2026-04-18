const fs = require('fs')
let content = fs.readFileSync('app/api/badges/all/route.ts', 'utf8')

content = content.replace(
  `      const myPos = userTotals.findIndex(u => u.userId === user.id) + 1
        if (myPos === 1) earned.push("campion")
        else if (myPos === 2) earned.push("aproape")
        else if (myPos === 3) earned.push("podium")`,
  `      const totalRoundsCompleted = rounds.length
        if (totalRoundsCompleted > 0) {
          const myPos = userTotals.findIndex(u => u.userId === user.id) + 1
          if (myPos === 1) earned.push("campion")
          else if (myPos === 2) earned.push("aproape")
          else if (myPos === 3) earned.push("podium")
        }`
)

fs.writeFileSync('app/api/badges/all/route.ts', content)
console.log('Gata!')