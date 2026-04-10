const fs = require('fs')
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8')

schema = schema.replace(
  `  role          Role     @default(USER)`,
  `  role          Role     @default(USER)
  isApproved    Boolean  @default(false)`
)

fs.writeFileSync('prisma/schema.prisma', schema)
console.log('Gata!')