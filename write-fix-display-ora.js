const fs = require('fs')
let content = fs.readFileSync('app/admin/etape/page.tsx', 'utf8')

content = content.replace(
  `Deadline: {new Date(new Date(etapa.deadlineAt).getTime() + 3 * 60 * 60 * 1000).toLocaleString("ro-RO", { timeZone: "UTC" })}`,
  `Deadline: {new Date(etapa.deadlineAt).toLocaleString("ro-RO", { timeZone: "Europe/Bucharest" })}`
)

fs.writeFileSync('app/admin/etape/page.tsx', content)
console.log('Gata!')