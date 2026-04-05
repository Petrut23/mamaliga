const fs = require('fs')
let content = fs.readFileSync('app/predictii/page.tsx', 'utf8')

// Adauga toast state
content = content.replace(
  '  const [msg, setMsg] = useState("")',
  '  const [msg, setMsg] = useState("")\n  const [toast, setToast] = useState("")\n  const [toastType, setToastType] = useState("success")'
)

// Functie showToast
content = content.replace(
  '  async function loadData() {',
  `  function showToast(message: string, type: string = "success") {
    setToast(message)
    setToastType(type)
    setTimeout(() => setToast(""), 3500)
  }

  async function loadData() {`
)

// Inlocuieste setMsg cu showToast
content = content.replace(
  'setMsg("⚠️ Trebuie sa alegi un meci capitan inainte de a salva!")',
  'showToast("⚠️ Trebuie sa alegi un meci capitan!", "error")'
)
content = content.replace(
  'setMsg("Predictiile au fost salvate!")',
  'showToast("✅ Predictiile au fost salvate!")'
)
content = content.replace(
  'setMsg("Eroare la salvare. Incearca din nou.")',
  'showToast("❌ Eroare la salvare. Incearca din nou.", "error")'
)

// Adauga toast UI inainte de </div> final
content = content.replace(
  '      {!isLocked && (',
  `      {toast && (
        <div className={"fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition-all " + (toastType === "error" ? "bg-red-500 text-white" : "bg-[#e8ff47] text-black")}>
          {toast}
        </div>
      )}

      {!isLocked && (`
)

// Sterge vechiul msg din UI
content = content.replace(
  `        {msg && (
          <div className={\\"rounded-xl px-4 py-3 mb-6 text-sm font-semibold \\" + (msg.includes(\\"Eroare\\") ? \\"bg-red-500/10 border border-red-500/20 text-red-400\\" : \\"bg-green-500/10 border border-green-500/20 text-green-400\\")}>
            {msg}
          </div>
        )}`,
  ''
)

fs.writeFileSync('app/predictii/page.tsx', content)
console.log('Gata!')