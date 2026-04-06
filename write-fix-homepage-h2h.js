const fs = require('fs')
let content = fs.readFileSync('app/page.tsx', 'utf8')

content = content.replace(
  `          <a href="/rezultate" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-left">
            <div className="text-3xl mb-3">📊</div>
            <div className="font-bold text-white mb-1">Rezultatele mele</div>
            <div className="text-sm text-gray-500">Istoricul predicțiilor și punctajelor tale</div>
          </a>`,
  `          <a href="/rezultate" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-left">
            <div className="text-3xl mb-3">📊</div>
            <div className="font-bold text-white mb-1">Rezultatele mele</div>
            <div className="text-sm text-gray-500">Istoricul predicțiilor și punctajelor tale</div>
          </a>
          <a href="/head-to-head" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-left">
            <div className="text-3xl mb-3">⚔️</div>
            <div className="font-bold text-white mb-1">Head-to-Head</div>
            <div className="text-sm text-gray-500">Compara-te cu un alt jucator</div>
          </a>`
)

fs.writeFileSync('app/page.tsx', content)
console.log('Gata!')