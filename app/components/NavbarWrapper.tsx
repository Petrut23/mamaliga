"use client"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function NavbarWrapper() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const hideOn = ["/login", "/register"]
  if (hideOn.includes(pathname || "")) return null
  if (status === "loading") return null
  if (!session) return null

  return <Navbar />
}