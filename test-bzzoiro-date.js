const https = require('https')

const options = {
  hostname: 'sports.bzzoiro.com',
  path: '/api/events/?league=23&date_from=2026-04-07&date_to=2026-04-07',
  method: 'GET',
  headers: {
    'Authorization': 'Token 2996fce77be5c6eadb555a607c3b0a418a8472e9',
    'Content-Type': 'application/json'
  }
}

https.get(options, (res) => {
  let data = ''
  console.log('Status:', res.statusCode)
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    const parsed = JSON.parse(data)
    console.log('Total:', parsed.count)
    console.log('Primul rezultat:', JSON.stringify(parsed.results?.[0], null, 2))
  })
}).on('error', console.error)