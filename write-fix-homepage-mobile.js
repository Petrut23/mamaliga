const fs = require('fs')
let content = fs.readFileSync('app/page.tsx', 'utf8')

content = content.replace(
  `<h1 className="text-5xl font-black tracking-wide mb-4">Bine ai venit, <span className="text-[#e8ff47]">{session.user?.name}!</span></h1>`,
  `<h1 className="text-3xl md:text-5xl font-black tracking-wide mb-4">Bine ai venit, <span className="text-[#e8ff47]">{session.user?.name}!</span></h1>`
)

fs.writeFileSync('app/page.tsx', content)
console.log('Gata!')