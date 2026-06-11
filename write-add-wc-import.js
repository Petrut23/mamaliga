const fs = require('fs')
let content = fs.readFileSync('app/admin/meciuri/page.tsx', 'utf8')

// Adaugam state pentru import WC
content = content.replace(
  `  const [showImport, setShowImport] = useState(false)`,
  `  const [showImport, setShowImport] = useState(false)
  const [showImportWC, setShowImportWC] = useState(false)
  const [wcDateFrom, setWcDateFrom] = useState("")
  const [wcDateTo, setWcDateTo] = useState("")
  const [wcMatches, setWcMatches] = useState<any[]>([])
  const [selectedWcMatches, setSelectedWcMatches] = useState<string[]>([])`
)

// Adaugam functia de fetch WC
content = content.replace(
  `  async function importSelected() {`,
  `  async function fetchWCMatches() {
    if (!wcDateFrom || !wcDateTo) { setMsg("Selecteaza intervalul de date!"); return }
    setImportLoading(true)
    const res = await fetch("/api/admin/import-wc?dateFrom=" + wcDateFrom + "&dateTo=" + wcDateTo)
    const data = await res.json()
    setWcMatches(data.matches || [])
    setImportLoading(false)
  }

  function toggleWcMatch(id: string) {
    setSelectedWcMatches(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function importWCSelected() {
    if (!selectedRound) { setMsg("Selecteaza o etapa!"); return }
    if (selectedWcMatches.length === 0) { setMsg("Selecteaza cel putin un meci!"); return }
    const toImport = wcMatches.filter(m => selectedWcMatches.includes(m.externalApiId))
    let count = 0
    for (const meci of toImport) {
      const res = await fetch("/api/admin/meciuri", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...meci, roundId: selectedRound }) })
      if (res.ok) count++
    }
    setMsg(count + " meciuri WC importate!")
    setSelectedWcMatches([])
    setShowImportWC(false)
    loadMeciuri()
  }

  async function importSelected() {`
)

// Adaugam butonul Import WC langa Import API
content = content.replace(
  `              <button onClick={() => { setShowImport(!showImport); setShowForm(false); setEditingMeci(null) }} className="bg-[#111520] border border-[#e8ff47]/40 text-[#e8ff47] font-bold px-4 py-2 rounded-lg hover:bg-[#e8ff47]/10 transition-colors text-sm">📥 Import API</button>`,
  `              <button onClick={() => { setShowImport(!showImport); setShowForm(false); setEditingMeci(null); setShowImportWC(false) }} className="bg-[#111520] border border-[#e8ff47]/40 text-[#e8ff47] font-bold px-4 py-2 rounded-lg hover:bg-[#e8ff47]/10 transition-colors text-sm">📥 Import API</button>
              <button onClick={() => { setShowImportWC(!showImportWC); setShowForm(false); setEditingMeci(null); setShowImport(false) }} className="bg-[#111520] border border-blue-400/40 text-blue-400 font-bold px-4 py-2 rounded-lg hover:bg-blue-400/10 transition-colors text-sm">🌍 Import WC</button>`
)

// Adaugam sectiunea de import WC dupa sectiunea de import API
content = content.replace(
  `        {showForm && (`,
  `        {showImportWC && (
          <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Import meciuri World Cup din bzzoiro</h2>
            <div className="flex gap-4 mb-4 flex-wrap items-end">
              <div><label className="block text-sm text-gray-400 mb-1">De la data</label><input type="date" value={wcDateFrom} onChange={e => setWcDateFrom(e.target.value)} className="bg-[#0a0d14] border border-[#1e2640] text-white rounded-lg px-3 py-2 cursor-pointer" style={{colorScheme: "dark"}} /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Pana la data</label><input type="date" value={wcDateTo} onChange={e => setWcDateTo(e.target.value)} className="bg-[#0a0d14] border border-[#1e2640] text-white rounded-lg px-3 py-2 cursor-pointer" style={{colorScheme: "dark"}} /></div>
              <button onClick={fetchWCMatches} disabled={importLoading} className="bg-blue-500 text-white font-bold px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 whitespace-nowrap">{importLoading ? "Se incarca..." : "Cauta meciuri WC"}</button>
            </div>
            {wcMatches.length > 0 && (
              <>
                <div className="space-y-1 mb-4">
                  {wcMatches.map((m: any) => (
                    <div key={m.externalApiId} onClick={() => toggleWcMatch(m.externalApiId)}
                      className={"flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-colors " + (selectedWcMatches.includes(m.externalApiId) ? "bg-[#e8ff47]/10 border-[#e8ff47]/40" : "bg-[#0a0d14] border-[#1e2640] hover:border-gray-600")}>
                      <div className="flex items-center gap-3">
                        <div className={"w-4 h-4 rounded border-2 flex items-center justify-center " + (selectedWcMatches.includes(m.externalApiId) ? "border-[#e8ff47] bg-[#e8ff47]" : "border-gray-600")}>
                          {selectedWcMatches.includes(m.externalApiId) && <span className="text-black text-xs font-bold">✓</span>}
                        </div>
                        <span className="font-semibold text-sm">🌍 {m.homeTeam} vs {m.awayTeam}</span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(m.kickoffAt).toLocaleString("ro-RO")}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#1e2640]">
                  <span className="text-sm text-gray-400">{selectedWcMatches.length} selectate</span>
                  <button onClick={importWCSelected} disabled={selectedWcMatches.length === 0} className="bg-[#e8ff47] text-black font-bold px-6 py-2 rounded-lg disabled:opacity-50">Importa selectate</button>
                </div>
              </>
            )}
          </div>
        )}

        {showForm && (`
)

fs.writeFileSync('app/admin/meciuri/page.tsx', content)
console.log('Gata!')