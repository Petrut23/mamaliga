const fs = require('fs')
let content = fs.readFileSync('app/admin/etape/page.tsx', 'utf8')

// Fix 1: datetime-local arata calendar nativ in browser - deja e corect
// Fix 2: deadline nu mai forteaza ora 23:59
content = content.replace(
  `const localDeadline = new Date(deadline.getTime() - deadline.getTimezoneOffset() * 60000).toISOString().slice(0, 16)`,
  `const offset = deadline.getTimezoneOffset() * 60000
    const localDeadline = new Date(deadline.getTime() - offset).toISOString().slice(0, 16)`
)

// Fix form - inlocuim input datetime-local cu date + time separate
content = content.replace(
  `<div><label className="block text-sm text-gray-400 mb-1">Deadline</label><input type="datetime-local" value={form.deadlineAt} onChange={e => setForm({...form, deadlineAt: e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" required /></div>`,
  `<div><label className="block text-sm text-gray-400 mb-1">Deadline (data)</label><input type="date" value={form.deadlineAt ? form.deadlineAt.split('T')[0] : ''} onChange={e => setForm({...form, deadlineAt: e.target.value + 'T' + (form.deadlineAt ? form.deadlineAt.split('T')[1] || '23:59' : '23:59')})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" required /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Deadline (ora)</label><input type="time" value={form.deadlineAt ? form.deadlineAt.split('T')[1] || '23:59' : '23:59'} onChange={e => setForm({...form, deadlineAt: (form.deadlineAt ? form.deadlineAt.split('T')[0] : '') + 'T' + e.target.value})} className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-3 py-2 text-white" required /></div>`
)

fs.writeFileSync('app/admin/etape/page.tsx', content)
console.log('Gata!')