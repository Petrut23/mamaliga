const https = require('https')

const options = {
  hostname: 'sports.bzzoiro.com',
  path: '/api/leagues/?country=Romania',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer 2996fce77be5c6eadb555a607c3b0a418a8472e9'
  }
}

https.get(options, (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    const parsed = JSON.parse(data)
    console.log(JSON.stringify(parsed, null, 2))
  })
}).on('error', console.error)