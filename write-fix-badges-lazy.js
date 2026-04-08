const fs = require('fs')
let content = fs.readFileSync('app/clasament/page.tsx', 'utf8')

content = content.replace(
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
  }, [])`,
  `  useEffect(() => {
    // Incarcam clasamentul instant
    fetch("/api/clasament").then(r => r.json()).then(clasament => {
      setData(clasament)
      setLoading(false)
      // Incarcam badge-urile dupa 2 secunde
      setTimeout(() => {
        fetch("/api/badges/all").then(r => r.json()).then(badges => {
          setBadgesData(badges.userBadges || {})
        }).catch(() => {})
      }, 2000)
    })
  }, [])`
)

fs.writeFileSync('app/clasament/page.tsx', content)
console.log('Gata!')