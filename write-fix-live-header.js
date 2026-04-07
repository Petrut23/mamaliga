const fs = require('fs')
let content = fs.readFileSync('app/live/page.tsx', 'utf8')

content = content.replace(
  `                            <div className="flex text-xs text-gray-600 mb-1 px-1 gap-2">
                              <span className="w-24">Jucator</span>
                              <span className="w-16">Scor</span>
                              <span className="w-12">Pct</span>
                            </div>`,
  ``
)

fs.writeFileSync('app/live/page.tsx', content)
console.log('Gata!')