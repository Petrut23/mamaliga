const https = require('https')

const options = {
  hostname: 'v3.football.api-sports.io',
  path: '/leagues?country=Romania',
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
    parsed.response.forEach((l) => {
      console.log('ID:', l.league.id, '| Nume:', l.league.name, '| Tip:', l.league.type)
    })
  })
}).on('error', console.error)