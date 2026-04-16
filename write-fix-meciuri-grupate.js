const fs = require('fs')
let content = fs.readFileSync('app/admin/meciuri/page.tsx', 'utf8')

// Inlocuim afisarea simpla cu afisare grupata pe campionate
content = content.replace(
  `        {loading ? <div className="text-gray-500 text-center py-20">Se incarca...</div> : meciuri.length === 0 && selectedRound ? <div className="text-center py-20 text-gray-500">Nu exista meciuri.</div> : (
          <div className="space-y-2">
            {meciuri.map((meci: any) => (
              <div key={meci.id} className="bg-[#111520] border border-[#1e2640] rounded-xl px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs text-gray-500 bg-[#0a0d14] px-2 py-1 rounded">{COMPETITION_FLAGS[meci.competitionName] || "🏆"} {meci.competitionName}</span>
                  <span className="font-bold">{meci.homeTeam} vs {meci.awayTeam}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{new Date(meci.kickoffAt).toLocaleString("ro-RO")}</span>
                  <button onClick={() => startEdit(meci)} className="text-xs bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-3 py-1 rounded-lg hover:bg-[#3b82f6]/20">Edit</button>
                  <button onClick={() => deleteMeci(meci.id)} className="text-xs text-red-400 border border-red-400/20 px-3 py-1 rounded-lg hover:bg-red-400/10 transition-colors">Sterge</button>
                </div>
              </div>
            ))}
          </div>
        )}`,
  `        {loading ? <div className="text-gray-500 text-center py-20">Se incarca...</div> : meciuri.length === 0 && selectedRound ? <div className="text-center py-20 text-gray-500">Nu exista meciuri.</div> : (
          <div className="space-y-6">
            {Object.entries(meciuri.reduce((acc: any, m: any) => {
              if (!acc[m.competitionName]) acc[m.competitionName] = []
              acc[m.competitionName].push(m)
              return acc
            }, {})).map(([comp, compMeciuri]: any) => (
              <div key={comp}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-lg">{COMPETITION_FLAGS[comp] || "🏆"}</span>
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{comp}</span>
                  <span className="text-xs text-gray-600">({compMeciuri.length} meciuri)</span>
                </div>
                <div className="space-y-2">
                  {compMeciuri.map((meci: any) => (
                    <div key={meci.id} className="bg-[#111520] border border-[#1e2640] rounded-xl px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-bold">{meci.homeTeam} vs {meci.awayTeam}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{new Date(meci.kickoffAt).toLocaleString("ro-RO")}</span>
                        <button onClick={() => startEdit(meci)} className="text-xs bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-3 py-1 rounded-lg hover:bg-[#3b82f6]/20">Edit</button>
                        <button onClick={() => deleteMeci(meci.id)} className="text-xs text-red-400 border border-red-400/20 px-3 py-1 rounded-lg hover:bg-red-400/10 transition-colors">Sterge</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}`
)

fs.writeFileSync('app/admin/meciuri/page.tsx', content)
console.log('Gata!')