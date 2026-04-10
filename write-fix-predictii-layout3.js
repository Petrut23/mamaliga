const fs = require('fs')
let content = fs.readFileSync('app/predictii/page.tsx', 'utf8')

content = content.replace(
  `<span className="font-bold text-sm block leading-tight">{meci.homeTeam}</span>`,
  `{meci.homeTeam.length > 20 ? (
                          <span className="font-bold text-xs block">{meci.homeTeam}</span>
                        ) : (
                          <span className="font-bold text-sm block">{meci.homeTeam}</span>
                        )}`
)

fs.writeFileSync('app/predictii/page.tsx', content)
console.log('Gata!')