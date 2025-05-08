import { PrismaClient, Role } from "@prisma/client"
import { hashPassword } from "../lib/auth-utils"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hashPassword("Admin123!")

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin",
      name: "Admin User",
      password: adminPassword,
      role: Role.ADMIN,
      preferences: {
        create: {
          theme: "light",
          language: "en",
        },
      },
    },
  })

  // Create moderator user
  const modPassword = await hashPassword("Moderator123!")

  await prisma.user.upsert({
    where: { email: "moderator@example.com" },
    update: {},
    create: {
      email: "moderator@example.com",
      username: "moderator",
      name: "Moderator User",
      password: modPassword,
      role: Role.MODERATOR,
      preferences: {
        create: {
          theme: "light",
          language: "en",
        },
      },
    },
  })

  console.log("Database has been seeded.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
