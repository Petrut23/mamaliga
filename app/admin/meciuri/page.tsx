"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const COMPETITION_FLAGS: any = {
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "La Liga": "🇪🇸",
  "Serie A": "🇮🇹",
  "Bundesliga": "🇩🇪",
  "Ligue 1": "🇫🇷",
  "Liga 1 Romania": "🇷🇴",
}

function MeciuriContent() {
  const searchParams = useSearchParams()
  const roundId = searchParams?.get("roundId") || ""
  const [meciuri, setMeciuri] = useState<any[]>([])
  const [etape, setEtape] = useState<any[]>([])
  const [selectedRound, setSelectedRound] = useState(roundId)
  const [loading, setLoading] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState("")
  const [availableMatches, setAvailableMatches] = useState<any[]>([])
  const [selectedMatches, setSelectedMatches] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [form, setForm] = useState({ homeTeam: "", awayTeam: "", competitionName: "", kickoffAt: "" })

  const competitions = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Liga 1 Romania"]

  useEffect(() => {
    fetch("/api/admin/etape").then(r => r.json()).then(d => setEtape(d.etape || []))
  }, [])

  useEffect(() => {
    if (selectedRound) {
      setLoading(true)
      fetch(`/api/admin/meciuri?roundId=${selectedRound}`)
        .then(r => r.json())
        .then(d => { setMeciuri(d.meciuri || []); setLoading(false) })
    }
  }, [selectedRound])

  async function fetchAvailableMatches() {
    if (!dateFrom || !dateTo) { setMsg("Selecteaza intervalul de date!"); return }
    setImportLoading(true)
    setMsg("")
    const res = await fetch(`/api/admin/import-meciuri?dateFrom=${dateFrom}&dateTo=${dateTo}`)
    const data = await res.json()
    setAvailableMatches(data.matches || [])
    setImportLoading(false)
  }

  function toggleMatch(id: string) {
    setSelectedMatches(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function importSelected() {
    if (!selectedRound) { setMsg("Selecteaza o etapa!"); return }
    if (selectedMatches.length === 0) { setMsg("Selecteaza cel putin un meci!"); return }

    const toImport = availableMatches.filter((m: any) => selectedMatches.includes(m.externalApiId))
    let count = 0

    for (const meci of toImport) {
      const res = await fetch("/api/admin/meciuri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...meci, roundId: selectedRound })
      })
      if (res.ok) count++
    }

    setMsg(`${count} meciuri importate cu succes!`)
    setSelectedMatches([])
    setShowImport(false)
    const res = await fetch(`/api/admin/meciuri?roundId=${selectedRound}`)
    const data = await res.json()
    setMeciuri(data.meciuri || [])
  }

  async function addMeci(e: any) {
    e.preventDefault()
    const res = await fetch("/api/admin/meciuri", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, roundId: selectedRound })
    })
    const data = await res.json()
    if (res.ok) {
      setMsg("Meci adaugat!")
      setMeciuri((prev: any) => [...prev, data.meci])
      setForm({ homeTeam: "", awayTeam: "", competitionName: "", kickoffAt: "" })
      setShowForm(false)
    }
  }

  async function deleteMeci(id: string) {
    await fetch(`/api/admin/meciuri?id=${id}`, { method: "DELETE" })
    setMeciuri((prev: any) => prev.filter((m: any) => m.id !== id))
  }

  const groupedMatches = availableMatches.reduce((acc: any, m: any) => {
    if (!acc[m.competitionName]) acc[m.competitionName] = []
    acc[m.competitionName].push(m)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between">
        <div className="text-2xl font-black tracking-widest">Mama<span className="text-[#e8ff47]">LIGA</span> <span className="text-sm font-normal text-gray-500">Admin</span></div>
        <div className="flex gap-4 text-sm">
          <a href="/admin" className="text-gray-500 hover:text-white">Dashboard</a>
          <a href="/admin/etape" className="text-gray-500 hover:text-white">Etape</a>
          <a href="/admin/meciuri" className="text-[#e8ff47]">Meciuri</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black mb-1">Meciuri</h1>
            <p className="text-gray-500 text-sm">Importa sau adauga manual meciuri</p>
          </div>
          <div className="flex gap-3">
            {selectedRound && (
              <>
                <button onClick={() => { setShowImport(!showImport); setShowForm(false) }} className="bg-[#111520] border border-[#e8ff47]/40 text-[#e8ff47] font-bold px-5 py-2.5 rounded-lg hover:bg-[#e8ff47]/10 transition-colors">
                  📥 Import din API
                </button>
                <button onClick={() => { setShowForm(!showForm); setShowImport(false) }} className="bg-[#e8ff47] text-black font-bold px-5 py-2.5 rounded-lg hover:bg-[#f5ff6e] transition-colors">
                  + Manual
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Selecteaza etapa</label>
          <select value={selectedRound} onChange={e => setSelectedRound(e.target.value)} className="bg-[#111520] border border-[#1e2640] text-white rounded-lg px-4 py-2.5 min-w-64">
            <option value="">Alege etapa...</option>
            {etape.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>

        {msg && <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-400 text-sm mb-6">{msg}</div>}

        {showImport && (
          <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Import meciuri din API</h2>
            <div className="flex gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">De la data</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-[#0a0d14] border border-[#1e2640] text-white rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Pana la data</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-[#0a0d14] border border-[#1e2640] text-white rounded-lg px-3 py-2" />
              </div>
              <div className="flex items-end">
                <button onClick={fetchAvailableMatches} disabled={importLoading} className="bg-[#3b82f6] text-white font-bold px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                  {importLoading ? "Se incarca..." : "Cauta meciuri"}
                </button>
              </div>
            </div>

            {Object.keys(groupedMatches).length > 0 && (
              <>
                <div className="space-y-4 mb-4">
                  {Object.entries(groupedMatches).map(([comp, matches]: any) => (
                    <div key={comp}>
                      <div className="text-sm font-bold text-gray-400 mb-2">{COMPETITION_FLAGS[comp] || "🏆"} {comp}</div>
                      <div className="space-y-1">
                        {matches.map((m: any) => (
                          <div key={m.externalApiId} onClick={() => toggleMatch(m.externalApiId)}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-colors ${selectedMatches.includes(m.externalApiId) ? "bg-[#e8ff47]/10 border-[#e8ff47]/40" : "bg-[#0a0d14] border-[#1e2640] hover:border-gray-600"}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${selectedMatches.includes(m.externalApiId) ? "border-[#e8ff47] bg-[#e8ff47]" : "border-gray-600"}`}>
                                {selectedMatches.includes(m.externalApiId) && <span className="text-black text-xs font-bold">✓</span>}
                              </div>
                              <span className="font-semibold text-sm">{m.homeTeam} vs {m.awayTeam}</span>
                            </div>
                            <span className="text-xs text-gray-500">{new Date(m.kickoffAt).toLocaleString("ro-RO")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#1e2640]">
                  <span className="text-sm text-gray-400">{selectedMatches.length} meciuri selectate</span>
                  <button onClick={importSelected} disabled={selectedMatches.length === 0} className="bg-[#e8ff47] text-black font-bold px-6 py-2 rounded-lg disabled:opacity-50 hover:bg-[#f5ff6e] transition-colors">
                    Importa selectate
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {showForm && (
          <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Meci nou manual</h2>
            <form onSubmit={addMeci} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Echipa gazda</label>
                <input type="text" value={form.homeTeam} onChange={e => setForm({...form, homeTeam: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" placeholder="ex: Arsenal" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Echipa oaspete</label>
                <input type="text" value={form.awayTeam} onChange={e => setForm({...form, awayTeam: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" placeholder="ex: Chelsea" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Campionat</label>
                <select value={form.competitionName} onChange={e => setForm({...form, competitionName: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" required>
                  <option value="">Selecteaza...</option>
                  {competitions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data si ora</label>
                <input type="datetime-local" value={form.kickoffAt} onChange={e => setForm({...form, kickoffAt: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" required />
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="submit" className="bg-[#e8ff47] text-black font-bold px-5 py-2 rounded-lg">Adauga</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-[#111520] border border-[#1e2640] text-gray-400 px-5 py-2 rounded-lg">Anuleaza</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-gray-500 text-center py-20">Se incarca...</div>
        ) : meciuri.length === 0 && selectedRound ? (
          <div className="text-center py-20 text-gray-500">Nu exista meciuri. Importa din API sau adauga manual.</div>
        ) : (
          <div className="space-y-2">
            {meciuri.map((meci: any) => (
              <div key={meci.id} className="bg-[#111520] border border-[#1e2640] rounded-xl px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 bg-[#0a0d14] px-2 py-1 rounded">{COMPETITION_FLAGS[meci.competitionName] || "🏆"} {meci.competitionName}</span>
                  <span className="font-bold">{meci.homeTeam} vs {meci.awayTeam}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{new Date(meci.kickoffAt).toLocaleString("ro-RO")}</span>
                  <button onClick={() => deleteMeci(meci.id)} className="text-red-400 hover:text-red-300 text-sm border border-red-400/20 px-3 py-1 rounded-lg hover:bg-red-400/10 transition-colors">Sterge</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminMeciuriPage() {
  return <Suspense><MeciuriContent /></Suspense>
}