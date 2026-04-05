const fs = require('fs')
let content = fs.readFileSync('app/admin/etape/page.tsx', 'utf8')

// Fix salvare - nu mai scadem 3 ore, salvam direct ce introduce userul
content = content.replace(
  `const deadlineLocal = new Date(form.deadlineDate + "T" + form.deadlineTime + ":00")
    const deadlineUTC = new Date(deadlineLocal.getTime() - 3 * 60 * 60 * 1000).toISOString()`,
  `const deadlineUTC = new Date(form.deadlineDate + "T" + form.deadlineTime + ":00").toISOString()`
)

// Fix afisare - folosim toLocaleString fara conversii manuale
content = content.replace(
  `Deadline: {new Date(etapa.deadlineAt).toLocaleString("ro-RO", { timeZone: "Europe/Bucharest" })}`,
  `Deadline: {new Date(etapa.deadlineAt).toLocaleString("ro-RO")}`
)

fs.writeFileSync('app/admin/etape/page.tsx', content)
console.log('Gata!')