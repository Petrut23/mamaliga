const fs = require('fs')
let content = fs.readFileSync('app/login/page.tsx', 'utf8')
content = content.replace(
  `if (searchParams.get("pending") === "true")`,
  `if (searchParams?.get("pending") === "true")`
)
fs.writeFileSync('app/login/page.tsx', content)
console.log('Gata!')