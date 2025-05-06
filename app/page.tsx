import { Dashboard } from "@/components/dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Holy Quran Website",
  description: "A comprehensive website to read, listen to, and learn from the Holy Quran",
}

export default function HomePage() {
  return <Dashboard />
}
