const fs = require('fs')

let schema = fs.readFileSync('prisma/schema.prisma', 'utf8')

// Verificam daca nu e deja adaugat
if (!schema.includes('UserBadge')) {
  const badgeModel = `
model UserBadge {
  id        String   @id @default(cuid())
  userId    String
  badge     String
  earnedAt  DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, badge])
  @@map("UserBadge")
}`

  schema = schema + badgeModel

  schema = schema.replace(
    `  predictions     Prediction[]`,
    `  predictions     Prediction[]
  badges          UserBadge[]`
  )

  fs.writeFileSync('prisma/schema.prisma', schema)
  console.log('Schema actualizata!')
} else {
  console.log('UserBadge deja exista in schema!')
}