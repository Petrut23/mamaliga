const fs = require('fs')
let content = fs.readFileSync('app/predictii/page.tsx', 'utf8')

content = content.replace(
  `"Deadline: " + new Date(data.round.deadlineAt).toLocaleString("ro-RO")`,
  `"Deadline: " + new Date(data.round.deadlineAt).toLocaleString("ro-RO", { timeZone: "Europe/Bucharest" })`
)

fs.writeFileSync('app/predictii/page.tsx', content)
console.log('Gata!')