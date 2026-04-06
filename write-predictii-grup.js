const fs = require('fs')

// Update API live sa includa statistici predictii per meci
let liveApi = fs.readFileSync('app/api/live/route.ts', 'utf8')

liveApi = liveApi.replace(
  `    return NextResponse.json({ round, matches, rankings, matchPredictions })`,
  `    // Calculeaza statistici predictii per meci
    const matchStats: any = {}
    for (const match of matches) {
      const preds = predictions.filter(p => p.matchId === match.id)
      if (preds.length === 0) continue
      
      let homeWin = 0, draw = 0, awayWin = 0
      for (const pred of preds) {
        if (pred.predictedHome > pred.predictedAway) homeWin++
        else if (pred.predictedHome === pred.predictedAway) draw++
        else awayWin++
      }
      
      const total = preds.length
      matchStats[match.id] = {
        total,
        homeWin,
        draw,
        awayWin,
        homeWinPct: Math.round(homeWin / total * 100),
        drawPct: Math.round(draw / total * 100),
        awayWinPct: Math.round(awayWin / total * 100),
      }
    }

    return NextResponse.json({ round, matches, rankings, matchPredictions, matchStats })`
)

fs.writeFileSync('app/api/live/route.ts', liveApi)

// Update pagina live sa afiseze statisticile
let livePage = fs.readFileSync('app/live/page.tsx', 'utf8')

livePage = livePage.replace(
  `                {data.matchPredictions[meci.id] && data.matchPredictions[meci.id].length > 0 && (
                  <div className="border-t border-[#1e2640] pt-2 mt-2">
                    <div className="flex flex-wrap gap-2">
                      {data.matchPredictions[meci.id].map((pred: any, i: number) => (
                        <div key={i} className="flex items-center gap-1 bg-[#0a0d14] rounded-lg px-2 py-1">
                          {pred.isCaptain && <span className="text-xs">⭐</span>}
                          <span className="text-xs text-gray-400">{pred.userName}:</span>
                          <span className="text-xs font-bold text-[#e8ff47]">{pred.home}-{pred.away}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}`,
  `                {data.matchPredictions[meci.id] && data.matchPredictions[meci.id].length > 0 && (
                  <div className="border-t border-[#1e2640] pt-2 mt-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {data.matchPredictions[meci.id].map((pred: any, i: number) => (
                        <div key={i} className="flex items-center gap-1 bg-[#0a0d14] rounded-lg px-2 py-1">
                          {pred.isCaptain && <span className="text-xs">⭐</span>}
                          <span className="text-xs text-gray-400">{pred.userName}:</span>
                          <span className="text-xs font-bold text-[#e8ff47]">{pred.home}-{pred.away}</span>
                        </div>
                      ))}
                    </div>
                    {data.matchStats?.[meci.id] && (
                      <div className="flex gap-2 mt-2">
                        <div className="flex-1 bg-blue-500/10 border border-blue-500/20 rounded-lg px-2 py-1.5 text-center">
                          <div className="text-xs font-bold text-blue-400">{data.matchStats[meci.id].homeWinPct}%</div>
                          <div className="text-xs text-gray-500">1</div>
                        </div>
                        <div className="flex-1 bg-gray-500/10 border border-gray-500/20 rounded-lg px-2 py-1.5 text-center">
                          <div className="text-xs font-bold text-gray-400">{data.matchStats[meci.id].drawPct}%</div>
                          <div className="text-xs text-gray-500">X</div>
                        </div>
                        <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1.5 text-center">
                          <div className="text-xs font-bold text-red-400">{data.matchStats[meci.id].awayWinPct}%</div>
                          <div className="text-xs text-gray-500">2</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}`
)

fs.writeFileSync('app/live/page.tsx', livePage)
console.log('Gata!')