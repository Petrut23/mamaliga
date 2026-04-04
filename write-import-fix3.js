const fs = require('fs')
let content = fs.readFileSync('app/api/admin/import-meciuri/route.ts', 'utf8')
content = content.replace(
  `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=283&season=2025&from=\${dateFrom}&to=\${dateTo}&status=NS`,
  `https://v3.football.api-sports.io/fixtures?league=283&season=2025&from=\${dateFrom}&to=\${dateTo}&status=NS`
)
content = content.replace(
  `"X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"`,
  `"x-apisports-key": process.env.RAPIDAPI_KEY || ""`
)
fs.writeFileSync('app/api/admin/import-meciuri/route.ts', content)
console.log('Gata!')