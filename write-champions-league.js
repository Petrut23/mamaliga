const fs = require('fs')

// Adauga Champions League in import
let importContent = fs.readFileSync('app/api/admin/import-meciuri/route.ts', 'utf8')
importContent = importContent.replace(
  `  "Ligue 1": "FL1",`,
  `  "Ligue 1": "FL1",
  "Champions League": "CL",`
)
fs.writeFileSync('app/api/admin/import-meciuri/route.ts', importContent)

// Adauga Champions League in sync-scoruri
let syncContent = fs.readFileSync('app/api/admin/sync-scoruri/route.ts', 'utf8')
syncContent = syncContent.replace(
  `  "Ligue 1": "FL1",`,
  `  "Ligue 1": "FL1",
    "Champions League": "CL",`
)
fs.writeFileSync('app/api/admin/sync-scoruri/route.ts', syncContent)

// Adauga flag Champions League in pagina meciuri
let meciuriContent = fs.readFileSync('app/admin/meciuri/page.tsx', 'utf8')
meciuriContent = meciuriContent.replace(
  `  "Liga 1 Romania": "🇷🇴",`,
  `  "Liga 1 Romania": "🇷🇴",
  "Champions League": "🏆",`
)
meciuriContent = meciuriContent.replace(
  `const COMPETITIONS = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Liga 1 Romania"]`,
  `const COMPETITIONS = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Liga 1 Romania", "Champions League"]`
)
fs.writeFileSync('app/admin/meciuri/page.tsx', meciuriContent)

// Adauga flag Champions League in pagina live
let liveContent = fs.readFileSync('app/live/page.tsx', 'utf8')
liveContent = liveContent.replace(
  `  "Liga 1 Romania": "🇷🇴",`,
  `  "Liga 1 Romania": "🇷🇴",
  "Champions League": "🏆",`
)
fs.writeFileSync('app/live/page.tsx', liveContent)

// Adauga flag Champions League in pagina predictii
let predContent = fs.readFileSync('app/predictii/page.tsx', 'utf8')
predContent = predContent.replace(
  `  "Liga 1 Romania": "🇷🇴",`,
  `  "Liga 1 Romania": "🇷🇴",
  "Champions League": "🏆",`
)
fs.writeFileSync('app/predictii/page.tsx', predContent)

console.log('Gata!')