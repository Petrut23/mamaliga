const fs = require('fs')
let content = fs.readFileSync('app/live/page.tsx', 'utf8')

content = content.replace(
  `fetch("/api/admin/sync-scoruri").catch(() => {})
      fetch("/api/admin/sync-puncte").catch(() => {})`,
  `fetch("/api/admin/sync-scoruri").catch(() => {})`
)

fs.writeFileSync('app/live/page.tsx', content)
console.log('Gata!')