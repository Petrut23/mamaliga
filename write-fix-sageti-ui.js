const fs = require('fs')
let content = fs.readFileSync('app/clasament/page.tsx', 'utf8')

content = content.replace(
  `                      <div className="flex items-center gap-2 flex-wrap">
                          <span className={"font-bold text-base " + (isMe ? "text-[#e8ff47]" : "text-white")}>
                            {r.name} {isMe && <span className="text-xs font-normal text-gray-500">(tu)</span>}
                          </span>
                          {r.forma === "up" && <span className="text-green-400 text-sm font-black">↑</span>}
                          {r.forma === "down" && <span className="text-red-400 text-sm font-black">↓</span>}
                          {r.forma === "same" && <span className="text-gray-600 text-sm">→</span>}
                        </div>`,
  `                      <div className="flex items-center gap-2 flex-wrap">
                          <span className={"font-bold text-base " + (isMe ? "text-[#e8ff47]" : "text-white")}>
                            {r.name} {isMe && <span className="text-xs font-normal text-gray-500">(tu)</span>}
                          </span>
                          {r.forma === "up" && (
                            <div className="flex items-center gap-0.5">
                              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></span>
                              <span className="text-green-400 text-xs font-black">↑</span>
                            </div>
                          )}
                          {r.forma === "down" && (
                            <div className="flex items-center gap-0.5">
                              <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></span>
                              <span className="text-red-400 text-xs font-black">↓</span>
                            </div>
                          )}
                          {r.forma === "same" && (
                            <div className="flex items-center gap-0.5">
                              <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0"></span>
                              <span className="text-gray-500 text-xs font-black">→</span>
                            </div>
                          )}
                        </div>`
)

fs.writeFileSync('app/clasament/page.tsx', content)
console.log('Gata!')