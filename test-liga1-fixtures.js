const https = require('https')

const options = {
  hostname: 'v3.football.api-sports.io',
  path: '/fixtures?league=283&season=2025&from=2026-04-11&to=2026-04-13',
  method: 'GET',
  headers: {
    'x-apisports-key': 'f32ba8a87394d59947f1c4cbd3a10321'
  }
}

https.get(options, (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    const parsed = JSON.parse(data)
    console.log('Total:', parsed.results)
    console.log('Errors:', JSON.stringify(parsed.errors))
    if (parsed.response?.length > 0) {
      parsed.response.forEach(m => {
        console.log(m.teams.home.name, 'vs', m.teams.away.name, '-', m.fixture.date)
      })
    }
  })
}).on('error', console.error)