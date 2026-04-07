const fs = require('fs')
let content = fs.readFileSync('app/live/page.tsx', 'utf8')

// Fix predictia mea
content = content.replace(
  `        {myPred && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1e2640]/50">
            <div className="flex items-center gap-1.5">
              {myPred.isCaptain && <span className="text-sm">⭐</span>}
              <span className="text-xs text-gray-400">Tu:</span>
              <span className="text-sm font-black text-[#e8ff47]">{myPred.home} - {myPred.away}</span>
            </div>
            {myPuncte !== null && meci.status !== "SCHEDULED" && (
              <span className={"text-sm font-black " + getPuncteColor(myPuncte)}>+{myPuncte} pct</span>
            )}
          </div>
        )}`,
  `        {myPred && (
          <div className="flex items-center mt-2 pt-2 border-t border-[#1e2640]/50">
            <span className="w-5 flex-shrink-0 text-sm">{myPred.isCaptain ? "⭐" : ""}</span>
            <span className="text-xs text-gray-400 w-8 flex-shrink-0">Tu:</span>
            <span className="text-sm font-black text-[#e8ff47] w-12 flex-shrink-0">{myPred.home} - {myPred.away}</span>
            {myPuncte !== null && meci.status !== "SCHEDULED" && (
              <span className={"text-sm font-black ml-2 " + getPuncteColor(myPuncte)}>+{myPuncte}</span>
            )}
          </div>
        )}`
)

// Fix predictiile celorlalti pe expand
content = content.replace(
  `                    <div key={i} className="flex items-center justify-between py-1.5 px-1 border-b border-[#1e2640]/30 last:border-0">
                      <div className="flex items-center gap-1.5">
                        {pred.isCaptain && <span className="text-xs">⭐</span>}
                        <span className="text-xs text-gray-400">{pred.userName}:</span>
                        <span className="text-sm font-bold text-white">{pred.home} - {pred.away}</span>
                      </div>
                      {puncPred !== null && meci.status !== "SCHEDULED" && (
                        <span className={"text-sm font-bold " + getPuncteColor(puncPred)}>+{puncPred}</span>
                      )}
                    </div>`,
  `                    <div key={i} className="flex items-center py-1.5 px-1 border-b border-[#1e2640]/30 last:border-0">
                      <span className="w-5 flex-shrink-0 text-xs">{pred.isCaptain ? "⭐" : ""}</span>
                      <span className="text-xs text-gray-400 w-20 flex-shrink-0 truncate">{pred.userName}:</span>
                      <span className="text-sm font-bold text-white w-12 flex-shrink-0">{pred.home} - {pred.away}</span>
                      {puncPred !== null && meci.status !== "SCHEDULED" && (
                        <span className={"text-sm font-bold ml-2 " + getPuncteColor(puncPred)}>+{puncPred}</span>
                      )}
                    </div>`
)

fs.writeFileSync('app/live/page.tsx', content)
console.log('Gata!')