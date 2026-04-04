const fs = require('fs')
let content = fs.readFileSync('package.json', 'utf8')
content = content.replace(
  '"build": "next build"',
  '"build": "prisma generate && next build"'
)
fs.writeFileSync('package.json', content)
console.log('Gata!')