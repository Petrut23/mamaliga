const fs = require('fs')
let content = fs.readFileSync('app/rezultate/page.tsx', 'utf8')

content = content.replace(
  `<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-[#1a2035] border border-[#1e2640] rounded-lg px-3 py-2 text-xs text-white cursor-pointer shadow-xl" style={{minWidth: "150px"}}>`,
  `<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-[#2a3555] border border-[#3a4565] rounded-lg px-3 py-2 text-xs text-white cursor-pointer shadow-xl" style={{minWidth: "150px"}}>`
)

fs.writeFileSync('app/rezultate/page.tsx', content)
console.log('Gata!')