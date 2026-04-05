"use client"
import { useState, useEffect } from "react"

const ROLE_COLORS: any = {
  USER: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  ADMIN: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  SUPER_ADMIN: "text-[#e8ff47] bg-[#e8ff47]/10 border-[#e8ff47]/20",
}

export default function AdminUtilizatoriPage() {
  const [utilizatori, setUtilizatori] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    fetch("/api/admin/utilizatori").then(r => r.json()).then(d => {
      setUtilizatori(d.utilizatori || [])
      setLoading(false)
    })
  }, [])

  async function updateRole(id: string, role: string) {
    await fetch("/api/admin/utilizatori", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role })
    })
    setUtilizatori((prev: any) => prev.map((u: any) => u.id === id ? { ...u, role } : u))
    setMsg("Rol actualizat!")
    setTimeout(() => setMsg(""), 3000)
  }

  async function deleteUser(id: string, name: string) {
    if (!confirm("Sigur vrei sa stergi userul " + name + "?")) return
    await fetch("/api/admin/utilizatori?id=" + id, { method: "DELETE" })
    setUtilizatori((prev: any) => prev.filter((u: any) => u.id !== id))
    setMsg("User sters!")
    setTimeout(() => setMsg(""), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-1">Utilizatori</h1>
          <p className="text-gray-500 text-sm">Gestioneaza utilizatorii aplicatiei</p>
        </div>

        {msg && <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-400 text-sm mb-6">{msg}</div>}

        {loading ? <div className="text-gray-500 text-center py-20">Se incarca...</div> : (
          <div className="space-y-3">
            {utilizatori.map((user: any) => (
              <div key={user.id} className="bg-[#111520] border border-[#1e2640] rounded-xl px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{user.email}</div>
                  <div className="text-xs text-gray-600 mt-0.5">Inregistrat: {new Date(user.createdAt).toLocaleDateString("ro-RO")}</div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={"text-xs font-bold px-3 py-1 rounded-full border " + ROLE_COLORS[user.role]}>{user.role}</span>
                  <select value={user.role} onChange={e => updateRole(user.id, e.target.value)} className="bg-[#0a0d14] border border-[#1e2640] text-gray-400 text-xs rounded-lg px-2 py-1">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                  <button onClick={() => deleteUser(user.id, user.name)} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg hover:bg-red-500/20 transition-colors">Sterge</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}