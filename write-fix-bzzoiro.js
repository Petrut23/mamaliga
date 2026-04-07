const fs = require('fs')
let content = fs.readFileSync('app/api/admin/import-meciuri/route.ts', 'utf8')

content = content.replace(
  `const res = await fetch(
      \`https://sports.bzzoiro.com/api/events/?league=23\`,`,
  `const res = await fetch(
      \`https://sports.bzzoiro.com/api/events/?league=23&date_from=\${dateFrom}&date_to=\${dateTo}\`,`
)

fs.writeFileSync('app/api/admin/import-meciuri/route.ts', content)
console.log('Gata!')