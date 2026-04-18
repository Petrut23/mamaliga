const fs = require('fs')
let content = fs.readFileSync('app/clasament/page.tsx', 'utf8')

content = content.replace(
  `                        {r.forma === "up" && <div className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-full bg-green-400"></span><span className="text-green-400 text-xs font-black">↑</span></div>}
                        {r.forma === "down" && <div className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-full bg-red-400"></span><span className="text-red-400 text-xs font-black">↓</span></div>}
                        {r.forma === "same" && <div className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-full bg-gray-500"></span><span className="text-gray-500 text-xs font-black">→</span></div>}`,
  ``
)

fs.writeFileSync('app/clasament/page.tsx', content)
console.log('Gata!')