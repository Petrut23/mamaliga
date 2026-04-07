const fs = require('fs')
let content = fs.readFileSync('app/live/page.tsx', 'utf8')

content = content.replace(
  `                          <>
                            {allPreds.filter((p: any) => !p.isMe).map((pred: any, i: number) => {
                              const puncPred = getPredPuncte(pred)
                              return (
                                <div key={i} className="flex items-center gap-2 py-1.5 px-1 border-b border-[#1e2640]/30 last:border-0">
                                  <div className="flex items-center gap-1 w-24">
                                    {pred.isCaptain && <span className="text-xs">⭐</span>}
                                    <span className="text-xs text-gray-400 truncate">{pred.userName}</span>
                                  </div>
                                  <span className="text-sm font-bold text-white w-16">{pred.home} - {pred.away}</span>
                                  {puncPred !== null && meci.status !== "SCHEDULED" ? (
                                    <span className={"text-sm font-bold w-12 " + getPuncteColor(puncPred)}>+{puncPred}</span>
                                  ) : <span className="w-12"></span>}
                                </div>
                              )
                            })}
                          </>`,
  `                          <>
                            {allPreds.filter((p: any) => !p.isMe).map((pred: any, i: number) => {
                              const puncPred = getPredPuncte(pred)
                              return (
                                <div key={i} className="flex items-center justify-between py-1.5 px-1 border-b border-[#1e2640]/30 last:border-0">
                                  <div className="flex items-center gap-1.5">
                                    {pred.isCaptain && <span className="text-xs">⭐</span>}
                                    <span className="text-xs text-gray-400">{pred.userName}:</span>
                                    <span className="text-sm font-bold text-white">{pred.home} - {pred.away}</span>
                                  </div>
                                  {puncPred !== null && meci.status !== "SCHEDULED" && (
                                    <span className={"text-sm font-bold " + getPuncteColor(puncPred)}>+{puncPred}</span>
                                  )}
                                </div>
                              )
                            })}
                          </>`
)

fs.writeFileSync('app/live/page.tsx', content)
console.log('Gata!')