const fs = require('fs')
let content = fs.readFileSync('app/live/page.tsx', 'utf8')

content = content.replace(
  `                    <div className="space-y-2 mb-3">
                        {allPreds.filter((p: any) => !p.isMe).map((pred: any, i: number) => {
                          const puncPred = getPredPuncte(pred)
                          return (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {pred.isCaptain && <span className="text-xs">⭐</span>}
                                <span className="text-xs text-gray-400 w-20 truncate">{pred.userName}:</span>
                                <span className="text-sm font-bold text-white">{pred.home} - {pred.away}</span>
                              </div>
                              {puncPred !== null && meci.status !== "SCHEDULED" && (
                                <span className={"text-sm font-bold " + getPuncteColor(puncPred)}>+{puncPred} pct</span>
                              )}
                            </div>
                          )
                        })}
                      </div>`,
  `                    <div className="mb-3">
                        {/* Header coloane */}
                        <div className="grid grid-cols-3 text-xs text-gray-600 mb-2 px-1">
                          <span>Jucator</span>
                          <span className="text-center">Scor</span>
                          <span className="text-right">Puncte</span>
                        </div>
                        {/* Predictia mea prima */}
                        {myPred && (() => {
                          const puncMe = getMyPuncte()
                          return (
                            <div className="grid grid-cols-3 items-center py-1.5 px-1 rounded-lg bg-[#e8ff47]/05 border border-[#e8ff47]/20 mb-1">
                              <div className="flex items-center gap-1">
                                {myPred.isCaptain && <span className="text-xs">⭐</span>}
                                <span className="text-xs font-bold text-[#e8ff47]">Tu</span>
                              </div>
                              <span className="text-sm font-black text-[#e8ff47] text-center">{myPred.home} - {myPred.away}</span>
                              {puncMe !== null && meci.status !== "SCHEDULED" ? (
                                <span className={"text-sm font-black text-right " + getPuncteColor(puncMe)}>+{puncMe}</span>
                              ) : <span></span>}
                            </div>
                          )
                        })()}
                        {/* Restul jucatorilor */}
                        {allPreds.filter((p: any) => !p.isMe).map((pred: any, i: number) => {
                          const puncPred = getPredPuncte(pred)
                          return (
                            <div key={i} className="grid grid-cols-3 items-center py-1.5 px-1 border-b border-[#1e2640]/30 last:border-0">
                              <div className="flex items-center gap-1">
                                {pred.isCaptain && <span className="text-xs">⭐</span>}
                                <span className="text-xs text-gray-400 truncate">{pred.userName}</span>
                              </div>
                              <span className="text-sm font-bold text-white text-center">{pred.home} - {pred.away}</span>
                              {puncPred !== null && meci.status !== "SCHEDULED" ? (
                                <span className={"text-sm font-bold text-right " + getPuncteColor(puncPred)}>+{puncPred}</span>
                              ) : <span></span>}
                            </div>
                          )
                        })}
                      </div>`
)

fs.writeFileSync('app/live/page.tsx', content)
console.log('Gata!')