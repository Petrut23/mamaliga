import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import SyncButton from "./SyncButton"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPER_ADMIN") redirect("/")

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">


      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-black tracking-wide mb-2">Dashboard Admin</h1>
        <p className="text-gray-500 mb-10">Gestioneaza etapele, meciurile si sincronizarea</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <a href="/admin/etape" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors">
            <div className="text-3xl mb-3">🗓️</div>
            <div className="font-bold text-white mb-1">Etape</div>
            <div className="text-sm text-gray-500">Creeaza si gestioneaza etapele sezonului</div>
          </a>
          <a href="/admin/meciuri" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors">
            <div className="text-3xl mb-3">⚽</div>
            <div className="font-bold text-white mb-1">Meciuri</div>
            <div className="text-sm text-gray-500">Importa meciuri si gestioneaza scoruri</div>
          </a>
          <a href="/admin/utilizatori" className="bg-[#111520] border border-[#1e2640] rounded-xl p-6 hover:border-[#e8ff47]/40 transition-colors">
            <div className="text-3xl mb-3">👥</div>
            <div className="font-bold text-white mb-1">Utilizatori</div>
            <div className="text-sm text-gray-500">Vezi si gestioneaza utilizatorii</div>
          </a>
        </div>

        <div className="bg-[#111520] border border-[#1e2640] rounded-xl p-6">
          <h2 className="text-lg font-bold mb-2">🔄 Sincronizare scoruri</h2>
          <p className="text-gray-500 text-sm mb-4">Sync-ul se face automat din pagina Live. Poti forta un sync manual oricand.</p>
          <SyncButton />
        </div>
      </div>
    </div>
  )
}