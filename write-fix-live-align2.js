const fs = require('fs')
let content = fs.readFileSync('app/live/page.tsx', 'utf8')

content = content.replace(
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
                      </div>`,
  `                    <div className="mb-3">
                        {allPreds.filter((p: any) => !p.isMe).length === 0 ? (
                          <div className="text-xs text-gray-600 italic py-2">Nicio alta predictie</div>
                        ) : (
                          <>
                            <div className="flex text-xs text-gray-600 mb-1 px-1 gap-2">
                              <span className="w-24">Jucator</span>
                              <span className="w-16">Scor</span>
                              <span className="w-12">Pct</span>
                            </div>
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
                          </>
                        )}
                      </div>`
)

fs.writeFileSync('app/live/page.tsx', content)
console.log('Gata!')