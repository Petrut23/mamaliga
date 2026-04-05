const fs = require('fs')

// Update sync-scoruri sa auto-completeze etapa
let sync = fs.readFileSync('app/api/admin/sync-scoruri/route.ts', 'utf8')

sync = sync.replace(
  `export async function GET() {
  try {
    await syncFootballData()
    await syncLiga1()
    await calculeazaToatePunctele()
    return NextResponse.json({ ok: true, message: "Sync complet" })`,
  `export async function GET() {
  try {
    await syncFootballData()
    await syncLiga1()
    await calculeazaToatePunctele()
    await autoCompleteEtape()
    return NextResponse.json({ ok: true, message: "Sync complet" })`
)

const autoComplete = `
async function autoCompleteEtape() {
  const rounds = await prisma.round.findMany({
    where: { status: { in: ["LOCKED", "LIVE"] } }
  })

  for (const round of rounds) {
    const matches = await prisma.match.findMany({ where: { roundId: round.id } })
    if (matches.length === 0) continue
    const allFinished = matches.every(m => m.status === "FINISHED")
    if (allFinished) {
      await prisma.round.update({ where: { id: round.id }, data: { status: "COMPLETED" } })
      console.log("Etapa completata automat:", round.id)
    }
  }
}`

sync = sync + autoComplete
fs.writeFileSync('app/api/admin/sync-scoruri/route.ts', sync)

// Update pagina live sa afiseze mesaj de final
let live = fs.readFileSync('app/live/page.tsx', 'utf8')

live = live.replace(
  `  if (!data?.round) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⏳</div>
        <div className="text-xl font-bold text-white mb-2">Etapa nu a inceput inca</div>
        <div className="text-gray-500 mb-6">Pagina live se activeaza dupa inchiderea predictiilor</div>
        <a href="/" className="text-[#e8ff47] hover:underline">← Inapoi acasa</a>
      </div>
    </div>
  )`,
  `  if (!data?.round) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⏳</div>
        <div className="text-xl font-bold text-white mb-2">Etapa nu a inceput inca</div>
        <div className="text-gray-500 mb-6">Pagina live se activeaza dupa inchiderea predictiilor</div>
        <a href="/" className="text-[#e8ff47] hover:underline">← Inapoi acasa</a>
      </div>
    </div>
  )

  if (data?.round?.status === "COMPLETED" && data.matches.every((m: any) => m.status === "FINISHED")) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-7xl mb-6">🏆</div>
        <div className="text-3xl font-black text-white mb-3">Etapa s-a incheiat!</div>
        <div className="text-gray-400 mb-2">{data.round.title} a fost finalizata.</div>
        <div className="text-gray-500 text-sm mb-8">Toate meciurile au fost jucate. Verifica pe ce loc te afli!</div>
        <a href="/clasament" className="bg-[#e8ff47] text-black font-black px-8 py-3 rounded-xl hover:bg-[#f5ff6e] transition-colors inline-block">
          Vezi Clasamentul Final 🏆
        </a>
        <div className="mt-4">
          <a href="/" className="text-gray-500 text-sm hover:text-white">← Inapoi acasa</a>
        </div>
      </div>
    </div>
  )`
)

fs.writeFileSync('app/live/page.tsx', live)
console.log('Gata!')