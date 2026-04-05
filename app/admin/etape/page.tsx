"use client"
import { useState, useEffect } from "react"

export default function AdminEtapePage() {
  const [etape, setEtape] = useState<any[]>([])
  const [sezoane, setSezoane] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEtapa, setEditingEtapa] = useState<any>(null)
  const [form, setForm] = useState({ seasonId: "", roundNumber: "", title: "", deadlineAt: "" })
  const [msg, setMsg] = useState("")

  useEffect(() => {
    fetch("/api/admin/sezoane").then(r => r.json()).then(d => setSezoane(d.sezoane || []))
    loadEtape()
  }, [])

  function loadEtape() {
    fetch("/api/admin/etape").then(r => r.json()).then(d => { setEtape(d.etape || []); setLoading(false) })
  }

  function startEdit(etapa: any) {
    setEditingEtapa(etapa)
    const deadline = new Date(etapa.deadlineAt)
    const offset = deadline.getTimezoneOffset() * 60000
    const localDeadline = new Date(deadline.getTime() - offset).toISOString().slice(0, 16)
    setForm({
      seasonId: etapa.seasonId,
      roundNumber: String(etapa.roundNumber),
      title: etapa.title,
      deadlineAt: localDeadline
    })
    setShowForm(true)
  }

  function cancelEdit() {
    setEditingEtapa(null)
    setForm({ seasonId: "", roundNumber: "", title: "", deadlineAt: "" })
    setShowForm(false)
  }

  async function saveEtapa(e: any) {
    e.preventDefault()
    if (editingEtapa) {
      const res = await fetch("/api/admin/etape", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingEtapa.id, ...form, roundNumber: parseInt(form.roundNumber), deadlineAt: new Date(new Date(form.deadlineAt).getTime() - 3 * 60 * 60 * 1000).toISOString() })
      })
      if (res.ok) {
        setMsg("Etapa actualizata!")
        cancelEdit()
        loadEtape()
      }
    } else {
      const res = await fetch("/api/admin/etape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        setMsg("Etapa creata!")
        setShowForm(false)
        setEtape((prev: any) => [data.etapa, ...prev])
      }
    }
  }

  async function deleteEtapa(id: string) {
    if (!confirm("Sigur vrei sa stergi aceasta etapa?")) return
    const res = await fetch(`/api/admin/etape?id=${id}`, { method: "DELETE" })
    if (res.ok) {
      setEtape((prev: any) => prev.filter((e: any) => e.id !== id))
      setMsg("Etapa stearsa!")
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/etape", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    })
    setEtape((prev: any) => prev.map((e: any) => e.id === id ? { ...e, status } : e))
  }

  const statusColors: any = {
    DRAFT: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    OPEN: "text-green-400 bg-green-400/10 border-green-400/20",
    LOCKED: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    LIVE: "text-red-400 bg-red-400/10 border-red-400/20",
    COMPLETED: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between">
        <div className="text-2xl font-black tracking-widest">Mama<span className="text-[#e8ff47]">LIGA</span> <span className="text-sm font-normal text-gray-500">Admin</span></div>
        <div className="flex gap-4 text-sm">
          <a href="/admin" className="text-gray-500 hover:text-white">Dashboard</a>
          <a href="/admin/etape" className="text-[#e8ff47]">Etape</a>
          <a href="/admin/meciuri" className="text-gray-500 hover:text-white">Meciuri</a>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black mb-1">Etape</h1>
            <p className="text-gray-500 text-sm">Gestioneaza etapele sezonului</p>
          </div>
          <button onClick={() => { cancelEdit(); setShowForm(!showForm) }} className="bg-[#e8ff47] text-black font-bold px-5 py-2.5 rounded-lg hover:bg-[#f5ff6e] transition-colors">
            + Etapa noua
          </button>
        </div>

        {msg && <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-400 text-sm mb-6">{msg}</div>}

        {showForm && (
          <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">{editingEtapa ? "Editeaza etapa" : "Etapa noua"}</h2>
            <form onSubmit={saveEtapa} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sezon</label>
                <select value={form.seasonId} onChange={e => setForm({...form, seasonId: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" required>
                  <option value="">Selecteaza sezon</option>
                  {sezoane.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Numar etapa</label>
                <input type="number" value={form.roundNumber} onChange={e => setForm({...form, roundNumber: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Titlu</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Deadline</label>
                <input type="datetime-local" value={form.deadlineAt} onChange={e => setForm({...form, deadlineAt: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" required />
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="submit" className="bg-[#e8ff47] text-black font-bold px-5 py-2 rounded-lg">{editingEtapa ? "Salveaza" : "Creeaza"}</button>
                <button type="button" onClick={cancelEdit} className="bg-[#111520] border border-[#1e2640] text-gray-400 px-5 py-2 rounded-lg">Anuleaza</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-gray-500 text-center py-20">Se incarca...</div>
        ) : etape.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Nu exista etape. Creeaza prima etapa!</div>
        ) : (
          <div className="space-y-3">
            {etape.map((etapa: any) => (
              <div key={etapa.id} className="bg-[#111520] border border-[#1e2640] rounded-xl px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="font-bold text-white">{etapa.title}</div>
                  <div className="text-sm text-gray-500 mt-0.5">Deadline: {new Date(etapa.deadlineAt).toLocaleString("ro-RO")} · {etapa._count?.matches || 0} meciuri</div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColors[etapa.status]}`}>{etapa.status}</span>
                  <select value={etapa.status} onChange={e => updateStatus(etapa.id, e.target.value)} className="bg-[#0a0d14] border border-[#1e2640] text-gray-400 text-xs rounded-lg px-2 py-1">
                    <option value="DRAFT">DRAFT</option>
                    <option value="OPEN">OPEN</option>
                    <option value="LOCKED">LOCKED</option>
                    <option value="LIVE">LIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                  <button onClick={() => startEdit(etapa)} className="text-xs bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-3 py-1 rounded-lg hover:bg-[#3b82f6]/20 transition-colors">Edit</button>
                  <a href={`/admin/meciuri?roundId=${etapa.id}`} className="text-xs bg-[#e8ff47]/10 text-[#e8ff47] border border-[#e8ff47]/20 px-3 py-1 rounded-lg hover:bg-[#e8ff47]/20">Meciuri</a>
                  <button onClick={() => deleteEtapa(etapa.id)} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg hover:bg-red-500/20 transition-colors">Sterge</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}