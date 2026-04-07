const fs = require('fs')
let content = fs.readFileSync('app/rezultate/page.tsx', 'utf8')

content = content.replace(
  `          {!earned && <div className="text-red-400 mt-0.5">Inca necastigat</div>}`,
  `          {!earned && <div className="text-red-300 mt-0.5 font-semibold">Inca necastigat</div>}`
)

content = content.replace(
  `          <div className="text-gray-400 mt-0.5">{badge.desc}</div>`,
  `          <div className="text-gray-200 mt-0.5">{badge.desc}</div>`
)

fs.writeFileSync('app/rezultate/page.tsx', content)
console.log('Gata!')