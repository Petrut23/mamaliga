const fs = require('fs')
let content = fs.readFileSync('app/predictii/page.tsx', 'utf8')

// Fix 1: warning fara capitan la salvare
content = content.replace(
  `  async function savePredictions() {
    if (isLocked) return
    setSaving(true)
    setMsg("")`,
  `  async function savePredictions() {
    if (isLocked) return
    if (!captain) {
      setMsg("⚠️ Trebuie sa alegi un meci capitan inainte de a salva!")
      return
    }
    setSaving(true)
    setMsg("")`
)

// Fix 2: input value undefined -> ""
content = content.replace(
  'value={pred.home}',
  'value={pred.home ?? ""}'
)
content = content.replace(
  'value={pred.away}',
  'value={pred.away ?? ""}'
)

fs.writeFileSync('app/predictii/page.tsx', content)
console.log('Gata!')