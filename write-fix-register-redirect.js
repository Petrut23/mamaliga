const fs = require('fs')

// Fix register - redirect cu mesaj
let register = fs.readFileSync('app/register/page.tsx', 'utf8')
register = register.replace(
  `router.push("/login")`,
  `router.push("/login?pending=true")`
)
fs.writeFileSync('app/register/page.tsx', register)

// Fix login - afiseaza mesaj daca pending=true
let login = fs.readFileSync('app/login/page.tsx', 'utf8')

// Adaugam import useSearchParams
login = login.replace(
  `"use client"
import { useState`,
  `"use client"
import { useState, useEffect`
)

login = login.replace(
  `import { useRouter } from "next/navigation"`,
  `import { useRouter, useSearchParams } from "next/navigation"`
)

// Adaugam state pentru mesaj pending
login = login.replace(
  `  const [error, setError] = useState("")`,
  `  const [error, setError] = useState("")
  const [pendingMsg, setPendingMsg] = useState("")
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams.get("pending") === "true") {
      setPendingMsg("Contul tau a fost creat si asteapta aprobare. Vei primi un email cand poti intra in aplicatie.")
    }
  }, [searchParams])`
)

// Adaugam mesajul in UI - dupa primul div sau inainte de form
login = login.replace(
  `      {error && (`,
  `      {pendingMsg && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold px-4 py-3 rounded-xl text-center mb-4">
          ✅ {pendingMsg}
        </div>
      )}
      {error && (`
)

fs.writeFileSync('app/login/page.tsx', login)
console.log('Gata!')