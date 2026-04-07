const fs = require('fs')
let content = fs.readFileSync('app/rezultate/page.tsx', 'utf8')

content = content.replace(
  `<div className={"relative inline-block p-2 rounded-lg border cursor-pointer " + (earned ? "bg-[#111520] border-[#1e2640]" : "bg-[#0a0d14] border-[#1e2640]/50 opacity-40")}`,
  `<div className={"relative inline-block p-2 rounded-lg border cursor-pointer bg-[#111520] border-[#1e2640] " + (earned ? "" : "opacity-40")}`
)

fs.writeFileSync('app/rezultate/page.tsx', content)
console.log('Gata!')