const fs = require('fs')
let content = fs.readFileSync('app/page.tsx', 'utf8')

// Desktop - adaugam regulament ca al 6-lea buton
content = content.replace(
  `          <a href="/head-to-head" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">⚔️</div>
            <div className="font-bold text-white mb-1">Head-to-Head</div>
            <div className="text-xs text-gray-500">Compara-te cu altii</div>
          </a>
        </div>`,
  `          <a href="/head-to-head" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">⚔️</div>
            <div className="font-bold text-white mb-1">Head-to-Head</div>
            <div className="text-xs text-gray-500">Compara-te cu altii</div>
          </a>
          <a href="/regulament" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">📜</div>
            <div className="font-bold text-white mb-1">Regulament</div>
            <div className="text-xs text-gray-500">Reguli si premii</div>
          </a>
        </div>`
)

// Schimbam grid-cols-5 in grid-cols-6 pe desktop
content = content.replace(
  `<div className="hidden md:grid grid-cols-5 gap-4">`,
  `<div className="hidden md:grid grid-cols-6 gap-4">`
)

// Mobil - adaugam regulament dupa H2H
content = content.replace(
  `        {/* Rand 3 - Head to Head centrat */}
        <div className="flex justify-center">
          <a href="/head-to-head" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center w-full md:w-1/2">
            <div className="text-3xl mb-2">⚔️</div>
            <div className="font-bold text-white text-sm md:text-base">Head-to-Head</div>
            <div className="text-xs text-gray-500 mt-1 hidden md:block">Compara-te cu un alt jucator</div>
          </a>
        </div>`,
  `        {/* Rand 3 - Head to Head si Regulament */}
        <div className="grid grid-cols-2 gap-3">
          <a href="/head-to-head" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-2">⚔️</div>
            <div className="font-bold text-white text-sm">Head-to-Head</div>
          </a>
          <a href="/regulament" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-2">📜</div>
            <div className="font-bold text-white text-sm">Regulament</div>
          </a>
        </div>`
)

fs.writeFileSync('app/page.tsx', content)
console.log('Gata!')