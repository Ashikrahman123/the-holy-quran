// Enhanced Islamic knowledge base with credit-aware responses
export const islamicKnowledgeBase = {
  // ... existing content ...
  pillars:
    "The five pillars of Islam are: Shahada (Declaration of faith), Salat (Prayer), Zakat (Charity), Sawm (Fasting), and Hajj (Pilgrimage).",
  prayer: "Salah (prayer) is an obligatory act of worship performed five times a day by Muslims.",
  quran:
    "The Quran is the holy book of Islam, believed to be the word of God as revealed to Prophet Muhammad (peace be upon him).",
  general: {
    default: "I am here to assist you with your Islamic knowledge. Please ask a specific question.",
  },

  // Credit-related responses
  credits: {
    lowCredits:
      "You're running low on AI credits. Each question uses 1 credit, and they reset daily at midnight. Use them wisely for your Islamic learning journey!",
    noCredits:
      "You've used all your free AI credits for today. They will reset at midnight. In the meantime, you can explore our other features like reading the Quran, listening to recitations, or browsing Islamic articles.",
    creditRefunded: "Your credit has been refunded due to a connection issue. Please try your question again.",
  },

  // Enhanced responses for better user experience
  enhanced: {
    greeting:
      "As-salamu alaykum wa rahmatullahi wa barakatuh! Welcome to your Islamic Assistant. I'm here to help you learn about Islam using AI technology. You have free credits to ask questions - use them to deepen your understanding of our beautiful faith.",

    helpWithCredits:
      "Here's how the credit system works:\n• You get 100 free credits daily\n• Each question uses 1 credit\n• Credits reset at midnight\n• Failed requests are automatically refunded\n• Use credits to ask about Quran, Hadith, Islamic history, practices, and more!",

    efficientUsage:
      "To make the most of your credits:\n• Ask specific, focused questions\n• Combine related topics in one question\n• Use our other free features like Quran reading and prayer times\n• Check your credit balance regularly",
  },
}

// Enhanced function to get responses based on credits
export function getBasicResponse(query: string, creditsRemaining?: number): string {
  const lowercaseQuery = query.toLowerCase()

  // Credit-specific responses
  if (lowercaseQuery.includes("credit") || lowercaseQuery.includes("balance")) {
    return islamicKnowledgeBase.enhanced.helpWithCredits
  }

  // Provide credit-aware responses when credits are low
  if (creditsRemaining !== undefined && creditsRemaining <= 5) {
    const baseResponse = getStandardResponse(lowercaseQuery)
    return baseResponse + "\n\n💡 Tip: You're running low on credits. They reset at midnight!"
  }

  return getStandardResponse(lowercaseQuery)
}

function getStandardResponse(lowercaseQuery: string): string {
  // ... existing response logic ...

  if (lowercaseQuery.includes("pillar") || lowercaseQuery.includes("foundation")) {
    return islamicKnowledgeBase.pillars
  } else if (lowercaseQuery.includes("pray") || lowercaseQuery.includes("salah")) {
    return islamicKnowledgeBase.prayer
  } else if (lowercaseQuery.includes("quran") || lowercaseQuery.includes("book")) {
    return islamicKnowledgeBase.quran
  } else if (lowercaseQuery.includes("help") || lowercaseQuery.includes("how")) {
    return islamicKnowledgeBase.enhanced.helpWithCredits
  }

  return islamicKnowledgeBase.general.default
}
