import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET() {
  const etape = await prisma.round.findMany({ orderBy: { createdAt: "desc" }, include: { season: true } })
  return NextResponse.json({ etape })
}

export async function POST(req: NextRequest) {
  const { seasonId, roundNumber, title, deadlineAt } = await req.json()
  const etapa = await prisma.round.create({ data: { seasonId, roundNumber: parseInt(roundNumber), title, deadlineAt: new Date(deadlineAt) } })
  return NextResponse.json({ etapa }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const { id, status, ...rest } = await req.json()
  const etapa = await prisma.round.update({ where: { id }, data: { status, ...rest } })
  if (status === "OPEN") {
    await sendDiscordNotification(etapa)
    await sendEmailNotifications(etapa)
  }
  return NextResponse.json({ etapa })
}
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID lipsa" }, { status: 400 })
  const matches = await prisma.match.findMany({ where: { roundId: id } })
  const matchIds = matches.map(m => m.id)
  await prisma.matchPoint.deleteMany({ where: { matchId: { in: matchIds } } })
  await prisma.prediction.deleteMany({ where: { matchId: { in: matchIds } } })
  await prisma.roundRanking.deleteMany({ where: { roundId: id } })
  await prisma.match.deleteMany({ where: { roundId: id } })
  await prisma.round.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
async function sendDiscordNotification(round: any) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return

  const deadline = new Date(round.deadlineAt).toLocaleString("ro-RO", { 
    timeZone: "Europe/Bucharest",
    weekday: "long",
    day: "2-digit", 
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  })

  const message = {
    embeds: [{
      title: "🏆 " + round.title + " este LIVE!",
      description: "E timpul să îți pui predicțiile!",
      color: 0xe8ff47,
      fields: [
        {
          name: "⏰ Deadline",
          value: deadline,
          inline: false
        },
        {
          name: "🔗 Link",
          value: "[Intră pe MamaLIGA](https://mamaliga.vercel.app/predictii)",
          inline: false
        }
      ],
      footer: {
        text: "Mult succes! 🎯"
      }
    }]
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    })
  } catch (err) {
    console.error("Eroare Discord webhook:", err)
  }
}
async function sendEmailNotifications(round: any) {
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_PASS
  if (!gmailUser || !gmailPass) return

  const deadline = new Date(round.deadlineAt).toLocaleString("ro-RO", {
    timeZone: "Europe/Bucharest",
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  })

  try {
    const nodemailer = require("nodemailer")
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass }
    })

    const users = await prisma.user.findMany({
      where: { receiveEmails: true },
      select: { email: true, name: true }
    })

    for (const user of users) {
      await transporter.sendMail({
        from: `MamaLIGA <${gmailUser}>`,
        to: user.email,
        subject: `🏆 ${round.title} este LIVE!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0d14; color: white; padding: 40px; border-radius: 12px;">
            <h1 style="color: #e8ff47; font-size: 28px; margin-bottom: 8px;">MamaLIGA</h1>
            <h2 style="color: white; font-size: 22px; margin-bottom: 16px;">🏆 ${round.title} este LIVE!</h2>
            <p style="color: #9ca3af; font-size: 16px;">Salut ${user.name}!</p>
            <p style="color: #9ca3af; font-size: 16px;">E timpul să îți pui predicțiile pentru <strong style="color: white;">${round.title}</strong>!</p>
            <div style="background: #111520; border: 1px solid #1e2640; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="color: #9ca3af; margin: 0 0 8px 0;">⏰ <strong style="color: white;">Deadline:</strong> ${deadline}</p>
            </div>
            <a href="https://mamaliga.vercel.app/predictii" style="display: inline-block; background: #e8ff47; color: black; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px;">
              Intră pe MamaLIGA →
            </a>
            <p style="color: #4b5563; font-size: 14px; margin-top: 32px;">Mult succes! 🎯</p>
          </div>
        `
      })
    }
    console.log("Emailuri trimise catre", users.length, "useri")
  } catch (err) {
    console.error("Eroare trimitere emailuri:", err)
  }
}