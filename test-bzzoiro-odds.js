const https = require('https')

const options = {
  hostname: 'sports.bzzoiro.com',
  path: '/api/predictions/?upcoming=true',
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
    console.log('Total:', parsed.count)
    console.log('Primul:', JSON.stringify(parsed.results?.[0], null, 2))
  })
}).on('error', console.error)