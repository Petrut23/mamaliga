const fs = require('fs')
fs.writeFileSync('vercel.json', JSON.stringify({
  "crons": [
    {
      "path": "/api/admin/sync-scoruri",
      "schedule": "*/20 * * * *"
    }
  ]
}, null, 2))
console.log(new Date().toISOString(), 'updated')