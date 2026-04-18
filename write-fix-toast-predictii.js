const fs = require('fs')
let content = fs.readFileSync('app/predictii/page.tsx', 'utf8')

// Inlocuim sistemul de toast cu unul premium centrat
content = content.replace(
  `  const [toast, setToast] = useState("")
  const [toastType, setToastType] = useState("success")`,
  `  const [toast, setToast] = useState("")
  const [toastType, setToastType] = useState("success")
  const [toastVisible, setToastVisible] = useState(false)`
)

content = content.replace(
  `  function showToast(message: string, type: string = "success") {
    setToast(message)
    setToastType(type)
    setTimeout(() => setToast(""), 3500)
  }`,
  `  function showToast(message: string, type: string = "success") {
    setToast(message)
    setToastType(type)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }`
)

// Redirect dupa salvare
content = content.replace(
  `    if (res.ok) {
      showToast("✅ Predictiile au fost salvate!")
    } else {`,
  `    if (res.ok) {
      showToast("✅ Predictiile au fost salvate!")
      setTimeout(() => { window.location.href = "/live" }, 2000)
    } else {`
)

// Inlocuim toast UI cu unul premium
content = content.replace(
  `      {toast && (
        <div className={"fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition-all " + (toastType === "error" ? "bg-red-500 text-white" : "bg-[#e8ff47] text-black")}>
          {toast}
        </div>
      )}`,
  `      {toast && (
        <div className={"fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none"}>
          <div className={"pointer-events-auto max-w-sm w-full mx-auto rounded-2xl px-6 py-5 shadow-2xl transition-all duration-300 " + 
            (toastVisible ? "opacity-100 scale-100" : "opacity-0 scale-95") + " " +
            (toastType === "error" 
              ? "bg-[#1a0a0a] border border-red-500/40" 
              : "bg-[#0a1a0a] border border-green-500/40")}
            style={{backdropFilter: "blur(20px)"}}>
            <div className="flex items-center gap-4">
              <div className={"text-3xl flex-shrink-0"}>
                {toastType === "error" ? "❌" : "✅"}
              </div>
              <div>
                <div className={"text-sm md:text-base font-bold " + (toastType === "error" ? "text-red-400" : "text-green-400")}>
                  {toastType === "error" ? "Atentie!" : "Salvat!"}
                </div>
                <div className="text-xs md:text-sm text-gray-300 mt-0.5">
                  {toast.replace("✅ ", "").replace("⚠️ ", "").replace("❌ ", "")}
                </div>
              </div>
            </div>
            {toastType !== "error" && (
              <div className="mt-3 h-1 bg-green-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full animate-pulse" style={{width: "100%"}}></div>
              </div>
            )}
          </div>
        </div>
      )}`
)

fs.writeFileSync('app/predictii/page.tsx', content)
console.log('Gata!')