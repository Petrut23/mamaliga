const fs = require('fs')
let content = fs.readFileSync('app/live/page.tsx', 'utf8')

content = content.replace(
  `<span className="w-5 flex-shrink-0 text-sm">{myPred.isCaptain ? "⭐" : ""}</span>
            <span className="text-xs text-gray-400 w-8 flex-shrink-0">Tu:</span>
            <span className="text-sm font-black text-[#e8ff47] w-12 flex-shrink-0">{myPred.home} - {myPred.away}</span>`,
  `<span className="w-5 flex-shrink-0 text-sm">{myPred.isCaptain ? "⭐" : ""}</span>
            <span className="text-xs text-gray-400 w-20 flex-shrink-0 truncate">Tu:</span>
            <span className="text-sm font-black text-[#e8ff47] w-12 flex-shrink-0">{myPred.home} - {myPred.away}</span>`
)

fs.writeFileSync('app/live/page.tsx', content)
console.log('Gata!')