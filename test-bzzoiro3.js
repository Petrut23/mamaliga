const https = require('https')

const options = {
  hostname: 'sports.bzzoiro.com',
  path: '/api/leagues/',
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
    const romania = parsed.results.filter(l => l.country === 'Romania')
    console.log('Total ligi:', parsed.count)
    console.log('Romania:', JSON.stringify(romania, null, 2))
    console.log('Toate tarile:', [...new Set(parsed.results.map(l => l.country))].sort().join(', '))
  })
}).on('error', console.error)