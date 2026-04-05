const fs = require('fs')

// Fix clasament - adauga buton inapoi acasa
let clasament = fs.readFileSync('app/clasament/page.tsx', 'utf8')
clasament = clasament.replace(
  `          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏆</div>
            <div className="text-lg font-bold text-white mb-2">Niciun clasament inca</div>
            <div className="text-sm text-gray-500">Clasamentul apare dupa finalizarea primei etape</div>
          </div>`,
  `          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏆</div>
            <div className="text-lg font-bold text-white mb-2">Niciun clasament inca</div>
            <div className="text-sm text-gray-500 mb-6">Clasamentul apare dupa finalizarea primei etape</div>
            <a href="/" className="text-[#e8ff47] hover:underline text-sm">← Inapoi acasa</a>
          </div>`
)
fs.writeFileSync('app/clasament/page.tsx', clasament)

// Fix rezultate - adauga buton inapoi acasa
let rezultate = fs.readFileSync('app/rezultate/page.tsx', 'utf8')
rezultate = rezultate.replace(
  `          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <div className="text-lg font-bold text-white mb-2">Niciun rezultat inca</div>
            <div className="text-sm text-gray-500">Rezultatele apar dupa finalizarea primei etape</div>
          </div>`,
  `          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <div className="text-lg font-bold text-white mb-2">Niciun rezultat inca</div>
            <div className="text-sm text-gray-500 mb-6">Rezultatele apar dupa finalizarea primei etape</div>
            <a href="/" className="text-[#e8ff47] hover:underline text-sm">← Inapoi acasa</a>
          </div>`
)
fs.writeFileSync('app/rezultate/page.tsx', rezultate)

console.log('Gata!')