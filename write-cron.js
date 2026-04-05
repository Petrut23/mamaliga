const fs = require('fs')

// Vercel cron config
const vercelJson = {
  "crons": [
    {
      "path": "/api/admin/sync-scoruri",
      "schedule": "*/20 * * * *"
    }
  ]
}

fs.writeFileSync('vercel.json', JSON.stringify(vercelJson, null, 2))
console.log('Gata!')