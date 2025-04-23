import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search, CheckCircle, Users, BookOpen, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <MainNav />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/search">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-16 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Our Mission</h1>
              <p className="text-muted-foreground md:text-xl">
                Our mission is to make the Holy Quran accessible to everyone around the world, providing accurate
                translations, beautiful recitations, and insightful explanations.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/read">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read Quran
                  </Button>
                </Link>
                <Link href="/about#team">
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Meet Our Team
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative mx-auto aspect-video overflow-hidden rounded-xl border-8 border-emerald-50 dark:border-emerald-950 lg:aspect-square lg:h-[500px] lg:w-[500px]">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="About Our Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-12 md:py-16 lg:py-20">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-3xl font-bold">Our Vision</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                We envision a world where everyone can access, understand, and benefit from the wisdom of the Holy
                Quran, regardless of language or background.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {visionPoints.map((point, index) => (
                <div key={index} className="rounded-lg border bg-background p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                    {point.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{point.title}</h3>
                  <p className="text-muted-foreground">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="container py-12 md:py-16 lg:py-20">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold">Our Team</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              Meet the dedicated individuals behind this project who are committed to making the Quran accessible to
              all.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="rounded-lg border bg-background p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-muted/50 py-12 md:py-16 lg:py-20">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-3xl font-bold">Islamic Authenticity</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                Our commitment to authenticity and accuracy in presenting the Holy Quran
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold">Our Sources</h3>
                <ul className="space-y-3">
                  {sources.map((source, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="font-medium">{source.name}</p>
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold">Our Methodology</h3>
                <p className="mb-4 text-muted-foreground">
                  We follow a rigorous process to ensure the accuracy and authenticity of all content on our platform:
                </p>
                <ul className="space-y-3">
                  {methodologies.map((method, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const visionPoints = [
  {
    title: "Accessibility",
    description: "Making the Quran accessible to everyone regardless of language, location, or ability",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    title: "Education",
    description: "Providing educational resources to help understand the meanings and context of the Quran",
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    title: "Community",
    description: "Building a global community of learners and scholars who share knowledge and insights",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Authenticity",
    description: "Ensuring all content is authentic, accurate, and respectful of Islamic scholarship",
    icon: <CheckCircle className="h-6 w-6" />,
  },
]

const teamMembers = [
  {
    name: "Dr. Ahmed Hassan",
    role: "Quranic Scholar & Founder",
    bio: "Dr. Ahmed has dedicated his life to Quranic studies with over 20 years of experience in Islamic scholarship.",
    image: "/placeholder.svg?height=96&width=96",
  },
  {
    name: "Fatima Khan",
    role: "Translation Specialist",
    bio: "Fatima specializes in Arabic linguistics and ensures accurate translations across multiple languages.",
    image: "/placeholder.svg?height=96&width=96",
  },
  {
    name: "Omar Farooq",
    role: "Technology Director",
    bio: "Omar leads our technical team, ensuring the platform is accessible, responsive, and user-friendly.",
    image: "/placeholder.svg?height=96&width=96",
  },
  {
    name: "Aisha Rahman",
    role: "Educational Content Manager",
    bio: "Aisha develops educational resources to help users understand the context and meaning of Quranic verses.",
    image: "/placeholder.svg?height=96&width=96",
  },
  {
    name: "Yusuf Ali",
    role: "Audio Quality Specialist",
    bio: "Yusuf ensures all recitations meet the highest standards of tajweed and audio quality.",
    image: "/placeholder.svg?height=96&width=96",
  },
  {
    name: "Zainab Mohammed",
    role: "Community Engagement",
    bio: "Zainab builds connections with Islamic centers and educational institutions worldwide.",
    image: "/placeholder.svg?height=96&width=96",
  },
]

const sources = [
  {
    name: "Authentic Manuscripts",
    description: "We reference the most authentic and widely accepted Quranic manuscripts and editions.",
  },
  {
    name: "Scholarly Consensus",
    description:
      "Our content reflects the consensus of respected Islamic scholars across different schools of thought.",
  },
  {
    name: "Verified Translations",
    description: "All translations are verified by experts in both Arabic and the target language.",
  },
  {
    name: "Certified Reciters",
    description: "Our audio recitations come from certified Qaris known for their accuracy and beautiful recitation.",
  },
]

const methodologies = [
  {
    name: "Multiple Reviews",
    description: "Each piece of content undergoes multiple reviews by different scholars before publication.",
  },
  {
    name: "Community Feedback",
    description: "We welcome and incorporate feedback from our community of users and scholars.",
  },
  {
    name: "Regular Updates",
    description: "Our content is regularly reviewed and updated to ensure continued accuracy and relevance.",
  },
  {
    name: "Transparent Sources",
    description: "We clearly cite the sources and scholars behind our translations and interpretations.",
  },
]
