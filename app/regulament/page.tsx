"use client"

export default function RegulamentPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-white pb-12">
      <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">MamaLIGA</div>
          <div className="text-3xl font-black">Regulament & Premii</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Premii */}
        <div className="bg-[#111520] border border-[#1e2640] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2640] flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span className="font-black text-lg text-white">Premii Finale</span>
          </div>
          <div className="divide-y divide-[#1e2640]">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥇</span>
                <span className="font-bold text-white">Locul 1</span>
              </div>
              <span className="text-2xl font-black text-[#fbbf24]">500 RON</span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥈</span>
                <span className="font-bold text-white">Locul 2</span>
              </div>
              <span className="text-2xl font-black text-gray-400">200 RON</span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥉</span>
                <span className="font-bold text-white">Locul 3</span>
              </div>
              <span className="text-2xl font-black text-amber-600">100 RON</span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between bg-[#0a0d14]">
              <div className="flex items-center gap-3">
                <span className="text-xl">💰</span>
                <span className="font-bold text-gray-400">Taxa de acces</span>
              </div>
              <span className="text-lg font-black text-gray-400">100 RON</span>
            </div>
          </div>
        </div>

        {/* Regulament Competitie */}
        <div className="bg-[#111520] border border-[#1e2640] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2640] flex items-center gap-2">
            <span className="text-lg">📋</span>
            <span className="font-black text-lg text-white">Reguli Competiție</span>
          </div>
          <div className="divide-y divide-[#1e2640]">
            <div className="px-5 py-4 flex gap-4">
              <span className="text-[#e8ff47] font-black text-sm w-5 flex-shrink-0 mt-0.5">1</span>
              <div>
                <div className="font-semibold text-white mb-1">Zile de competiție</div>
                <div className="text-sm text-gray-400">Competiția rulează doar în zilele de Sâmbătă și Duminică</div>
              </div>
            </div>
            <div className="px-5 py-4 flex gap-4">
              <span className="text-[#e8ff47] font-black text-sm w-5 flex-shrink-0 mt-0.5">2</span>
              <div>
                <div className="font-semibold text-white mb-1">Condiție etapă</div>
                <div className="text-sm text-gray-400">O etapă are loc doar dacă minimum 4 campionate din 6 au jocuri în weekendul respectiv</div>
              </div>
            </div>
            <div className="px-5 py-4 flex gap-4">
              <span className="text-[#e8ff47] font-black text-sm w-5 flex-shrink-0 mt-0.5">3</span>
              <div>
                <div className="font-semibold text-white mb-1">Finalul competiției</div>
                <div className="text-sm text-gray-400">Competiția se încheie când 3 din cele 6 campionate au terminat sezonul</div>
              </div>
            </div>
            <div className="px-5 py-4 flex gap-4">
              <span className="text-[#e8ff47] font-black text-sm w-5 flex-shrink-0 mt-0.5">4</span>
              <div>
                <div className="font-semibold text-white mb-1">Postare meciuri</div>
                <div className="text-sm text-gray-400">Meciurile disponibile sunt postate cel târziu Joi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reguli Participanti */}
        <div className="bg-[#111520] border border-[#1e2640] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2640] flex items-center gap-2">
            <span className="text-lg">👤</span>
            <span className="font-black text-lg text-white">Reguli Participanți</span>
          </div>
          <div className="divide-y divide-[#1e2640]">
            <div className="px-5 py-4 flex gap-4">
              <span className="text-[#e8ff47] font-black text-sm w-5 flex-shrink-0 mt-0.5">1</span>
              <div>
                <div className="font-semibold text-white mb-1">Rezultate finale</div>
                <div className="text-sm text-gray-400">Odată postate, rezultatele nu se editează, chiar dacă meciurile nu au început</div>
              </div>
            </div>
            <div className="px-5 py-4 flex gap-4">
              <span className="text-[#e8ff47] font-black text-sm w-5 flex-shrink-0 mt-0.5">2</span>
              <div>
                <div className="font-semibold text-white mb-1">Termen limită</div>
                <div className="text-sm text-gray-400">Rezultatele se postează până cel târziu Sâmbătă la ora 07:00 GMT+3</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sistem Punctaj */}
        <div className="bg-[#111520] border border-[#1e2640] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2640] flex items-center gap-2">
            <span className="text-lg">⚽</span>
            <span className="font-black text-lg text-white">Sistem de Punctaj</span>
          </div>
          <div className="divide-y divide-[#1e2640]">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm">1</span>
                <span className="text-white font-medium">Pronostic corect (1/X/2)</span>
              </div>
              <span className="font-black text-blue-400">1 pct</span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-black text-sm">2</span>
                <span className="text-white font-medium">Diferență de goluri corectă / Egal</span>
              </div>
              <span className="font-black text-yellow-400">2 pct</span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-black text-sm">5</span>
                <span className="text-white font-medium">Scor exact</span>
              </div>
              <span className="font-black text-green-400">5 pct</span>
            </div>
            <div className="px-5 py-4 bg-[#e8ff47]/5 border-t border-[#e8ff47]/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⭐</span>
                <span className="font-black text-[#e8ff47]">Meciul Căpitan</span>
              </div>
              <div className="text-sm text-gray-400">
                În fiecare etapă alegi un meci Căpitan — punctele obținute la acel meci se dublează.
                Dacă nu alegi un căpitan, nu beneficiezi de puncte duble în acea etapă.
              </div>
            </div>
          </div>
        </div>

        {/* Departajare Etapa */}
        <div className="bg-[#111520] border border-[#1e2640] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2640] flex items-center gap-2">
            <span className="text-lg">🏅</span>
            <span className="font-black text-lg text-white">Câștigător Etapă</span>
          </div>
          <div className="px-5 py-4">
            <div className="text-sm text-gray-400 mb-4">
              Participantul cu cele mai multe puncte este desemnat Câștigător de Etapă.
            </div>
            <div className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">Departajare la egalitate de puncte</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#e8ff47]/10 border border-[#e8ff47]/30 flex items-center justify-center text-[#e8ff47] font-black text-xs flex-shrink-0">1</span>
                <span className="text-sm text-gray-300">Puncte totale în etapă</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#e8ff47]/10 border border-[#e8ff47]/30 flex items-center justify-center text-[#e8ff47] font-black text-xs flex-shrink-0">2</span>
                <span className="text-sm text-gray-300">Număr meciuri cu 5 puncte (scor exact)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#e8ff47]/10 border border-[#e8ff47]/30 flex items-center justify-center text-[#e8ff47] font-black text-xs flex-shrink-0">3</span>
                <span className="text-sm text-gray-300">Număr meciuri cu 2 puncte (diferență / egal)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#e8ff47]/10 border border-[#e8ff47]/30 flex items-center justify-center text-[#e8ff47] font-black text-xs flex-shrink-0">4</span>
                <span className="text-sm text-gray-300">random.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clasament General */}
        <div className="bg-[#111520] border border-[#1e2640] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2640] flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span className="font-black text-lg text-white">Clasament General & Câștigător Final</span>
          </div>
          <div className="px-5 py-4">
            <div className="text-sm text-gray-400 mb-4">
              Participantul cu cele mai multe victorii de etapă este desemnat Câștigătorul MamaLigii.
            </div>
            <div className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">Departajare finală la egalitate de victorii</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#e8ff47]/10 border border-[#e8ff47]/30 flex items-center justify-center text-[#e8ff47] font-black text-xs flex-shrink-0">1</span>
                <span className="text-sm text-gray-300">Număr victorii de etapă</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#e8ff47]/10 border border-[#e8ff47]/30 flex items-center justify-center text-[#e8ff47] font-black text-xs flex-shrink-0">2</span>
                <span className="text-sm text-gray-300">Număr total de puncte</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#e8ff47]/10 border border-[#e8ff47]/30 flex items-center justify-center text-[#e8ff47] font-black text-xs flex-shrink-0">3</span>
                <span className="text-sm text-gray-300">Best Week — cel mai mare punctaj într-o etapă</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#e8ff47]/10 border border-[#e8ff47]/30 flex items-center justify-center text-[#e8ff47] font-black text-xs flex-shrink-0">4</span>
                <span className="text-sm text-gray-300">Număr etape jucate</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#e8ff47]/10 border border-[#e8ff47]/30 flex items-center justify-center text-[#e8ff47] font-black text-xs flex-shrink-0">5</span>
                <span className="text-sm text-gray-300">random.org</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}