const fs = require('fs')
const content = fs.readFileSync('package.json', 'utf8')
console.log(content)