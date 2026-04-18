const fs = require('fs')
let content = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')

content = content.replace(
  `console.log("Emailuri trimise catre", users.length, "useri")`,
  `console.log("Emailuri trimise catre", filteredUsers.length, "useri")`
)

fs.writeFileSync('app/api/admin/etape/route.ts', content)
console.log('Gata!')