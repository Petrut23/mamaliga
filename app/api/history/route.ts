const fs = require('fs')

// Navbar
let navbar = fs.readFileSync('app/components/Navbar.tsx', 'utf8')
navbar = navbar.replace(
  `    { href: "/head-to-head", label: "H2H", icon: "⚔️" },`,
  `    { href: "/head-to-head", label: "H2H", icon: "⚔️" },
    { href: "/history", label: "History", icon: "📚" },`
)
fs.writeFileSync('app/components/Navbar.tsx', navbar)

// Homepage
let homepage = fs.readFileSync('app/page.tsx', 'utf8')
homepage = homepage.replace(
  `          <a href="/head-to-head" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">⚔️</div>
            <div className="font-bold text-white mb-1">Head-to-Head</div>
            <div className="text-sm text-gray-500">Compara-te cu un alt jucator</div>
          </a>`,
  `          <a href="/head-to-head" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">⚔️</div>
            <div className="font-bold text-white mb-1">Head-to-Head</div>
            <div className="text-sm text-gray-500">Compara-te cu un alt jucator</div>
          </a>
          <a href="/history" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">📚</div>
            <div className="font-bold text-white mb-1">History</div>
            <div className="text-sm text-gray-500">Clasamentele sezoanelor trecute</div>
          </a>`
)
fs.writeFileSync('app/page.tsx', homepage)

console.log('Gata!')