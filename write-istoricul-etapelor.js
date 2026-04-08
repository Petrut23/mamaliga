const fs = require('fs')

// Adaugam sectiunea de istoric in pagina clasament
let content = fs.readFileSync('app/clasament/page.tsx', 'utf8')

// Adaugam state pentru istoric
content = content.replace(
  `  const [expanded, setExpanded] = useState<string | null>(null)`,
  `  const [expanded, setExpanded] = useState<string | null>(null)
  const [istoricData, setIstoricData] = useState<any[]>([])
  const [expandedEtapa, setExpandedEtapa] = useState<string | null>(null)`
)

// Adaugam fetch pentru istoric
content = content.replace(
  `    // Incarcam clasamentul instant
    fetch("/api/clasament").then(r => r.json()).then(clasament => {
      setData(clasament)
      setLoading(false)
      // Incarcam badge-urile dupa 2 secunde
      setTimeout(() => {
        fetch("/api/badges/all").then(r => r.json()).then(badges => {
          setBadgesData(badges.userBadges || {})
        }).catch(() => {})
      }, 2000)
    })`,
  `    // Incarcam clasamentul instant
    fetch("/api/clasament").then(r => r.json()).then(clasament => {
      setData(clasament)
      setLoading(false)
      // Incarcam badge-urile dupa 2 secunde
      setTimeout(() => {
        fetch("/api/badges/all").then(r => r.json()).then(badges => {
          setBadgesData(badges.userBadges || {})
        }).catch(() => {})
      }, 2000)
    })
    // Incarcam istoricul etapelor
    fetch("/api/clasament/istoric").then(r => r.json()).then(d => {
      setIstoricData(d.etape || [])
    }).catch(() => {})`
)

// Adaugam sectiunea de istoric in UI dupa clasament
content = content.replace(
  `      </div>
    </div>
  )
}`,
  `      </div>

        {/* Istoricul etapelor */}
        {istoricData.length > 0 && (
          <div className="mt-8">
            <div className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">📅 Istoricul Etapelor</div>
            <div className="space-y-2">
              {istoricData.map((etapa: any) => (
                <div key={etapa.id} className="bg-[#111520] border border-[#1e2640] rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedEtapa(expandedEtapa === etapa.id ? null : etapa.id)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#1a2035] transition-colors">
                    <div className="font-bold text-white text-left">{etapa.title}</div>
                    <span className="text-gray-500 text-xs">{expandedEtapa === etapa.id ? "▲" : "▼"}</span>
                  </button>
                  {expandedEtapa === etapa.id && (
                    <div className="border-t border-[#1e2640]">
                      {etapa.rankings.map((r: any, i: number) => (
                        <div key={r.userId} className="flex items-center gap-3 px-5 py-3 border-b border-[#1e2640]/50 last:border-0">
                          <div className={"text-lg font-black w-8 text-center flex-shrink-0 " + (i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.rank}
                          </div>
                          <div className="flex-1 font-semibold text-sm text-white">{r.name}</div>
                          <div className="flex items-center gap-3 text-xs">
                            <div className="text-center">
                              <div className="font-black text-[#e8ff47]">{r.points}</div>
                              <div className="text-gray-600">pct</div>
                            </div>
                            <div className="text-center">
                              <div className="font-black text-green-400">{r.exact}</div>
                              <div className="text-gray-600">exacte</div>
                            </div>
                            <div className="text-center">
                              <div className="font-black text-yellow-400">{r.diff}</div>
                              <div className="text-gray-600">dif</div>
                            </div>
                            <div className="text-center">
                              <div className="font-black text-blue-400">{r.result}</div>
                              <div className="text-gray-600">cor</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}`
)

fs.writeFileSync('app/clasament/page.tsx', content)
console.log('Gata pagina!')