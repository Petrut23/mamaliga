const fs = require('fs')
let content = fs.readFileSync('pages/api/auth/[...nextauth].ts', 'utf8')

content = content.replace(
  `      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.passwordHash) return null
        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      }`,
  `      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.passwordHash) return null
        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null
        if (!user.isApproved) throw new Error("PENDING_APPROVAL")
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      }`
)

fs.writeFileSync('pages/api/auth/[...nextauth].ts', content)
console.log('Gata!')