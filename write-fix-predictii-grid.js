const fs = require('fs')
let content = fs.readFileSync('app/predictii/page.tsx', 'utf8')

content = content.replace(
  `                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0 text-right">
                        <span className="font-bold text-xs md:text-sm break-words">{meci.homeTeam}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="number" min="0" max="20"
                          value={pred.home ?? ""}
                          onChange={e => updatePrediction(meci.id, "home", e.target.value)}
                          disabled={isLocked}
                          className={"w-11 h-11 text-center text-xl font-black rounded-lg border bg-[#0a0d14] outline-none transition-all " + (pred.home !== "" ? "border-[#e8ff47]/40 text-[#e8ff47]" : "border-[#1e2640] text-white") + (isLocked ? " opacity-50 cursor-not-allowed" : " focus:border-[#3b82f6]")}
                          placeholder="–"
                        />
                        <span className="text-gray-500 font-bold">:</span>
                        <input
                          type="number" min="0" max="20"
                          value={pred.away ?? ""}
                          onChange={e => updatePrediction(meci.id, "away", e.target.value)}
                          disabled={isLocked}
                          className={"w-11 h-11 text-center text-xl font-black rounded-lg border bg-[#0a0d14] outline-none transition-all " + (pred.away !== "" ? "border-[#e8ff47]/40 text-[#e8ff47]" : "border-[#1e2640] text-white") + (isLocked ? " opacity-50 cursor-not-allowed" : " focus:border-[#3b82f6]")}
                          placeholder="–"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs md:text-sm break-words">{meci.awayTeam}</span>
                      </div>
                      <button
                        onClick={() => toggleCaptain(meci.id)}
                        disabled={isLocked}
                        className={"w-9 h-9 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 " + (isCap ? "border-[#fbbf24] bg-[#fbbf24]/20 text-[#fbbf24]" : "border-[#1e2640] text-gray-600 hover:border-[#fbbf24] hover:text-[#fbbf24]") + (isLocked ? " opacity-50 cursor-not-allowed" : "")}
                      >⭐</button>
                    </div>`,
  `                    <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                      <div className="text-right min-w-0">
                        <span className="font-bold text-xs leading-tight block">{meci.homeTeam}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <input
                          type="number" min="0" max="20"
                          value={pred.home ?? ""}
                          onChange={e => updatePrediction(meci.id, "home", e.target.value)}
                          disabled={isLocked}
                          className={"w-10 h-10 text-center text-lg font-black rounded-lg border bg-[#0a0d14] outline-none transition-all " + (pred.home !== "" ? "border-[#e8ff47]/40 text-[#e8ff47]" : "border-[#1e2640] text-white") + (isLocked ? " opacity-50 cursor-not-allowed" : " focus:border-[#3b82f6]")}
                          placeholder="–"
                        />
                        <span className="text-gray-500 font-bold text-xs">:</span>
                        <input
                          type="number" min="0" max="20"
                          value={pred.away ?? ""}
                          onChange={e => updatePrediction(meci.id, "away", e.target.value)}
                          disabled={isLocked}
                          className={"w-10 h-10 text-center text-lg font-black rounded-lg border bg-[#0a0d14] outline-none transition-all " + (pred.away !== "" ? "border-[#e8ff47]/40 text-[#e8ff47]" : "border-[#1e2640] text-white") + (isLocked ? " opacity-50 cursor-not-allowed" : " focus:border-[#3b82f6]")}
                          placeholder="–"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs leading-tight block">{meci.awayTeam}</span>
                      </div>
                      <button
                        onClick={() => toggleCaptain(meci.id)}
                        disabled={isLocked}
                        className={"w-9 h-9 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 " + (isCap ? "border-[#fbbf24] bg-[#fbbf24]/20 text-[#fbbf24]" : "border-[#1e2640] text-gray-600 hover:border-[#fbbf24] hover:text-[#fbbf24]") + (isLocked ? " opacity-50 cursor-not-allowed" : "")}
                      >⭐</button>
                    </div>`
)

fs.writeFileSync('app/predictii/page.tsx', content)
console.log('Gata!')