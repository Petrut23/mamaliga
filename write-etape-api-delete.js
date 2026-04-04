const fs = require('fs')
let content = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')

const deleteMethod = `
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID lipsa" }, { status: 400 })
  await prisma.match.deleteMany({ where: { roundId: id } })
  await prisma.round.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}`

content = content + deleteMethod
fs.writeFileSync('app/api/admin/etape/route.ts', content)
console.log('Gata!')