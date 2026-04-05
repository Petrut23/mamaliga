const fs = require('fs')
let content = fs.readFileSync('app/clasament/page.tsx', 'utf8')

content = content.replace(
  `<div className="text-sm">Clasamentul apare dupa finalizarea primei etape</div>        
          </div>`,
  `<div className="text-sm text-gray-500 mb-6">Clasamentul apare dupa finalizarea primei etape</div>
            <a href="/" className="text-[#e8ff47] hover:underline text-sm">← Inapoi acasa</a>
          </div>`
)

fs.writeFileSync('app/clasament/page.tsx', content)
console.log('Gata!')