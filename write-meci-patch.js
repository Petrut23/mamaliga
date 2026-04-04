const fs = require('fs')
let content = fs.readFileSync('app/api/admin/meciuri/route.ts', 'utf8')
const patch = `
export async function PATCH(req: NextRequest) {
  const { id, homeTeam, awayTeam, competitionName, kickoffAt } = await req.json()
  const meci = await prisma.match.update({
    where: { id },
    data: { homeTeam, awayTeam, competitionName, kickoffAt: new Date(kickoffAt) }
  })
  return NextResponse.json({ meci })
}`
fs.writeFileSync('app/api/admin/meciuri/route.ts', content + patch)
console.log('Gata!')