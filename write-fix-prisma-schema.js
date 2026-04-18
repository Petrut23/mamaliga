const fs = require('fs')
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8')

// Adauga isApproved daca nu exista deja
if (!schema.includes('isApproved')) {
  schema = schema.replace(
    `  receiveEmails Boolean  @default(true)`,
    `  receiveEmails Boolean  @default(true)
  isApproved    Boolean  @default(false)`
  )
  fs.writeFileSync('prisma/schema.prisma', schema)
  console.log('Schema actualizata!')
} else {
  console.log('isApproved exista deja!')
}