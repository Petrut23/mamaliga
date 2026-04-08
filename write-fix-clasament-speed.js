const fs = require('fs')
let content = fs.readFileSync('app/clasament/page.tsx', 'utf8')

content = content.replace(
  `  useEffect(() => {
    Promise.all([
      fetch("/api/clasament").then(r => r.json()),
      fetch("/api/badges/all").then(r => r.json())
    ]).then(([clasament, badges]) => {
      setData(clasament)
      setBadgesData(badges.userBadges || {})
      setLoading(false)
    })
  }, [])`,
  `  useEffect(() => {
    // Incarcam clasamentul instant
    fetch("/api/clasament").then(r => r.json()).then(clasament => {
      setData(clasament)
      setLoading(false)
    })
    // Incarcam badge-urile separat in fundal
    fetch("/api/badges/all").then(r => r.json()).then(badges => {
      setBadgesData(badges.userBadges || {})
    }).catch(() => {})
  }, [])`
)

fs.writeFileSync('app/clasament/page.tsx', content)
console.log('Gata!')