const fs = require('fs')
const path = require('path')

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return
  let content = fs.readFileSync(filePath, 'utf8')
  if (!content.includes('PrismaClient')) return
  
  content = content.replace(
    `import { PrismaClient } from "@prisma/client"\nexport const dynamic = "force-dynamic"\nconst prisma = new PrismaClient()`,
    `import { prisma } from "@/lib/prisma"\nexport const dynamic = "force-dynamic"`
  )
  content = content.replace(
    `import { PrismaClient } from "@prisma/client"\nconst prisma = new PrismaClient()`,
    `import { prisma } from "@/lib/prisma"`
  )
  content = content.replace(
    `import { PrismaClient } from "@prisma/client"\nexport const dynamic = "force-dynamic"\nconst prisma = new PrismaClient()`,
    `import { prisma } from "@/lib/prisma"\nexport const dynamic = "force-dynamic"`
  )
  
  fs.writeFileSync(filePath, content)
  console.log('Fixed:', filePath)
}

const files = [
  'app/api/admin/etape/route.ts',
  'app/api/admin/meciuri/route.ts',
  'app/api/admin/sezoane/route.ts',
  'app/api/admin/import-meciuri/route.ts',
  'app/api/admin/sync-scoruri/route.ts',
  'app/api/admin/calcul-puncte/route.ts',
  'app/api/live/route.ts',
  'app/api/rounds/current/route.ts',
  'app/api/predictions/save/route.ts',
  'app/api/predictions/my/route.ts',
  'app/api/register/route.ts',
  'pages/api/auth/[...nextauth].ts',
]

files.forEach(fixFile)
console.log('Gata!')