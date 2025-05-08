import type { Metadata } from "next"
import { ProfileForm } from "@/components/auth/profile-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Profile | The Holy Quran",
  description: "Manage your profile and account settings",
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          <ProfileForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
