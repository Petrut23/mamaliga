const fs = require('fs')
let content = fs.readFileSync('app/components/Navbar.tsx', 'utf8')

content = content.replace(
  `    { href: "/predictii", label: "Predicții", icon: "📋" },
    { href: "/live", label: "Live", icon: "🔴" },
    { href: "/clasament", label: "Clasament", icon: "🏆" },`,
  `    { href: "/predictii", label: "Predicții", icon: "📋" },
    { href: "/live", label: "Live", icon: "🔴" },
    { href: "/clasament", label: "Clasament", icon: "🏆" },
    { href: "/rezultate", label: "Rezultatele mele", icon: "📊" },`
)

fs.writeFileSync('app/components/Navbar.tsx', content)
console.log('Gata!')