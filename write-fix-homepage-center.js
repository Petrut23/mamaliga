const fs = require('fs')
let content = fs.readFileSync('app/page.tsx', 'utf8')

content = content.replace(/text-left/g, 'text-center')

fs.writeFileSync('app/page.tsx', content)
console.log('Gata!')