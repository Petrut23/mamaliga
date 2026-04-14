const fs = require('fs')
let content = fs.readFileSync('app/admin/utilizatori/page.tsx', 'utf8')

content = content.replace(
  `  async function updateRole(id: string, role: string) {
    await fetch("/api/admin/utilizatori", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role })
    })
    setUtilizatori((prev: any) => prev.map((u: any) => u.id === id ? { ...u, role } : u))
    setMsg("Rol actualizat!")
    setTimeout(() => setMsg(""), 3000)
  }`,
  `  async function updateRole(id: string, role: string) {
    await fetch("/api/admin/utilizatori", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role })
    })
    setUtilizatori((prev: any) => prev.map((u: any) => u.id === id ? { ...u, role } : u))
    setMsg("Rol actualizat!")
    setTimeout(() => setMsg(""), 3000)
  }

  async function toggleEmail(id: string, receiveEmails: boolean) {
    await fetch("/api/admin/utilizatori", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, receiveEmails })
    })
    setUtilizatori((prev: any) => prev.map((u: any) => u.id === id ? { ...u, receiveEmails } : u))
    setMsg(receiveEmails ? "Email-uri activate!" : "Email-uri dezactivate!")
    setTimeout(() => setMsg(""), 3000)
  }`
)

content = content.replace(
  `                  <button onClick={() => deleteUser(user.id, user.name)} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg hover:bg-red-500/20 transition-colors">Sterge</button>`,
  `                  <button onClick={() => toggleEmail(user.id, !user.receiveEmails)}
                    className={"text-xs px-3 py-1 rounded-lg border transition-colors " + (user.receiveEmails ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20")}>
                    {user.receiveEmails ? "📧 Email ON" : "📧 Email OFF"}
                  </button>
                  <button onClick={() => deleteUser(user.id, user.name)} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg hover:bg-red-500/20 transition-colors">Sterge</button>`
)

fs.writeFileSync('app/admin/utilizatori/page.tsx', content)
console.log('Gata!')