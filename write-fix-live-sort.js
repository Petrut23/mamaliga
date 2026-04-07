const fs = require('fs')
let content = fs.readFileSync('app/live/page.tsx', 'utf8')

content = content.replace(
  `{allPreds.filter((p: any) => !p.isMe).map((pred: any, i: number) => {`,
  `{allPreds
                            .filter((p: any) => !p.isMe)
                            .map((pred: any) => {
                              const pts = getPredPuncte(pred)
                              return { ...pred, calculatedPts: pts ?? -1 }
                            })
                            .sort((a: any, b: any) => {
                              if (b.calculatedPts !== a.calculatedPts) return b.calculatedPts - a.calculatedPts
                              return a.userName.localeCompare(b.userName)
                            })
                            .map((pred: any, i: number) => {`
)

fs.writeFileSync('app/live/page.tsx', content)
console.log('Gata!')