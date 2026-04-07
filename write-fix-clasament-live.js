const fs = require('fs')
let content = fs.readFileSync('app/live/page.tsx', 'utf8')

content = content.replace(
  `        {activeTab === "clasament" && (
          <div className="space-y-2">
            {data.rankings.length === 0 ? (
              <div className="text-center py-20 text-gray-500">Nicio predictie inca.</div>
            ) : (
              data.rankings.map((r: any, i: number) => (
                <div key={r.userId} className={"rounded-xl border px-4 py-3 flex items-center gap-3 " + (i === 0 ? "bg-[#fbbf24]/05 border-[#fbbf24]/20" : "bg-[#111520] border-[#1e2640]")}>
                  <div className={"text-2xl font-black w-8 text-center " + (i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.rank}
                  </div>
                  <div className="flex-1 font-bold">{r.name}</div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#e8ff47]">{r.total}</div>
                    <div className="text-xs text-gray-500">{r.confirmed} conf + {r.live} live</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}`,
  `        {activeTab === "clasament" && (
          <div className="space-y-2">
            {data.rankings.length === 0 ? (
              <div className="text-center py-20 text-gray-500">Nicio predictie inca.</div>
            ) : (
              data.rankings.map((r: any, i: number) => {
                const hasLive = data.matches.some((m: any) => m.status === "LIVE" || m.status === "HALFTIME" || m.status === "SCHEDULED")
                return (
                  <div key={r.userId} className={"rounded-xl border px-4 py-3 flex items-center gap-3 " + (i === 0 ? "bg-[#fbbf24]/05 border-[#fbbf24]/20" : "bg-[#111520] border-[#1e2640]")}>
                    <div className={"text-2xl font-black w-8 text-center " + (i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-600")}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.rank}
                    </div>
                    <div className="flex-1 font-bold">{r.name}</div>
                    <div className="flex items-center gap-2">
                      {hasLive && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
                      )}
                      <div className="text-2xl font-black text-[#e8ff47]">{r.total}</div>
                      <div className="text-xs text-gray-500">pct</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}`
)

fs.writeFileSync('app/live/page.tsx', content)
console.log('Gata!')