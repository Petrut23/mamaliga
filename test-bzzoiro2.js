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
  console.log('Status:', res.statusCode)
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    console.log(data.substring(0, 500))
  })
}).on('error', console.error)