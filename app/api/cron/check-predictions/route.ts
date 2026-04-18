import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const round = await prisma.round.findFirst({
      where: { status: "OPEN" },
      include: { matches: true }
    })

    if (!round) return NextResponse.json({ message: "Nicio etapa OPEN" })

    const totalMatches = round.matches.length
    if (totalMatches === 0) return NextResponse.json({ message: "Etapa fara meciuri" })

    const matchIds = round.matches.map(m => m.id)

    const users = await prisma.user.findMany({
      where: { isApproved: true },
      select: { id: true, name: true, email: true }
    })

    const missingUsers: any[] = []
    for (const user of users) {
      const count = await prisma.prediction.count({
        where: { userId: user.id, matchId: { in: matchIds } }
      })
      if (count === 0) {
        missingUsers.push(user)
      }
    }

    if (missingUsers.length === 0) {
      return NextResponse.json({ message: "Toti au predictii!" })
    }

    const deadline = new Date(round.deadlineAt).toLocaleString("ro-RO", {
      timeZone: "Europe/Bucharest",
      weekday: "long",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit"
    })

    // Trimite Discord
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (webhookUrl) {
      const missingText = missingUsers.map(u => `• **${u.name}**`).join("\n")
      const message = {
        embeds: [{
          title: `⚠️ Atenție! Nu și-au pus încă predicțiile`,
          description: `Pentru **${round.title}**:\n\n${missingText}`,
          color: 0xff9500,
          fields: [
            { name: "⏰ Deadline", value: deadline, inline: false },
            { name: "🔗 Link", value: "[Pune-ți predicțiile acum](https://mamaliga.vercel.app/predictii)", inline: false }
          ]
        }]
      }
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
      })
    }

    // Trimite emailuri
    const gmailUser = process.env.GMAIL_USER
    const gmailPass = process.env.GMAIL_PASS
    if (gmailUser && gmailPass) {
      const usersWithPref = await prisma.$queryRaw`SELECT email, "receiveEmails" FROM "User"` as any[]
      const nodemailer = require("nodemailer")
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass }
      })

      for (const user of missingUsers) {
        const pref = usersWithPref.find((p: any) => p.email === user.email)
        if (pref && pref.receiveEmails === false) continue

        await transporter.sendMail({
          from: `MamaLIGA <${gmailUser}>`,
          to: user.email,
          subject: `⚠️ Nu ai pus încă predicțiile pentru ${round.title}!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0d14; color: white; padding: 40px; border-radius: 12px;">
              <h1 style="color: #e8ff47; font-size: 28px; margin-bottom: 8px;">MamaLIGA</h1>
              <h2 style="color: white; font-size: 22px; margin-bottom: 16px;">⚠️ Nu ai pus încă predicțiile!</h2>
              <p style="color: #9ca3af; font-size: 16px;">Salut ${user.name}!</p>
              <p style="color: #9ca3af; font-size: 16px;">Nu ai pus încă predicțiile pentru <strong style="color: white;">${round.title}</strong>.</p>
              <div style="background: #111520; border: 1px solid #1e2640; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="color: #9ca3af; margin: 0;">⏰ <strong style="color: white;">Deadline:</strong> ${deadline}</p>
              </div>
              <a href="https://mamaliga.vercel.app/predictii" style="display: inline-block; background: #e8ff47; color: black; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px;">
                Pune-ți predicțiile acum →
              </a>
              <p style="color: #4b5563; font-size: 14px; margin-top: 32px;">Nu lăsa echipa fără căpitan! 🎯</p>
            </div>
          `
        })
      }
    }

    return NextResponse.json({ message: "Gata!", missingUsers: missingUsers.map(u => u.name) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}