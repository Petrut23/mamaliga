const fs = require('fs')

const content = `import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, isApproved: true, createdAt: true }
  })
  return NextResponse.json({ users })
}

export async function PATCH(req: Request) {
  const { userId, action, role } = await req.json()

  if (action === "approve") {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true }
    })
    try {
      const nodemailer = require('nodemailer')
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
      })
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: 'Contul tau MamaLIGA a fost aprobat!',
        html: \`<div style="font-family:sans-serif;max-width:500px;margin:0 auto">
          <h2 style="color:#7c3aed">Bine ai venit in MamaLIGA!</h2>
          <p>Salut <b>\${user.name}</b>,</p>
          <p>Contul tau a fost aprobat si poti intra acum in aplicatie.</p>
          <a href="https://mamaliga.vercel.app/login"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px;font-weight:bold">
            Intra in MamaLIGA
          </a>
        </div>\`
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

export async function DELETE(req: Request) {
  const { userId } = await req.json()
  await prisma.user.delete({ where: { id: userId } })
  return NextResponse.json({ ok: true })
}`

fs.writeFileSync('app/api/admin/utilizatori/route.ts', content)
console.log('Gata!')