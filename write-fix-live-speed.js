const fs = require('fs')
let content = fs.readFileSync('app/live/page.tsx', 'utf8')

content = content.replace(
  `  const fetchData = useCallback(async () => {
    try {
      fetch("/api/admin/sync-scoruri").catch(() => {})
      const res = await fetch("/api/live")
      const d = await res.json()
      setData(d)
      setLastSync(new Date())
    } catch (err) {
      console.error("Eroare fetch live:", err)
    } finally {
      setLoading(false)
    }
  }, [])`,
  `  const fetchData = useCallback(async () => {
    try {
      // Incarcam datele din DB instant
      const res = await fetch("/api/live")
      const d = await res.json()
      setData(d)
      setLastSync(new Date())
      // Sync in fundal - nu blocheaza UI
      fetch("/api/admin/sync-scoruri").catch(() => {})
    } catch (err) {
      console.error("Eroare fetch live:", err)
    } finally {
      setLoading(false)
    }
  }, [])`
)

fs.writeFileSync('app/live/page.tsx', content)
console.log('Gata!')