const fs = require('fs')
let content = fs.readFileSync('app/api/admin/import-meciuri/route.ts', 'utf8')

content = content.replace(
  `const res = await fetch(
      \`https://sports.bzzoiro.com/api/events/?league=23&date_from=\${dateFrom}&date_to=\${dateTo}\`,`,
  `const res = await fetch(
      \`https://sports.bzzoiro.com/api/events/?league=23\`,`
)

content = content.replace(
  `      const dateFromObj = new Date(dateFrom)
      const dateToObj = new Date(dateTo)
      
      const res = await fetch(`,
  `      const dateFromObj = new Date(dateFrom + 'T00:00:00')
      const dateToObj = new Date(dateTo + 'T23:59:59')
      
      const res = await fetch(`
)

content = content.replace(
  `.filter((m: any) => {
          const matchDate = new Date(m.event_date)
          return matchDate >= dateFromObj && matchDate <= dateToObj
        })`,
  `.filter((m: any) => {
          const matchDate = new Date(m.event_date)
          const matchDateOnly = matchDate.toISOString().slice(0, 10)
          return matchDateOnly >= dateFrom && matchDateOnly <= dateTo
        })`
)

fs.writeFileSync('app/api/admin/import-meciuri/route.ts', content)
console.log('Gata!')