const fs = require('fs')

const content = `import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export const BADGES: any = {
  sniper: { icon: "🎯", name: "Sniper", desc: "3+ scoruri exacte intr-o etapa" },
  dominator: { icon: "👑", name: "Dominator", desc: "Locul 1 intr-o etapa" },
  capitan_aur: { icon: "⭐", name: "Capitan de Aur", desc: "Scor exact la meciul capitan (10 pct)" },
  all_in: { icon: "🎲", name: "All In", desc: "Toate meciurile prezise corect intr-o etapa" },
  ghinionist: { icon: "😅", name: "Ghinionist", desc: "0 puncte intr-o etapa" },
  lingura: { icon: "🥄", name: "Lingura de Lemn", desc: "Ultimul loc intr-o etapa" },
  on_fire: { icon: "🔥", name: "On Fire", desc: "Locul 1 in 3 etape consecutive" },
  campion: { icon: "🏆", name: "Campion", desc: "Locul 1 in clasamentul general" },
  aproape: { icon: "🥈", name: "Aproape", desc: "Locul 2 in clasamentul general" },
  podium: { icon: "🥉", name: "Podium", desc: "Locul 3 in clasamentul general" },
  constant: { icon: "🏃", name: "Constant", desc: "A jucat toate etapele sezonului" },
  fidel: { icon: "📅", name: "Fidel", desc: "5 etape consecutive jucate" },
  veteranul: { icon: "🦕", name: "Veteranul", desc: "10+ etape jucate" },
  perfect: { icon: "💎", name: "Perfect", desc: "Capitan corect 3 etape la rand" },
  etern_secund: { icon: "😤", name: "Etern Secund", desc: "Locul 2 in 3 etape consecutive" },
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true } })
    const season = await prisma.season.findFirst({ where: { isActive: true } })
    
    const rounds = await prisma.round.findMany({
      where: { status: "COMPLETED" },
      orderBy: { createdAt: "asc" }
    })
    const roundIds = rounds.map(r => r.id)

    // Un singur query pentru toate ranking-urile
    const allRankings = await prisma.roundRanking.findMany({
      where: { roundId: { in: roundIds } }
    })

    // Un singur query pentru toate predictiile cu matchpoints
    const allPredictions = await prisma.prediction.findMany({
      where: { match: { roundId: { in: roundIds } } },
      include: { matchPoints: true }
    })

    // Badge-uri permanente salvate
    const savedBadges = await prisma.userBadge.findMany()
    const savedBadgesMap: any = {}
    for (const sb of savedBadges) {
      if (!savedBadgesMap[sb.userId]) savedBadgesMap[sb.userId] = []
      savedBadgesMap[sb.userId].push(sb.badge)
    }

    const userBadges: any = {}

    for (const user of users) {
      const earned: string[] = [...(savedBadgesMap[user.id] || [])]
      const myRankings = allRankings.filter(r => r.userId === user.id)
      
      // Badge-uri per etapa din rankings
      for (const rr of myRankings) {
        const roundRankings = allRankings.filter(r => r.roundId === rr.roundId)
        const totalPlayers = roundRankings.length
        const myRank = rr.rank || 0

        if (rr.exactHits >= 3 && !earned.includes("sniper")) earned.push("sniper")
        if (myRank === 1 && !earned.includes("dominator")) earned.push("dominator")
        if (myRank === totalPlayers && !earned.includes("lingura")) earned.push("lingura")
        if ((rr.finalPoints ?? 0) === 0 && !earned.includes("ghinionist")) earned.push("ghinionist")
        if (rr.captainPoints >= 10 && !earned.includes("capitan_aur")) earned.push("capitan_aur")
      }

      // All In - toate meciurile corecte intr-o etapa
      for (const roundId of roundIds) {
        const myPreds = allPredictions.filter(p => p.userId === user.id && p.matchId)
        const roundPreds = myPreds.filter(p => allPredictions.find(ap => ap.id === p.id))
        if (roundPreds.length > 0 && roundPreds.every(p => p.matchPoints.some(mp => mp.basePoints > 0))) {
          if (!earned.includes("all_in")) earned.push("all_in")
        }
      }

      // Badge-uri dinamice
      let cf = 0, cs = 0, cp = 0, cc = 0, total = 0
      for (const round of rounds) {
        const rr = myRankings.find(r => r.roundId === round.id)
        if (rr) {
          total++; cc++
          if (rr.rank === 1) { cf++; cs = 0 } else if (rr.rank === 2) { cs++; cf = 0 } else { cf = 0; cs = 0 }
          if (rr.captainPoints >= 10) cp++; else cp = 0
        } else { cf = 0; cs = 0; cp = 0; cc = 0 }
        if (cf >= 3 && !earned.includes("on_fire")) earned.push("on_fire")
        if (cs >= 3 && !earned.includes("etern_secund")) earned.push("etern_secund")
        if (cp >= 3 && !earned.includes("perfect")) earned.push("perfect")
        if (cc >= 5 && !earned.includes("fidel")) earned.push("fidel")
      }
      if (total >= 10 && !earned.includes("veteranul")) earned.push("veteranul")
      if (total === rounds.length && rounds.length > 0 && !earned.includes("constant")) earned.push("constant")

      // Clasament general
      if (season) {
        const userTotals = users.map(u => ({
          userId: u.id,
          wins: allRankings.filter(r => r.userId === u.id && r.rank === 1).length,
          total: allRankings.filter(r => r.userId === u.id).reduce((s, r) => s + (r.finalPoints || 0), 0)
        })).sort((a, b) => b.wins - a.wins || b.total - a.total)

        const myPos = userTotals.findIndex(u => u.userId === user.id) + 1
        if (myPos === 1) earned.push("campion")
        else if (myPos === 2) earned.push("aproape")
        else if (myPos === 3) earned.push("podium")
      }

      userBadges[user.id] = [...new Set(earned)]
    }

    return NextResponse.json({ userBadges, badges: BADGES })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}`

fs.writeFileSync('app/api/badges/all/route.ts', content)
console.log('Gata!')