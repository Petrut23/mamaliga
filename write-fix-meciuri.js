const fs = require('fs')
let content = fs.readFileSync('app/admin/meciuri/page.tsx', 'utf8')
content = content.replace(
  'const searchParams = useSearchParams()\n  const roundId = searchParams.get("roundId") || ""',
  'const searchParams = useSearchParams()\n  const roundId = searchParams?.get("roundId") || ""'
)
content = content.replace(
  'const [meciuri, setMeciuri] = useState([])',
  'const [meciuri, setMeciuri] = useState<any[]>([])'
)
content = content.replace(
  'const [etape, setEtape] = useState([])',
  'const [etape, setEtape] = useState<any[]>([])'
)
content = content.replace(
  'const [availableMatches, setAvailableMatches] = useState([])',
  'const [availableMatches, setAvailableMatches] = useState<any[]>([])'
)
fs.writeFileSync('app/admin/meciuri/page.tsx', content)
console.log('Gata!')