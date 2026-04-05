const fs = require('fs')
let content = fs.readFileSync('app/admin/etape/page.tsx', 'utf8')

content = content.replace(
  `deadlineAt: new Date(form.deadlineAt).toISOString()`,
  `deadlineAt: new Date(new Date(form.deadlineAt).getTime() - 3 * 60 * 60 * 1000).toISOString()`
)

fs.writeFileSync('app/admin/etape/page.tsx', content)
console.log('Gata!')