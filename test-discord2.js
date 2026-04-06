const https = require('https')

const data = Buffer.from(JSON.stringify({
  content: "Test MamaLIGA webhook!"
}))

const url = new URL('https://discord.com/api/webhooks/1490641691181318346/gmOiVJI-nPX6J6HKyHInbBH4nqyRKK0HMGgrduUauA-y6aYLX9HEEzGfSwWyjyEd_mAs')

const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode)
  res.on('data', d => console.log(d.toString()))
})

req.write(data)
req.end()