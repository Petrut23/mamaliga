const fs = require('fs')

// Fix admin/page.tsx - sterge navbar hardcodat
let admin = fs.readFileSync('app/admin/page.tsx', 'utf8')
admin = admin.replace(
  `      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between">
        <div className="text-2xl font-black tracking-widest">Mama<span className="text-[#e8ff47]">LIGA</span> <span className="text-sm font-normal text-gray-500">Admin</span></div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">{session.user?.name}</span>
          <a href="/" className="text-xs font-semibold text-gray-500 hover:text-white">← Site</a>
        </div>
      </nav>`,
  ``
)
fs.writeFileSync('app/admin/page.tsx', admin)

// Fix admin/etape/page.tsx - sterge navbar hardcodat
let etape = fs.readFileSync('app/admin/etape/page.tsx', 'utf8')
etape = etape.replace(
  `      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between">
        <div className="text-2xl font-black tracking-widest">Mama<span className="text-[#e8ff47]">LIGA</span> <span className="text-sm font-normal text-gray-500">Admin</span></div>
        <div className="flex gap-4 text-sm">
          <a href="/admin" className="text-gray-500 hover:text-white">Dashboard</a>
          <a href="/admin/etape" className="text-[#e8ff47]">Etape</a>
          <a href="/admin/meciuri" className="text-gray-500 hover:text-white">Meciuri</a>
        </div>
      </nav>`,
  ``
)
fs.writeFileSync('app/admin/etape/page.tsx', etape)

// Fix admin/meciuri/page.tsx - sterge navbar hardcodat
let meciuri = fs.readFileSync('app/admin/meciuri/page.tsx', 'utf8')
meciuri = meciuri.replace(
  `      <nav className="bg-[#111520] border-b border-[#1e2640] px-6 h-14 flex items-center justify-between">
        <div className="text-2xl font-black tracking-widest">Mama<span className="text-[#e8ff47]">LIGA</span> <span className="text-sm font-normal text-gray-500">Admin</span></div>
        <div className="flex gap-4 text-sm">
          <a href="/admin" className="text-gray-500 hover:text-white">Dashboard</a>
          <a href="/admin/etape" className="text-gray-500 hover:text-white">Etape</a>
          <a href="/admin/meciuri" className="text-[#e8ff47]">Meciuri</a>
        </div>
      </nav>`,
  ``
)
fs.writeFileSync('app/admin/meciuri/page.tsx', meciuri)

console.log('Gata!')