"use client"

export default function WorldCupPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">🏆 FIFA</div>
          <div className="text-3xl font-black">World Cup 2026</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/world-cup/predictii" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">📋</div>
            <div className="font-bold text-white">Predicții</div>
          </a>
          <a href="/world-cup/live" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">🔴</div>
            <div className="font-bold text-white">Live</div>
          </a>
          <a href="/world-cup/clasament" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">🏆</div>
            <div className="font-bold text-white">Clasament</div>
          </a>
          <a href="/world-cup/rezultate" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors text-center">
            <div className="text-3xl mb-3">📊</div>
            <div className="font-bold text-white">Rezultatele mele</div>
          </a>
        </div>
      </div>
    </div>
  )
}
