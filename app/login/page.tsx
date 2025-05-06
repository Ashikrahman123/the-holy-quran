import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | The Holy Quran",
  description: "Login to your Quran website account to access personalized features.",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-800">Login to Your Account</h1>
          <p className="mt-2 text-gray-600">Access your personalized Quran experience</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
