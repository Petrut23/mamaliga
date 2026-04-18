const fs = require('fs')
let content = fs.readFileSync('app/api/register/route.ts', 'utf8')

content = content.replace(
  `  return NextResponse.json({ ok: true })`,
  `  // Trimite email adminului
  try {
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
    })
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: '🆕 Cont nou MamaLIGA — așteaptă aprobare',
      html: \`
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
          <h2 style="color:#7c3aed">Cont nou creat pe MamaLIGA</h2>
          <p>Un utilizator nou s-a înregistrat și așteaptă aprobare:</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:bold">Nume:</td><td style="padding:8px">\${name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px">\${email}</td></tr>
          </table>
          <a href="https://mamaliga.vercel.app/admin/utilizatori" 
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
            Aprobă contul →
          </a>
        </div>
      \`
    })
  } catch (e) {
    console.error('Email admin error:', e)
  }

  return NextResponse.json({ ok: true })`
)

fs.writeFileSync('app/api/register/route.ts', content)
console.log('Gata!')