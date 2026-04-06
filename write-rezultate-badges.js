const fs = require('fs')
let content = fs.readFileSync('app/rezultate/page.tsx', 'utf8')

const badgesSection = `
  const [badges, setBadges] = useState<string[]>([])
  const [allBadges, setAllBadges] = useState<any>({})

`

content = content.replace(
  `  const [openRound, setOpenRound] = useState<string | null>(null)`,
  `  const [openRound, setOpenRound] = useState<string | null>(null)
  const [badges, setBadges] = useState<string[]>([])
  const [allBadges, setAllBadges] = useState<any>({})`
)

content = content.replace(
  `    fetch("/api/rezultate").then(r => r.json()).then(d => {
      setRounds(d.rounds || [])
      if (d.rounds?.length > 0) setOpenRound(d.rounds[0].id)
      setLoading(false)
    })`,
  `    Promise.all([
      fetch("/api/rezultate").then(r => r.json()),
      fetch("/api/badges").then(r => r.json())
    ]).then(([rezultate, badgesData]) => {
      setRounds(rezultate.rounds || [])
      if (rezultate.rounds?.length > 0) setOpenRound(rezultate.rounds[0].id)
      setBadges(badgesData.earned || [])
      setAllBadges(badgesData.badges || {})
      setLoading(false)
    })`
)

const BADGES_CONST = `
const ALL_BADGES: any = {
  sniper: { icon: "🎯", name: "Sniper", desc: "3+ scoruri exacte intr-o etapa" },
  dominator: { icon: "👑", name: "Dominator", desc: "Locul 1 intr-o etapa" },
  capitan_aur: { icon: "⭐", name: "Capitan de Aur", desc: "Capitanul corect intr-o etapa" },
  all_in: { icon: "🎲", name: "All In", desc: "Toate meciurile prezise corect intr-o etapa" },
  on_fire: { icon: "🔥", name: "On Fire", desc: "Locul 1 in 3 etape consecutive" },
  constant: { icon: "🏃", name: "Constant", desc: "A jucat toate etapele sezonului" },
  perfect: { icon: "💎", name: "Perfect", desc: "Capitan corect 3 etape la rand" },
  campion: { icon: "🏆", name: "Campion", desc: "Locul 1 in clasamentul general" },
  lingura: { icon: "🥄", name: "Lingura de Lemn", desc: "Ultimul loc intr-o etapa" },
  ghinionist: { icon: "😅", name: "Ghinionist", desc: "0 puncte intr-o etapa" },
  etern_secund: { icon: "😤", name: "Etern Secund", desc: "Locul 2 in 3 etape consecutive" },
  aproape: { icon: "🥈", name: "Aproape", desc: "Locul 2 in clasamentul general" },
  podium: { icon: "🥉", name: "Podium", desc: "Locul 3 in clasamentul general" },
  veteranul: { icon: "🦕", name: "Veteranul", desc: "10+ etape jucate" },
  fidel: { icon: "📅", name: "Fidel", desc: "5 etape consecutive jucate" },
}

function BadgeTooltip({ badgeKey, earned }: { badgeKey: string, earned: boolean }) {
  const [show, setShow] = useState(false)
  const badge = ALL_BADGES[badgeKey]
  if (!badge) return null
  return (
    <div className={"relative inline-block p-2 rounded-lg border " + (earned ? "bg-[#111520] border-[#1e2640]" : "bg-[#0a0d14] border-[#1e2640]/50 opacity-40")} 
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(!show)}>
      <div className="text-2xl">{badge.icon}</div>
      <div className={"text-xs text-center mt-1 font-bold " + (earned ? "text-white" : "text-gray-600")}>{badge.name}</div>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-[#1a2035] border border-[#1e2640] rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap shadow-xl">
          <div className="font-bold">{badge.icon} {badge.name}</div>
          <div className="text-gray-400 mt-0.5">{badge.desc}</div>
          {!earned && <div className="text-red-400 mt-0.5">Inca necastigat</div>}
        </div>
      )}
    </div>
  )
}
`

content = BADGES_CONST + content

// Adaugam sectiunea de badges in UI dupa statistici
content = content.replace(
  `            {/* Grafic distributie */}`,
  `            {/* Badges */}
            <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 mb-6">
              <div className="text-sm font-bold text-gray-400 mb-4">🏅 Badge-urile tale ({badges.length}/{Object.keys(ALL_BADGES).length} castigate)</div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {Object.keys(ALL_BADGES).map(key => (
                  <BadgeTooltip key={key} badgeKey={key} earned={badges.includes(key)} />
                ))}
              </div>
            </div>

            {/* Grafic distributie */}`
)

fs.writeFileSync('app/rezultate/page.tsx', content)
console.log('Gata!')