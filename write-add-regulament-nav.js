const fs = require('fs')

// Adaugam in navbar
let navbar = fs.readFileSync('app/components/Navbar.tsx', 'utf8')
navbar = navbar.replace(
  `{ href: "/head-to-head", label: "H2H", icon: "⚔️" },`,
  `{ href: "/head-to-head", label: "H2H", icon: "⚔️" },
    { href: "/regulament", label: "Regulament", icon: "📜" },`
)
fs.writeFileSync('app/components/Navbar.tsx', navbar)

// Adaugam in homepage
let homepage = fs.readFileSync('app/page.tsx', 'utf8')
homepage = homepage.replace(
  `        {/* Mobile - 2+2+1 */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <a href="/predictii" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
              <div className="text-3xl mb-2">📋</div>
              <div className="font-bold text-white text-sm">Predicții</div>
            </a>
            <a href="/live" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
              <div className="text-3xl mb-2">🔴</div>
              <div className="font-bold text-white text-sm">Live</div>
            </a>
          </div>`,
  `        {/* Mobile - 2+2+1+1 */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <a href="/predictii" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
              <div className="text-3xl mb-2">📋</div>
              <div className="font-bold text-white text-sm">Predicții</div>
            </a>
            <a href="/live" className="bg-[#111520] border border-[#1e2640] rounded-xl p-5 hover:border-[#e8ff47]/40 transition-colors text-center">
              <div className="text-3xl mb-2">🔴</div>
              <div className="font-bold text-white text-sm">Live</div>
            </a>
          </div>`
)

fs.writeFileSync('app/page.tsx', homepage)
console.log('Gata!')