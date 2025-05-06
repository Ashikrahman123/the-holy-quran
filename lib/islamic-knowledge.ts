// Basic Islamic knowledge for fallback responses when API is unavailable

export const basicIslamicKnowledge = {
  pillars: {
    title: "The Five Pillars of Islam",
    content:
      "The Five Pillars of Islam are the foundation of Muslim life: 1) Shahada: Faith - Declaring belief in the oneness of God and Muhammad as His messenger. 2) Salah: Prayer - Performing ritual prayers five times daily. 3) Zakat: Giving - Supporting the needy through almsgiving. 4) Sawm: Fasting - Abstaining from food and drink from dawn to sunset during Ramadan. 5) Hajj: Pilgrimage - Making a pilgrimage to Mecca once in a lifetime if physically and financially able.",
  },
  quran: {
    title: "The Holy Quran",
    content:
      "The Quran is the central religious text of Islam, believed by Muslims to be a revelation from Allah (God) to the Prophet Muhammad through the angel Gabriel over a period of approximately 23 years. It consists of 114 chapters (surahs) and is regarded as the main miracle of Prophet Muhammad, as proof of his prophethood, and as the culmination of a series of divine messages.",
  },
  prophet: {
    title: "Prophet Muhammad (PBUH)",
    content:
      "Muhammad (peace be upon him) was born in Mecca in 570 CE and is the final prophet in Islam. He received revelations from Allah which were compiled into the Quran. His life, actions, and sayings (Hadith) form the Sunnah, which is the second source of guidance for Muslims after the Quran. He established the first Muslim community and spread the message of Islam throughout Arabia.",
  },
  prayer: {
    title: "Salah (Prayer)",
    content:
      "Salah is the practice of formal prayer in Islam, performed five times daily: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night). Each prayer consists of a specific number of units (rakats) and includes standing, bowing, prostrating, and sitting positions, accompanied by recitations from the Quran and specific supplications.",
  },
  ramadan: {
    title: "Ramadan",
    content:
      "Ramadan is the ninth month of the Islamic calendar and is observed by Muslims worldwide as a month of fasting, prayer, reflection, and community. Fasting during Ramadan is one of the Five Pillars of Islam. Muslims abstain from food, drink, and other physical needs during daylight hours and focus on spiritual growth, increased devotion, and worship.",
  },
}

export function getBasicResponse(query: string): string {
  const lowercaseQuery = query.toLowerCase()

  // Check for keywords and return appropriate content
  if (lowercaseQuery.includes("pillar") || lowercaseQuery.includes("foundation") || lowercaseQuery.includes("basic")) {
    return basicIslamicKnowledge.pillars.content
  }

  if (lowercaseQuery.includes("quran") || lowercaseQuery.includes("book") || lowercaseQuery.includes("scripture")) {
    return basicIslamicKnowledge.quran.content
  }

  if (
    lowercaseQuery.includes("muhammad") ||
    lowercaseQuery.includes("prophet") ||
    lowercaseQuery.includes("messenger")
  ) {
    return basicIslamicKnowledge.prophet.content
  }

  if (lowercaseQuery.includes("prayer") || lowercaseQuery.includes("salah") || lowercaseQuery.includes("salat")) {
    return basicIslamicKnowledge.prayer.content
  }

  if (lowercaseQuery.includes("ramadan") || lowercaseQuery.includes("fasting") || lowercaseQuery.includes("fast")) {
    return basicIslamicKnowledge.ramadan.content
  }

  // Default response if no keywords match
  return "As-salamu alaykum! I'm currently experiencing connection issues with my knowledge base. I can answer basic questions about the Five Pillars of Islam, the Quran, Prophet Muhammad (PBUH), prayer (Salah), and Ramadan. Please ask about one of these topics or try again later."
}
