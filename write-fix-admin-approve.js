const fs = require('fs')
let content = fs.readFileSync('app/api/admin/utilizatori/route.ts', 'utf8')

// Adaugam endpoint PATCH pentru aprobare
content = content.replace(
  `export async function DELETE`,
  `export async function PATCH(req: Request) {
  const { userId, action, role } = await req.json()
  
  if (action === "approve") {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true }
    })
    
    // Trimite email utilizatorului
    try {
      const nodemailer = require('nodemailer')
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
      })
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: '✅ Contul tău MamaLIGA a fost aprobat!',
        html: \`
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
            <h2 style="color:#7c3aed">Bine ai venit în MamaLIGA! 🎉</h2>
            <p>Salut <b>\${user.name}</b>,</p>
            <p>Contul tău a fost aprobat și poți intra acum în aplicație.</p>
            <a href="https://mamaliga.vercel.app/login"
               style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
              Intră în MamaLIGA →
            </a>
          </div>
        \`
      })
    } catch (e) {
      console.error('Email user error:', e)
    }
    
    return NextResponse.json({ ok: true })
  }
  
  if (action === "role") {
    await prisma.user.update({ where: { id: userId }, data: { role } })
    return NextResponse.json({ ok: true })
  }
  
  return NextResponse.json({ error: "Actiune invalida" }, { status: 400 })
}

export async function DELETE`
)

fs.writeFileSync('app/api/admin/utilizatori/route.ts', content)
console.log('Gata API!')

// Acum actualizam pagina de utilizatori sa arate butonul Aproba
let page = fs.readFileSync('app/admin/utilizatori/page.tsx', 'utf8')

// Adaugam butonul Aproba langa fiecare user neaprobat
page = page.replace(
  `          <button onClick={() => handleRoleChange(user.id, "ADMIN")}`,
  `          {!user.isApproved && (
              <button onClick={() => handleApprove(user.id)}
                className="text-xs px-3 py-1.5 rounded-lg font-bold bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors">
                ✓ Aprobă
              </button>
            )}
          <button onClick={() => handleRoleChange(user.id, "ADMIN")}`
)

// Adaugam functia handleApprove
page = page.replace(
  `  async function handleRoleChange(userId: string, role: string) {`,
  `  async function handleApprove(userId: string) {
    await fetch('/api/admin/utilizatori', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'approve' })
    })
    setUsers(users.map(u => u.id === userId ? { ...u, isApproved: true } : u))
  }

  async function handleRoleChange(userId: string, role: string) {`
)

// Adaugam isApproved in fetch users
page = page.replace(
  `    fetch('/api/admin/utilizatori').then(r => r.json()).then(d => setUsers(d.users || []))`,
  `    fetch('/api/admin/utilizatori').then(r => r.json()).then(d => setUsers(d.users || []))`
)

fs.writeFileSync('app/admin/utilizatori/page.tsx', page)
console.log('Gata pagina!')