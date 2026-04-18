"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const COMPETITION_FLAGS: any = {
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "La Liga": "🇪🇸",
  "Serie A": "🇮🇹",
  "Bundesliga": "🇩🇪",
  "Ligue 1": "🇫🇷",
  "Liga 1 Romania": "🇷🇴",
  "Champions League": "🏆",
}

export default function PredictiiPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [round, setRound] = useState<any>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any>({})
  const [captain, setCaptain] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")
  const [toast, setToast] = useState("")
  const [toastType, setToastType] = useState("success")
  const [toastVisible, setToastVisible] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated") loadData()
  }, [status])

  function showToast(message: string, type: string = "success") {
    setToast(message)
    setToastType(type)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  async function loadData() {
    const res = await fetch("/api/rounds/current")
    const data = await res.json()
    if (data.round) {
      setRound(data.round)
      setMatches(data.matches || [])
      const deadline = new Date(data.round.deadlineAt)
      setIsLocked(new Date() > deadline || data.round.status === "LOCKED" || data.round.status === "LIVE" || data.round.status === "COMPLETED")
      
      const predsRes = await fetch("/api/predictions/my?roundId=" + data.round.id)
      const predsData = await predsRes.json()
      if (predsData.predictions) {
        const predsMap: any = {}
        let captainMatch = ""
        predsData.predictions.forEach((p: any) => {
          predsMap[p.matchId] = { home: String(p.predictedHome), away: String(p.predictedAway) }
          if (p.isCaptain) captainMatch = p.matchId
        })
        setPredictions(predsMap)
        setCaptain(captainMatch)
      }
    }
    setLoading(false)
  }

  function updatePrediction(matchId: string, side: "home" | "away", value: string) {
    if (isLocked) return
    const val = value.replace(/[^0-9]/g, "").slice(0, 2)
    setPredictions((prev: any) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: val }
    }))
  }

  function toggleCaptain(matchId: string) {
    if (isLocked) return
    setCaptain(prev => prev === matchId ? "" : matchId)
  }

  async function savePredictions() {
    if (isLocked) return
    
    const missingScores = matches.filter((m: any) => 
      predictions[m.id]?.home === "" || predictions[m.id]?.home === undefined ||
      predictions[m.id]?.away === "" || predictions[m.id]?.away === undefined
    )
    
    if (missingScores.length > 0) {
      showToast("⚠️ Ai " + missingScores.length + " meciuri fara scor!", "error")
      return
    }
    
    if (!captain) {
      showToast("⚠️ Trebuie sa alegi un meci capitan!", "error")
      return
    }
    setSaving(true)
    setMsg("")
    
    const preds = matches.map((m: any) => ({
      matchId: m.id,
      predictedHome: parseInt(predictions[m.id]?.home || ""),
      predictedAway: parseInt(predictions[m.id]?.away || ""),
      isCaptain: captain === m.id
    })).filter(p => !isNaN(p.predictedHome) && !isNaN(p.predictedAway))

    const res = await fetch("/api/predictions/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roundId: round.id, predictions: preds })
    })

    if (res.ok) {
      showToast("✅ Predictiile au fost salvate!")
      setTimeout(() => { window.location.href = "/live" }, 2000)
    } else {
      showToast("❌ Eroare la salvare. Incearca din nou.", "error")
    }
    setSaving(false)
  }

  const groupedMatches = matches.reduce((acc: any, m: any) => {
    if (!acc[m.competitionName]) acc[m.competitionName] = []
    acc[m.competitionName].push(m)
    return acc
  }, {})

  const filledCount = matches.filter((m: any) => 
    predictions[m.id]?.home !== "" && predictions[m.id]?.home !== undefined &&
    predictions[m.id]?.away !== "" && predictions[m.id]?.away !== undefined
  ).length

  if (loading) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-gray-500">Se incarca...</div>
    </div>
  )

  if (!round) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⚽</div>
        <div className="text-xl font-bold text-white mb-2">Nicio etapa activa</div>
        <div className="text-gray-500">Adminul nu a creat inca o etapa.</div>
        <a href="/" className="mt-6 inline-block text-[#e8ff47] hover:underline">← Inapoi acasa</a>
      </div>
    </div>
  )

  if (isLocked) return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-7xl mb-6">🔒</div>
        <div className="text-3xl font-black text-white mb-3">Timpul a expirat!</div>
        <div className="text-gray-400 mb-2">{round.title}</div>
        <div className="text-gray-500 text-sm mb-8">Deadline-ul pentru predictii a trecut. Urmareste meciurile si clasamentul live!</div>
        <a href="/live" className="bg-[#e8ff47] text-black font-black px-8 py-3 rounded-xl hover:bg-[#f5ff6e] transition-colors inline-block">
          Vezi Live Scoreboard 🔴
        </a>
        <div className="mt-4">
          <a href="/" className="text-gray-500 text-sm hover:text-white">← Inapoi acasa</a>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white pb-24">


      <div className="bg-[#111520] border-b border-[#1e2640] px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">Sezonul 2025/26</div>
            <div className="text-3xl font-black tracking-wide">{round.title}</div>
            <div className="text-sm text-gray-500 mt-1">
              {isLocked ? "🔒 Predictiile sunt blocate" : "Deadline: " + new Date(round.deadlineAt).toLocaleString("ro-RO")}
            </div>
          </div>
          {toast && (
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
      )}

      {!isLocked && (
            <div className="bg-[#0a0d14] border border-[#1e2640] rounded-xl px-5 py-3 text-center">
              <div className="text-xs font-bold tracking-widest text-[#e8ff47] uppercase mb-1">Completate</div>
              <div className="text-3xl font-black text-white">{filledCount}<span className="text-gray-500 text-lg">/{matches.length}</span></div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {!isLocked && (
          <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <span className="text-xl">⭐</span>
            <span className="text-sm text-[#fbbf24]">Apasa steaua de langa un meci pentru a-l alege ca <strong>Meci Capitan</strong> — punctele se dubleaza!</span>
          </div>
        )}

        {msg && (
          <div className={"rounded-xl px-4 py-3 mb-6 text-sm font-semibold " + (msg.includes("Eroare") ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-green-500/10 border border-green-500/20 text-green-400")}>
            {msg}
          </div>
        )}

        {Object.entries(groupedMatches).map(([comp, compMatches]: any) => (
          <div key={comp} className="mb-6">
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <span className="text-lg">{COMPETITION_FLAGS[comp] || "🏆"}</span>
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{comp}</span>
            </div>
            <div className="space-y-2">
              {compMatches.map((meci: any) => {
                const pred = predictions[meci.id] || { home: "", away: "" }
                const isCap = captain === meci.id
                return (
                  <div key={meci.id} className={"rounded-xl border px-4 py-3 transition-all " + (isCap ? "bg-[#fbbf24]/05 border-[#fbbf24]/30" : "bg-[#111520] border-[#1e2640]")}>
                    <div className="text-xs text-gray-500 mb-2">{new Date(meci.kickoffAt).toLocaleString("ro-RO", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 text-right">
                        <span className="font-bold text-sm md:text-base">{meci.homeTeam}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="number" min="0" max="20"
                          value={pred.home ?? ""}
                          onChange={e => updatePrediction(meci.id, "home", e.target.value)}
                          disabled={isLocked}
                          className={"w-11 h-11 text-center text-xl font-black rounded-lg border bg-[#0a0d14] outline-none transition-all " + (pred.home !== "" ? "border-[#e8ff47]/40 text-[#e8ff47]" : "border-[#1e2640] text-white") + (isLocked ? " opacity-50 cursor-not-allowed" : " focus:border-[#3b82f6]")}
                          placeholder="–"
                        />
                        <span className="text-gray-500 font-bold">:</span>
                        <input
                          type="number" min="0" max="20"
                          value={pred.away ?? ""}
                          onChange={e => updatePrediction(meci.id, "away", e.target.value)}
                          disabled={isLocked}
                          className={"w-11 h-11 text-center text-xl font-black rounded-lg border bg-[#0a0d14] outline-none transition-all " + (pred.away !== "" ? "border-[#e8ff47]/40 text-[#e8ff47]" : "border-[#1e2640] text-white") + (isLocked ? " opacity-50 cursor-not-allowed" : " focus:border-[#3b82f6]")}
                          placeholder="–"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-sm md:text-base">{meci.awayTeam}</span>
                      </div>
                      <button
                        onClick={() => toggleCaptain(meci.id)}
                        disabled={isLocked}
                        className={"w-9 h-9 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 " + (isCap ? "border-[#fbbf24] bg-[#fbbf24]/20 text-[#fbbf24]" : "border-[#1e2640] text-gray-600 hover:border-[#fbbf24] hover:text-[#fbbf24]") + (isLocked ? " opacity-50 cursor-not-allowed" : "")}
                      >⭐</button>
                    </div>
                    {isCap && <div className="text-xs text-[#fbbf24] mt-2 text-center font-bold tracking-wider">⭐ MECI CAPITAN — puncte x2</div>}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {!isLocked && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0d14]/95 backdrop-blur border-t border-[#1e2640] px-6 py-4 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            {captain ? "⭐ Capitan selectat" : "Fara meci capitan"} · {filledCount}/{matches.length} completate
          </div>
          <button onClick={savePredictions} disabled={saving || filledCount === 0} className="bg-[#e8ff47] text-black font-black px-8 py-3 rounded-xl hover:bg-[#f5ff6e] transition-colors disabled:opacity-50 text-sm">
            {saving ? "Se salveaza..." : "Salveaza predictiile"}
          </button>
        </div>
      )}
    </div>
  )
}