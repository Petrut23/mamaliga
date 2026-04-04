const https = require('https')

const options = {
  hostname: 'api-football-v1.p.rapidapi.com',
  path: '/v3/leagues?country=Romania&name=Liga+1',
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'f32ba8a87394d59947f1c4cbd3a10321',
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
}

https.get(options, (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => console.log(JSON.stringify(JSON.parse(data), null, 2)))
}).on('error', console.error)