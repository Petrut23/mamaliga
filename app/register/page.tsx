"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Ceva nu a mers")
      setLoading(false)
    } else {
      router.push("/login?pending=true")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-widest text-white mb-2">
            Mama<span className="text-[#e8ff47]">LIGA</span>
          </h1>
          <p className="text-gray-500 text-sm">Jocul de predictii al grupului</p>
        </div>
        <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Creeaza cont</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nume</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#3b82f6] transition-colors"
                placeholder="Numele tau"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#3b82f6] transition-colors"
                placeholder="email@exemplu.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Parola</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0d14] border border-[#1e2640] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#3b82f6] transition-colors"
                placeholder="Minim 8 caractere"
                minLength={8}
                required
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e8ff47] text-black font-bold py-3 rounded-lg hover:bg-[#f5ff6e] transition-colors disabled:opacity-50"
            >
              {loading ? "Se creeaza contul..." : "Creeaza cont"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Ai deja cont?{" "}
            <a href="/login" className="text-[#e8ff47] hover:underline font-medium">
              Intra in cont
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}