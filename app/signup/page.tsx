import { SignupForm } from "@/components/auth/signup-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | The Holy Quran",
  description: "Create an account to access personalized features",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Join Our Community</h1>
          <SignupForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
