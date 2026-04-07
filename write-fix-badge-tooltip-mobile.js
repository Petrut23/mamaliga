const fs = require('fs')

// Fix tooltip in rezultate
let rezultate = fs.readFileSync('app/rezultate/page.tsx', 'utf8')
rezultate = rezultate.replace(
  `<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-[#2a3555] border border-[#3a4565] rounded-lg px-3 py-2 text-xs text-white cursor-pointer shadow-xl" style={{minWidth: "150px"}}>`,
  `<div className="fixed bottom-auto left-1/2 -translate-x-1/2 z-50 bg-[#2a3555] border border-[#3a4565] rounded-lg px-3 py-2 text-xs text-white shadow-xl" style={{minWidth: "150px", maxWidth: "200px"}}>`)
fs.writeFileSync('app/rezultate/page.tsx', rezultate)

// Fix tooltip in clasament
let clasament = fs.readFileSync('app/clasament/page.tsx', 'utf8')
clasament = clasament.replace(
  `<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-[#1a2035] border border-[#1e2640] rounded-lg px-3 py-2 text-xs text-white shadow-xl" style={{minWidth: "160px"}}>`,
  `<div className="fixed bottom-auto left-1/2 -translate-x-1/2 z-50 bg-[#1a2035] border border-[#1e2640] rounded-lg px-3 py-2 text-xs text-white shadow-xl" style={{minWidth: "160px", maxWidth: "200px"}}>`)
fs.writeFileSync('app/clasament/page.tsx', clasament)

console.log('Gata!')