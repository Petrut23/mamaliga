const https = require('https')

const options = {
  hostname: 'sports.bzzoiro.com',
  path: '/api/events/?league=23',
  method: 'GET',
  headers: {
    'Authorization': 'Token 2996fce77be5c6eadb555a607c3b0a418a8472e9',
    'Content-Type': 'application/json'
  }
}

https.get(options, (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    const parsed = JSON.parse(data)
    console.log('Total meciuri:', parsed.count)
    parsed.results.slice(0, 5).forEach(m => {
      console.log(m.home_team, 'vs', m.away_team, '-', m.event_date, '-', m.status)
    })
  })
}).on('error', console.error)