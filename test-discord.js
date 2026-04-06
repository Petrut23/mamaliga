const https = require('https')

const data = JSON.stringify({
  embeds: [{
    title: "🏆 Test MamaLIGA",
    description: "Webhook funcționează!",
    color: 0xe8ff47
  }]
})

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
})

req.write(data)
req.end()