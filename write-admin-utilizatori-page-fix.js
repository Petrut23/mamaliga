const fs = require('fs')

const content = `"use client"
import { useState, useEffect } from "react"

const ROLE_COLORS: any = {
  USER: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  ADMIN: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  SUPER_ADMIN: "text-[#e8ff47] bg-[#e8ff47]/10 border-[#e8ff47]/20",
}

export default function UtilizatoriPage() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/utilizatori').then(r => r.json()).then(d => setUsers(d.users || []))
  }, [])

  async function handleApprove(userId: string) {
    await fetch('/api/admin/utilizatori', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'approve' })
    })
    setUsers(users.map(u => u.id === userId ? { ...u, isApproved: true } : u))
  }

  async function handleRoleChange(userId: string, role: string) {
    await fetch('/api/admin/utilizatori', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'role', role })
    })
    setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
  }

  async function handleDelete(userId: string) {
    if (!confirm('Sigur vrei sa stergi acest utilizator?')) return
    await fetch('/api/admin/utilizatori', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    setUsers(users.filter(u => u.id !== userId))
  }

  const pending = users.filter(u => !u.isApproved)
  const approved = users.filter(u => u.isApproved)

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">Admin</div>
            <div className="text-2xl font-black">Utilizatori</div>
          </div>
          <a href="/admin" className="text-sm text-gray-400 hover:text-white">← Dashboard</a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* Conturi in asteptare */}
        {pending.length > 0 && (
          <div>
            <div className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-3">
              ⏳ Asteapta aprobare ({pending.length})
            </div>
            <div className="space-y-2">
              {pending.map(user => (
                <div key={user.id} className="bg-orange-500/05 border border-orange-500/20 rounded-xl px-5 py-4 flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      Inregistrat: {new Date(user.createdAt).toLocaleDateString('ro-RO')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => handleApprove(user.id)}
                      className="text-sm px-4 py-2 rounded-lg font-bold bg-green-500 text-white hover:bg-green-600 transition-colors">
                      ✓ Aprobă
                    </button>
                    <button onClick={() => handleDelete(user.id)}
                      className="text-sm px-4 py-2 rounded-lg font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors">
                      Șterge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Utilizatori aprobati */}
        <div>
          <div className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">
            Utilizatori aprobați ({approved.length})
          </div>
          <div className="space-y-2">
            {approved.map(user => (
              <div key={user.id} className="bg-[#111520] border border-[#1e2640] rounded-xl px-5 py-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    Inregistrat: {new Date(user.createdAt).toLocaleDateString('ro-RO')}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={"text-xs font-bold px-2 py-1 rounded-lg border " + ROLE_COLORS[user.role]}>
                    {user.role}
                  </span>
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    className="text-xs bg-[#1e2640] text-white border border-[#1e2640] rounded-lg px-2 py-1">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                  <button onClick={() => handleDelete(user.id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors">
                    Șterge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}`

fs.writeFileSync('app/admin/utilizatori/page.tsx', content)
console.log('Gata!')