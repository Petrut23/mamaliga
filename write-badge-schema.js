const fs = require('fs')

let schema = fs.readFileSync('prisma/schema.prisma', 'utf8')

const badgeModel = `
model UserBadge {
  id        String   @id @default(cuid())
  userId    String
  badge     String
  earnedAt  DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])

  @@unique([userId, badge])
}`

schema = schema + badgeModel

// Adaugam relatia in User model
schema = schema.replace(
  `  predictions     Prediction[]`,
  `  predictions     Prediction[]
  badges          UserBadge[]`
)

fs.writeFileSync('prisma/schema.prisma', schema)
console.log('Gata!')