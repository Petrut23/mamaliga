const fs = require('fs')
let content = fs.readFileSync('app/components/Navbar.tsx', 'utf8')

content = content.replace(
  `    { href: "/rezultate", label: "Rezultate", icon: "📊" },`,
  `    { href: "/rezultate", label: "Rezultate", icon: "📊" },
    { href: "/head-to-head", label: "H2H", icon: "⚔️" },`
)

fs.writeFileSync('app/components/Navbar.tsx', content)
console.log('Gata!')