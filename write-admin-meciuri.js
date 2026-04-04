const fs = require('fs')

// Pagina meciuri admin
const meciuriPage = `"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function MeciuriContent() {
  const searchParams = useSearchParams()
  const roundId = searchParams.get("roundId") || ""
  const [meciuri, setMeciuri] = useState([])
  const [etape, setEtape] = useState([])
  const [selectedRound, setSelectedRound] = useState(roundId)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState("")
  const [form, setForm] = useState({
    homeTeam: "", awayTeam: "", competitionName: "", kickoffAt: ""
  })

  useEffect(() => {
    fetch("/api/admin/etape").then(r => r.json()).then(d => setEtape(d.etape || []))
  }, [])

  useEffect(() => {
    if (selectedRound) {
      setLoading(true)
      fetch(\`/api/admin/meciuri?roundId=\${selectedRound}\`)
        .then(r => r.json())
        .then(d => { setMeciuri(d.meciuri || []); setLoading(false) })
    }
  }, [selectedRound])

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
    } else {
      setMsg(data.error || "Eroare")
    }
  }

  async function deleteMeci(id: string) {
    await fetch(\`/api/admin/meciuri?id=\${id}\`, { method: "DELETE" })
    setMeciuri((prev: any) => prev.filter((m: any) => m.id !== id))
  }

  const competitions = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Liga 1 Romania"]

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
            <p className="text-gray-500 text-sm">Adauga meciuri pentru etapa selectata</p>
          </div>
          {selectedRound && (
            <button onClick={() => setShowForm(!showForm)} className="bg-[#e8ff47] text-black font-bold px-5 py-2.5 rounded-lg hover:bg-[#f5ff6e] transition-colors">
              + Adauga meci
            </button>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Selecteaza etapa</label>
          <select value={selectedRound} onChange={e => setSelectedRound(e.target.value)} className="bg-[#111520] border border-[#1e2640] text-white rounded-lg px-4 py-2.5 min-w-64">
            <option value="">Alege etapa...</option>
            {etape.map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>

        {msg && <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-400 text-sm mb-6">{msg}</div>}

        {showForm && (
          <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Meci nou</h2>
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
          <div className="text-center py-20 text-gray-500">Nu exista meciuri pentru aceasta etapa.</div>
        ) : (
          <div className="space-y-2">
            {meciuri.map((meci: any) => (
              <div key={meci.id} className="bg-[#111520] border border-[#1e2640] rounded-xl px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 bg-[#0a0d14] px-2 py-1 rounded">{meci.competitionName}</span>
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
}`

// API meciuri
const meciuriApi = `import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
export const dynamic = "force-dynamic"
const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const roundId = req.nextUrl.searchParams.get("roundId")
  if (!roundId) return NextResponse.json({ meciuri: [] })
  const meciuri = await prisma.match.findMany({ where: { roundId }, orderBy: { kickoffAt: "asc" } })
  return NextResponse.json({ meciuri })
}

export async function POST(req: NextRequest) {
  const { roundId, homeTeam, awayTeam, competitionName, kickoffAt } = await req.json()
  const meci = await prisma.match.create({
    data: { roundId, homeTeam, awayTeam, competitionName, kickoffAt: new Date(kickoffAt) }
  })
  return NextResponse.json({ meci }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID lipsa" }, { status: 400 })
  await prisma.match.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}`

fs.writeFileSync('app/admin/meciuri/page.tsx', meciuriPage)
fs.writeFileSync('app/api/admin/meciuri/route.ts', meciuriApi)
console.log('Gata!')