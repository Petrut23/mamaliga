const https = require('https')

const data = JSON.stringify({ roundId: 'cmnkjzmwl00018ayqwt99uj5o' })

const options = {
  hostname: 'mamaliga.vercel.app',
  path: '/api/admin/calcul-puncte',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = https.request(options, (res) => {
  let body = ''
  res.on('data', chunk => body += chunk)
  res.on('end', () => console.log(body))
})

req.write(data)
req.end()