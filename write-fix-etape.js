const fs = require('fs')
let content = fs.readFileSync('app/admin/etape/page.tsx', 'utf8')
content = content.replace(
  'const [etape, setEtape] = useState([])',
  'const [etape, setEtape] = useState<any[]>([])'
)
content = content.replace(
  'const [sezoane, setSezoane] = useState([])',
  'const [sezoane, setSezoane] = useState<any[]>([])'
)
fs.writeFileSync('app/admin/etape/page.tsx', content)
console.log('Gata!')