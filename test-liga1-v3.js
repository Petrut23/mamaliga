const https = require('https')

const options = {
  hostname: 'v3.football.api-sports.io',
  path: '/leagues?country=Romania&name=Liga+1',
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
    console.log(JSON.stringify(parsed, null, 2))
  })
}).on('error', console.error)