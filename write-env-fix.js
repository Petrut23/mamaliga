const fs = require('fs')
let content = fs.readFileSync('.env', 'utf8')
content = content.replace(
  /DATABASE_URL=.*/,
  'DATABASE_URL="postgresql://postgres.jamlzvgxpgvxiszirich:cZs5Zp6M8F3Joymd@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"'
)
fs.writeFileSync('.env', content)
console.log('Gata!')