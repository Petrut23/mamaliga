const fs = require('fs')
let content = fs.readFileSync('app/predictii/page.tsx', 'utf8')

content = content.replace(
  `  async function savePredictions() {
    if (isLocked) return
    if (!captain) {
      showToast("⚠️ Trebuie sa alegi un meci capitan!", "error")
      return
    }`,
  `  async function savePredictions() {
    if (isLocked) return
    
    const missingScores = matches.filter((m: any) => 
      predictions[m.id]?.home === "" || predictions[m.id]?.home === undefined ||
      predictions[m.id]?.away === "" || predictions[m.id]?.away === undefined
    )
    
    if (missingScores.length > 0) {
      showToast("⚠️ Ai " + missingScores.length + " meciuri fara scor!", "error")
      return
    }
    
    if (!captain) {
      showToast("⚠️ Trebuie sa alegi un meci capitan!", "error")
      return
    }`
)

fs.writeFileSync('app/predictii/page.tsx', content)
console.log('Gata!')