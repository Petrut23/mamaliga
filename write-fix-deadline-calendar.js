const fs = require('fs')
let content = fs.readFileSync('app/admin/etape/page.tsx', 'utf8')

content = content.replace(
  `<div><label className="block text-sm text-gray-400 mb-1">Deadline (data)</label><input type="date" value={form.deadlineDate} onChange={e => setForm({...form, deadlineDate: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" required /></div>`,
  `<div><label className="block text-sm text-gray-400 mb-1">Deadline (data)</label><input type="date" value={form.deadlineDate} onChange={e => setForm({...form, deadlineDate: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white cursor-pointer" style={{colorScheme: "dark"}} required /></div>`
)

content = content.replace(
  `<div><label className="block text-sm text-gray-400 mb-1">Deadline (ora Romania)</label><input type="time" value={form.deadlineTime} onChange={e => setForm({...form, deadlineTime: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" required /></div>`,
  `<div><label className="block text-sm text-gray-400 mb-1">Deadline (ora Romania)</label><input type="time" value={form.deadlineTime} onChange={e => setForm({...form, deadlineTime: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white cursor-pointer" style={{colorScheme: "dark"}} required /></div>`
)

fs.writeFileSync('app/admin/etape/page.tsx', content)
console.log('Gata!')