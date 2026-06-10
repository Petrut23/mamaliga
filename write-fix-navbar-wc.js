const fs = require('fs')

let navbar = fs.readFileSync('app/components/Navbar.tsx', 'utf8')
navbar = navbar.replace(
  `    { href: "/history", label: "History", icon: "📚" },`,
  `    { href: "/history", label: "History", icon: "📚" },
    { href: "/world-cup", label: "World Cup", icon: "🏆" },`
)
fs.writeFileSync('app/components/Navbar.tsx', navbar)
console.log('Gata!')