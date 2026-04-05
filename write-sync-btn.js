const fs = require('fs')

const content = `"use client"
import { useState } from "react"

export default function SyncButton() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  async function sync() {
    setLoading(true)
    setMsg("")
    const res = await fetch("/api/admin/sync-scoruri")
    const data = await res.json()
    setMsg(data.ok ? "✅ Sync complet!" : "❌ Eroare sync")
    setLoading(false)
  }

  return (
    <div>
      <button onClick={sync} disabled={loading} className="bg-[#e8ff47] text-black font-bold px-6 py-2.5 rounded-lg hover:bg-[#f5ff6e] transition-colors disabled:opacity-50">
        {loading ? "Se sincronizeaza..." : "🔄 Sync manual acum"}
      </button>
      {msg && <p className="mt-3 text-sm font-semibold text-green-400">{msg}</p>}
    </div>
  )
}`

fs.writeFileSync('app/admin/SyncButton.tsx', content)

let admin = fs.readFileSync('app/admin/page.tsx', 'utf8')
admin = admin.replace(
  `import { authOptions } from "@/pages/api/auth/[...nextauth]"`,
  `import { authOptions } from "@/pages/api/auth/[...nextauth]"\nimport SyncButton from "./SyncButton"`
)
fs.writeFileSync('app/admin/page.tsx', admin)
console.log('Gata!')