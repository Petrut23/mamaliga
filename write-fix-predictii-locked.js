const fs = require('fs')
let content = fs.readFileSync('app/predictii/page.tsx', 'utf8')

content = content.replace(
  `  if (!round) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⚽</div>
        <div className="text-xl font-bold text-white mb-2">Nicio etapa activa</div>
        <div className="text-gray-500">Adminul nu a creat inca o etapa.</div>
        <a href="/" className="mt-6 inline-block text-[#e8ff47] hover:underline">← Inapoi acasa</a>
      </div>
    </div>
  )`,
  `  if (!round) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⚽</div>
        <div className="text-xl font-bold text-white mb-2">Nicio etapa activa</div>
        <div className="text-gray-500">Adminul nu a creat inca o etapa.</div>
        <a href="/" className="mt-6 inline-block text-[#e8ff47] hover:underline">← Inapoi acasa</a>
      </div>
    </div>
  )

  if (isLocked) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-7xl mb-6">🔒</div>
        <div className="text-3xl font-black text-white mb-3">Timpul a expirat!</div>
        <div className="text-gray-400 mb-2">{round.title}</div>
        <div className="text-gray-500 text-sm mb-8">Deadline-ul pentru predictii a trecut. Urmareste meciurile si clasamentul live!</div>
        <a href="/live" className="bg-[#e8ff47] text-black font-black px-8 py-3 rounded-xl hover:bg-[#f5ff6e] transition-colors inline-block">
          Vezi Live Scoreboard 🔴
        </a>
        <div className="mt-4">
          <a href="/" className="text-gray-500 text-sm hover:text-white">← Inapoi acasa</a>
        </div>
      </div>
    </div>
  )`
)

fs.writeFileSync('app/predictii/page.tsx', content)
console.log('Gata!')