const fs = require('fs')

// Instalam resend
const { execSync } = require('child_process')
try {
  execSync('npm install resend', { stdio: 'inherit' })
} catch(e) {
  console.log('Resend instalat deja sau eroare')
}

// Adaugam functia de email in etape API
let etapeApi = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')

const resendFunction = `
async function sendEmailNotifications(round: any) {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !fromEmail) return

  const deadline = new Date(round.deadlineAt).toLocaleString("ro-RO", {
    timeZone: "Europe/Bucharest",
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  })

  try {
    const users = await prisma.user.findMany({
      select: { email: true, name: true }
    })

    for (const user of users) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": \`Bearer \${apiKey}\`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: fromEmail,
          to: user.email,
          subject: \`🏆 \${round.title} este LIVE!\`,
          html: \`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0d14; color: white; padding: 40px; border-radius: 12px;">
              <h1 style="color: #e8ff47; font-size: 28px; margin-bottom: 8px;">MamaLIGA</h1>
              <h2 style="color: white; font-size: 22px; margin-bottom: 16px;">🏆 \${round.title} este LIVE!</h2>
              <p style="color: #9ca3af; font-size: 16px;">Salut \${user.name}!</p>
              <p style="color: #9ca3af; font-size: 16px;">E timpul să îți pui predicțiile pentru <strong style="color: white;">\${round.title}</strong>!</p>
              <div style="background: #111520; border: 1px solid #1e2640; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="color: #9ca3af; margin: 0 0 8px 0;">⏰ <strong style="color: white;">Deadline:</strong> \${deadline}</p>
              </div>
              <a href="https://mamaliga.vercel.app" style="display: inline-block; background: #e8ff47; color: black; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px;">
                Intră pe MamaLIGA →
              </a>
              <p style="color: #4b5563; font-size: 14px; margin-top: 32px;">Mult succes! 🎯</p>
            </div>
          \`
        })
      })
    }
    console.log("Emailuri trimise catre", users.length, "useri")
  } catch (err) {
    console.error("Eroare trimitere emailuri:", err)
  }
}`

etapeApi = etapeApi + resendFunction

// Adaugam apelul la sendEmailNotifications cand status devine OPEN
etapeApi = etapeApi.replace(
  `  if (status === "OPEN") {
    await sendDiscordNotification(etapa)
  }`,
  `  if (status === "OPEN") {
    await sendDiscordNotification(etapa)
    await sendEmailNotifications(etapa)
  }`
)

fs.writeFileSync('app/api/admin/etape/route.ts', etapeApi)
console.log('Gata!')