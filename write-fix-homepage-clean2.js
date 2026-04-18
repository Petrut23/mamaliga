const fs = require('fs')
let content = fs.readFileSync('app/page.tsx', 'utf8')

// Stergem toate liniile cu descrieri hidden md:block
const lines = content.split('\n')
const filtered = lines.filter(line => !line.includes('hidden md:block'))
content = filtered.join('\n')

fs.writeFileSync('app/page.tsx', content)
console.log('Gata!')