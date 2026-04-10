const fs = require('fs')
let content = fs.readFileSync('app/page.tsx', 'utf8')

// Stergem descrierile de pe desktop
const descs = [
  `            <div className="text-xs text-gray-500">Completează scorurile</div>`,
  `            <div className="text-xs text-gray-500">Scoruri în timp real</div>`,
  `            <div className="text-xs text-gray-500">Clasamentul sezonului</div>`,
  `            <div className="text-xs text-gray-500">Istoricul predicțiilor</div>`,
  `            <div className="text-xs text-gray-500">Compara-te cu altii</div>`,
  `            <div className="text-xs text-gray-500">Reguli si premii</div>`,
]

for (const desc of descs) {
  content = content.replace(desc, '')
}

fs.writeFileSync('app/page.tsx', content)
console.log('Gata!')