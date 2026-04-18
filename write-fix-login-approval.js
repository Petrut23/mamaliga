const fs = require('fs')
let content = fs.readFileSync('app/login/page.tsx', 'utf8')

content = content.replace(
  `      if (result?.error) {
        setError("Email sau parolă incorectă")`,
  `      if (result?.error) {
        if (result.error === "PENDING_APPROVAL") {
          setError("Contul tău așteaptă aprobare. Vei primi un email când ești aprobat.")
        } else {
          setError("Email sau parolă incorectă")
        }`
)

fs.writeFileSync('app/login/page.tsx', content)
console.log('Gata!')