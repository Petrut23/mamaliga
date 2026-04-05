const fs = require('fs')
let content = fs.readFileSync('app/live/page.tsx', 'utf8')
content = content.replace(
  '5 * 60 * 1000',
  '10 * 60 * 1000'
)
fs.writeFileSync('app/live/page.tsx', content)
console.log('Gata!')