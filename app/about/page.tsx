"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Github, Linkedin, ExternalLink } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12 flex-1">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-emerald-800 dark:text-emerald-200">
            About This Project
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A personal endeavor for the sake of Allah (SWT) and the Muslim Ummah.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-emerald-50 dark:bg-emerald-950 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
                Meet the Developer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
              <p>
                Assalamu Alaikum! I'm <span className="font-bold">Mohamed Ashik Rahman Ameerdeen</span>, a software
                developer with a passion for creating meaningful digital experiences. This website, "The Holy Quran," is
                a personal project born out of a desire to contribute to good deeds (Sadaqah Jariyah) and serve the
                Muslim community.
              </p>
              <p>
                It was developed entirely as a solo endeavor, driven by the intention to provide a free, accessible, and
                user-friendly platform for engaging with the Quran and Islamic knowledge. This project is not for
                financial gain; rather, it is an offering for the pleasure of Allah (SWT).
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="mailto:ashikr142@gmail.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Mail className="h-5 w-5" /> Email Me
                  </Button>
                </Link>
                <Link href="https://github.com/Ashikrahman123" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Github className="h-5 w-5" /> GitHub
                  </Button>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/mohamed-asik-rahman-ameerdeen-2661b01b4/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Linkedin className="h-5 w-5" /> LinkedIn
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 dark:bg-emerald-950 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
                APIs & Technologies Used
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
              <p>This platform leverages several reliable third-party APIs and modern web technologies:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <span className="font-medium">Al-Quran Cloud API:</span> Primary source for Quranic text,
                  translations, and chapter information.
                </li>
                <li>
                  <span className="font-medium">Quran.com API:</span> Backup source for Quranic data and search
                  functionality.
                </li>
                <li>
                  <span className="font-medium">QuranEnc.com API:</span> Specifically used for Tamil translations.
                </li>
                <li>
                  <span className="font-medium">EveryAyah.com & MP3Quran.net:</span> Sources for high-quality Quranic
                  audio recitations.
                </li>
                <li>
                  <span className="font-medium">Aladhan API:</span> Provides accurate, real-time prayer times and Hijri
                  calendar data based on location.
                </li>
                <li>
                  <span className="font-medium">Next.js:</span> The React framework for building the web application.
                </li>
                <li>
                  <span className="font-medium">Tailwind CSS & shadcn/ui:</span> For responsive and beautiful UI design.
                </li>
                <li>
                  <span className="font-medium">Neon Database & Vercel Blob:</span> For user authentication and caching
                  personalized data.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12 text-center bg-yellow-50 dark:bg-yellow-950 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-yellow-800 dark:text-yellow-200">Important Disclaimer</h2>
          <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">
            Please note that all Quranic content, translations, and tafsir on this website are sourced via third-party
            APIs. While efforts are made to use reliable sources, the content has <span className="font-bold">NOT</span>{" "}
            been independently verified for accuracy by the developer.
          </p>
          <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">
            Users are strongly encouraged to cross-reference information with authentic Islamic sources and consult
            qualified Islamic scholars for religious guidance.
          </p>
          <p className="text-lg text-gray-800 dark:text-gray-200">
            If you perceive any errors or have suggestions for improvement, please report them. Your feedback is
            invaluable in making this resource better for everyone.
          </p>
          <Link href="/contact">
            <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              Report an Error or Suggestion <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  )
}
