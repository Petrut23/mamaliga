const fs = require('fs')
let content = fs.readFileSync('app/admin/meciuri/page.tsx', 'utf8')

content = content.replace(
  `<div><label className="block text-sm text-gray-400 mb-1">De la data</label><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-[#0a0d14] border border-[#1e2640] text-white rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Pana la data</label><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-[#0a0d14] border border-[#1e2640] text-white rounded-lg px-3 py-2" /></div>`,
  `<div><label className="block text-sm text-gray-400 mb-1">De la data</label><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-[#0a0d14] border border-[#1e2640] text-white rounded-lg px-3 py-2 cursor-pointer" style={{colorScheme: "dark"}} /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Pana la data</label><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-[#0a0d14] border border-[#1e2640] text-white rounded-lg px-3 py-2 cursor-pointer" style={{colorScheme: "dark"}} /></div>`
)

fs.writeFileSync('app/admin/meciuri/page.tsx', content)
console.log('Gata!')