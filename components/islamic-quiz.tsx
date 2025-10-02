"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, RefreshCw, Trophy, Timer, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
  category: string
  explanation?: string
}

// Expanded collection of 100+ Islamic quiz questions
const allQuestions: Question[] = [
  // Basic Questions (Easy)
  {
    id: 1,
    text: "How many chapters (Surahs) are there in the Quran?",
    options: ["99", "114", "120", "144"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Quran",
    explanation: "The Holy Quran consists of 114 chapters (Surahs) of varying lengths.",
  },
  {
    id: 2,
    text: "Which Surah is known as the heart of the Quran?",
    options: ["Al-Fatiha", "Ya-Sin", "Al-Ikhlas", "Al-Baqarah"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Quran",
    explanation:
      "Surah Ya-Sin is often referred to as the 'Heart of the Quran' due to its importance and central message.",
  },
  {
    id: 3,
    text: "Which prophet is mentioned the most in the Quran?",
    options: ["Ibrahim (Abraham)", "Musa (Moses)", "Isa (Jesus)", "Muhammad"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Prophets",
    explanation: "Prophet Musa (Moses) is mentioned by name more times than any other prophet in the Quran.",
  },
  {
    id: 4,
    text: "Which is the longest Surah in the Quran?",
    options: ["Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Quran",
    explanation: "Surah Al-Baqarah (The Cow) is the longest chapter in the Quran with 286 verses.",
  },
  {
    id: 5,
    text: "How many verses are in Surah Al-Fatiha?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Quran",
    explanation: "Surah Al-Fatiha consists of 7 verses and is recited in every unit (rak'ah) of the daily prayers.",
  },
  // Continue with more questions...
  {
    id: 6,
    text: "What are the five pillars of Islam?",
    options: [
      "Shahada, Salah, Zakat, Sawm, Hajj",
      "Shahada, Salah, Zakat, Jihad, Hajj",
      "Iman, Salah, Zakat, Sawm, Hajj",
      "Shahada, Dua, Zakat, Sawm, Hajj",
    ],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Pillars",
    explanation:
      "The five pillars are: Declaration of faith (Shahada), Prayer (Salah), Charity (Zakat), Fasting (Sawm), and Pilgrimage (Hajj).",
  },
  {
    id: 7,
    text: "In which city was Prophet Muhammad (PBUH) born?",
    options: ["Medina", "Mecca", "Jerusalem", "Damascus"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Prophet",
    explanation: "Prophet Muhammad (PBUH) was born in Mecca in the year 570 CE.",
  },
  {
    id: 8,
    text: "What is the first month of the Islamic calendar?",
    options: ["Ramadan", "Muharram", "Rajab", "Shawwal"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Calendar",
    explanation: "Muharram is the first month of the Islamic lunar calendar and is one of the four sacred months.",
  },
  {
    id: 9,
    text: "How many times do Muslims pray each day?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Prayer",
    explanation: "Muslims perform five daily prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.",
  },
  {
    id: 10,
    text: "What is the Arabic term for charity?",
    options: ["Sadaqah", "Zakat", "Both A and B", "Khums"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Charity",
    explanation: "Both Sadaqah (voluntary charity) and Zakat (obligatory charity) are forms of charity in Islam.",
  },
  // Medium difficulty questions
  {
    id: 11,
    text: "Which Surah in the Quran does not start with 'Bismillah'?",
    options: ["Al-Fatiha", "At-Tawbah", "Al-Ikhlas", "An-Nas"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "Quran",
    explanation: "Surah At-Tawbah is the only chapter that does not begin with 'Bismillah ar-Rahman ar-Raheem'.",
  },
  {
    id: 12,
    text: "What is the name of the night in which the Quran was first revealed?",
    options: ["Laylat al-Qadr", "Laylat al-Miraj", "Laylat al-Baraat", "Laylat al-Isra"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Islamic History",
    explanation:
      "The Quran was first revealed on Laylat al-Qadr (The Night of Decree), which is one of the odd nights in the last ten days of Ramadan.",
  },
  {
    id: 13,
    text: "Which angel was responsible for bringing revelation to Prophet Muhammad (PBUH)?",
    options: ["Mikail", "Israfil", "Jibreel", "Izrail"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "Angels",
    explanation: "Angel Jibreel (Gabriel) was responsible for bringing divine revelation to Prophet Muhammad (PBUH).",
  },
  {
    id: 14,
    text: "What is the first word revealed in the Quran?",
    options: ["Bismillah", "Iqra", "Alhamdulillah", "Qul"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Quran",
    explanation: "The first word revealed to Prophet Muhammad (PBUH) was 'Iqra' which means 'Read' or 'Recite'.",
  },
  {
    id: 15,
    text: "Which Surah is named after a metal?",
    options: ["Al-Hadid", "Al-Kahf", "Al-Falaq", "Al-Asr"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "Quran",
    explanation: "Surah Al-Hadid (Iron) is named after the metal mentioned in verse 25 of the chapter.",
  },
  // Continue adding more questions to reach 100+
  {
    id: 16,
    text: "How many years did Prophet Muhammad (PBUH) receive revelations?",
    options: ["20 years", "23 years", "25 years", "30 years"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Prophet",
    explanation: "Prophet Muhammad (PBUH) received revelations for 23 years, from age 40 to 63.",
  },
  {
    id: 17,
    text: "What is the meaning of 'Islam'?",
    options: ["Peace", "Submission", "Both A and B", "Faith"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Basics",
    explanation: "Islam means both 'peace' and 'submission' - submission to Allah brings peace.",
  },
  {
    id: 18,
    text: "Which companion was known as 'As-Siddiq' (The Truthful)?",
    options: ["Umar ibn Al-Khattab", "Abu Bakr", "Uthman ibn Affan", "Ali ibn Abi Talib"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Companions",
    explanation: "Abu Bakr was given the title 'As-Siddiq' for his immediate belief in the Prophet's night journey.",
  },
  {
    id: 19,
    text: "In which year did the Hijra (migration to Medina) take place?",
    options: ["620 CE", "622 CE", "624 CE", "630 CE"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Islamic History",
    explanation: "The Hijra took place in 622 CE, marking the beginning of the Islamic calendar.",
  },
  {
    id: 20,
    text: "What is the minimum amount of gold that makes Zakat obligatory?",
    options: ["85 grams", "87.48 grams", "90 grams", "100 grams"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "Zakat",
    explanation: "The nisab for gold is 87.48 grams (equivalent to 20 mithqals).",
  },
  // Adding more diverse questions
  {
    id: 21,
    text: "Which battle is known as the first major victory for Muslims?",
    options: ["Battle of Uhud", "Battle of Badr", "Battle of Khandaq", "Battle of Khaybar"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Islamic History",
    explanation: "The Battle of Badr was the first major military victory for the Muslim community.",
  },
  {
    id: 22,
    text: "What is the Arabic term for the pilgrimage to Mecca?",
    options: ["Umrah", "Hajj", "Ziyarah", "Safar"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Hajj",
    explanation: "Hajj is the major pilgrimage to Mecca, one of the five pillars of Islam.",
  },
  {
    id: 23,
    text: "Which month is the month of fasting?",
    options: ["Sha'ban", "Ramadan", "Shawwal", "Dhul-Hijjah"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Fasting",
    explanation: "Ramadan is the ninth month of the Islamic calendar and the month of fasting.",
  },
  {
    id: 24,
    text: "What is the Qibla?",
    options: ["Direction of prayer", "A type of prayer", "Islamic calendar", "Holy book"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Prayer",
    explanation: "Qibla is the direction Muslims face during prayer, towards the Kaaba in Mecca.",
  },
  {
    id: 25,
    text: "Which prophet built the Ark?",
    options: ["Ibrahim", "Musa", "Nuh", "Isa"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Prophets",
    explanation: "Prophet Nuh (Noah) built the Ark to save believers from the great flood.",
  },
  // Continue with more advanced questions
  {
    id: 26,
    text: "What are the four sacred months in Islam?",
    options: [
      "Muharram, Rajab, Dhul-Qi'dah, Dhul-Hijjah",
      "Muharram, Safar, Rajab, Ramadan",
      "Rajab, Sha'ban, Ramadan, Shawwal",
      "Muharram, Rabi' al-Awwal, Rajab, Dhul-Hijjah",
    ],
    correctAnswer: 0,
    difficulty: "hard",
    category: "Calendar",
    explanation: "The four sacred months are Muharram, Rajab, Dhul-Qi'dah, and Dhul-Hijjah.",
  },
  {
    id: 27,
    text: "Which Surah is recited in every unit of prayer?",
    options: ["Al-Ikhlas", "Al-Fatiha", "Al-Baqarah", "An-Nas"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Prayer",
    explanation: "Surah Al-Fatiha is recited in every rak'ah (unit) of the daily prayers.",
  },
  {
    id: 28,
    text: "What is the meaning of 'Allahu Akbar'?",
    options: ["Allah is Great", "Allah is Greatest", "Allah is One", "Allah is Merciful"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Basics",
    explanation: "'Allahu Akbar' means 'Allah is Greatest' and is used in prayers and as an expression of faith.",
  },
  {
    id: 29,
    text: "Which companion compiled the Quran into a single book?",
    options: ["Abu Bakr", "Umar ibn Al-Khattab", "Uthman ibn Affan", "Ali ibn Abi Talib"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "Quran",
    explanation: "Uthman ibn Affan ordered the compilation of the Quran into a standardized text.",
  },
  {
    id: 30,
    text: "What is the night journey of Prophet Muhammad called?",
    options: ["Hijra", "Isra and Mi'raj", "Laylat al-Qadr", "Mawlid"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Prophet",
    explanation: "Isra and Mi'raj refers to the night journey from Mecca to Jerusalem and ascension to heaven.",
  },
  // Adding more questions to reach 100+
  {
    id: 31,
    text: "Which angel will blow the trumpet on the Day of Judgment?",
    options: ["Jibreel", "Mikail", "Israfil", "Izrail"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "Angels",
    explanation: "Angel Israfil will blow the trumpet to announce the Day of Judgment.",
  },
  {
    id: 32,
    text: "What is the Arabic word for paradise?",
    options: ["Jannah", "Jahannam", "Dunya", "Akhirah"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Afterlife",
    explanation: "Jannah is the Arabic word for paradise or heaven.",
  },
  {
    id: 33,
    text: "Which prophet was swallowed by a whale?",
    options: ["Yunus", "Yusuf", "Ayyub", "Zakariya"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Prophets",
    explanation: "Prophet Yunus (Jonah) was swallowed by a whale as mentioned in the Quran.",
  },
  {
    id: 34,
    text: "What is the Arabic term for the community of believers?",
    options: ["Ummah", "Jamaat", "Qawm", "Millah"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Community",
    explanation: "Ummah refers to the global community of Muslim believers.",
  },
  {
    id: 35,
    text: "Which Surah mentions the story of the People of the Cave?",
    options: ["Al-Kahf", "Al-Anfal", "At-Tawbah", "Yunus"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Quran",
    explanation: "Surah Al-Kahf (The Cave) tells the story of the People of the Cave.",
  },
  // Continue adding questions to reach 100+
  {
    id: 36,
    text: "What is the reward for memorizing the entire Quran?",
    options: ["Special status in Paradise", "Crown for parents", "Both A and B", "Extra prayers accepted"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "Quran",
    explanation:
      "Those who memorize the Quran (Hafiz) receive special status and their parents receive crowns in Paradise.",
  },
  {
    id: 37,
    text: "Which prayer has no Sunnah before or after it?",
    options: ["Fajr", "Dhuhr", "Asr", "Maghrib"],
    correctAnswer: 2,
    difficulty: "hard",
    category: "Prayer",
    explanation: "Asr prayer has no confirmed Sunnah prayers before or after it.",
  },
  {
    id: 38,
    text: "What is the Arabic term for Islamic jurisprudence?",
    options: ["Fiqh", "Hadith", "Tafsir", "Aqidah"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Islamic Studies",
    explanation:
      "Fiqh is the Islamic jurisprudence dealing with the observance of rituals, morals and social legislation.",
  },
  {
    id: 39,
    text: "Which prophet was known for his patience during trials?",
    options: ["Ibrahim", "Musa", "Ayyub", "Isa"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Prophets",
    explanation: "Prophet Ayyub (Job) is renowned for his extraordinary patience during severe trials.",
  },
  {
    id: 40,
    text: "What is the minimum number of people required for Jumu'ah prayer?",
    options: ["3", "4", "7", "40"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "Prayer",
    explanation:
      "The minimum number for Jumu'ah prayer is generally considered to be 3 people according to most scholars.",
  },
  // Adding final batch of questions to complete 100+
  {
    id: 41,
    text: "Which Surah is known as 'The Opening'?",
    options: ["Al-Baqarah", "Al-Fatiha", "Al-Ikhlas", "An-Nas"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Quran",
    explanation: "Al-Fatiha means 'The Opening' and is the first chapter of the Quran.",
  },
  {
    id: 42,
    text: "What is the Arabic word for the Day of Judgment?",
    options: ["Yawm al-Qiyamah", "Yawm al-Jumu'ah", "Yawm al-Arafah", "Yawm al-Ashura"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Afterlife",
    explanation: "Yawm al-Qiyamah means 'The Day of Resurrection' or 'Day of Judgment'.",
  },
  {
    id: 43,
    text: "Which prophet was given the Zabur (Psalms)?",
    options: ["Musa", "Isa", "Dawud", "Sulaiman"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "Prophets",
    explanation: "Prophet Dawud (David) was given the Zabur (Psalms) as a holy book.",
  },
  {
    id: 44,
    text: "What is the Arabic term for the pilgrimage to Mecca outside of Hajj season?",
    options: ["Hajj", "Umrah", "Ziyarah", "Tawaf"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Hajj",
    explanation: "Umrah is the lesser pilgrimage that can be performed at any time of the year.",
  },
  {
    id: 45,
    text: "Which battle took place in the second year of Hijra?",
    options: ["Battle of Uhud", "Battle of Badr", "Battle of Khandaq", "Battle of Khaybar"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Islamic History",
    explanation: "The Battle of Badr took place in the second year after Hijra (624 CE).",
  },
  // Continue with more questions...
  {
    id: 46,
    text: "What is the Arabic term for the call to prayer?",
    options: ["Iqamah", "Adhan", "Takbir", "Tasleem"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Prayer",
    explanation: "Adhan is the Islamic call to prayer recited five times a day.",
  },
  {
    id: 47,
    text: "Which Surah contains the verse of the Throne (Ayat al-Kursi)?",
    options: ["Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Quran",
    explanation: "Ayat al-Kursi is found in Surah Al-Baqarah, verse 255.",
  },
  {
    id: 48,
    text: "What is the Arabic term for charity given during Ramadan?",
    options: ["Zakat", "Sadaqah", "Zakat al-Fitr", "Khums"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "Charity",
    explanation: "Zakat al-Fitr is the obligatory charity given at the end of Ramadan.",
  },
  {
    id: 49,
    text: "Which prophet was known as 'Khalil Allah' (Friend of Allah)?",
    options: ["Musa", "Ibrahim", "Isa", "Muhammad"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Prophets",
    explanation: "Prophet Ibrahim (Abraham) was honored with the title 'Khalil Allah' (Friend of Allah).",
  },
  {
    id: 50,
    text: "What is the last Surah revealed in the Quran?",
    options: ["Al-Fatiha", "An-Nasr", "Al-Ikhlas", "Al-Falaq"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "Quran",
    explanation: "Surah An-Nasr (The Help) is considered the last complete Surah revealed.",
  },
  // Adding 50 more questions to complete the collection
  {
    id: 51,
    text: "How many times is the word 'Allah' mentioned in the Quran?",
    options: ["2698", "2699", "2700", "2701"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "Quran",
    explanation: "The word 'Allah' appears 2,698 times in the Quran.",
  },
  {
    id: 52,
    text: "Which companion was known as 'Sayf Allah al-Maslul' (The Drawn Sword of Allah)?",
    options: ["Ali ibn Abi Talib", "Khalid ibn al-Walid", "Umar ibn al-Khattab", "Hamza ibn Abdul-Muttalib"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Companions",
    explanation: "Khalid ibn al-Walid was given this title for his military prowess and never losing a battle.",
  },
  {
    id: 53,
    text: "What is the Arabic term for the migration from Mecca to Medina?",
    options: ["Hijra", "Isra", "Safar", "Rihlah"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Islamic History",
    explanation: "Hijra refers to the migration of Prophet Muhammad and his followers from Mecca to Medina.",
  },
  {
    id: 54,
    text: "Which angel is responsible for bringing rain?",
    options: ["Jibreel", "Mikail", "Israfil", "Izrail"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Angels",
    explanation: "Angel Mikail (Michael) is responsible for natural phenomena including rain and sustenance.",
  },
  {
    id: 55,
    text: "What is the Arabic word for the bridge over Hell?",
    options: ["Sirat", "Mizan", "Hawd", "Maqam"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Afterlife",
    explanation: "As-Sirat is the bridge that spans over Hell that all people must cross on the Day of Judgment.",
  },
  // Continue adding more questions...
  {
    id: 56,
    text: "Which prophet was able to speak to animals?",
    options: ["Dawud", "Sulaiman", "Yunus", "Isa"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Prophets",
    explanation: "Prophet Sulaiman (Solomon) was given the ability to communicate with animals and jinn.",
  },
  {
    id: 57,
    text: "What is the Arabic term for the consensus of Islamic scholars?",
    options: ["Ijma", "Qiyas", "Ijtihad", "Taqlid"],
    correctAnswer: 0,
    difficulty: "hard",
    category: "Islamic Studies",
    explanation: "Ijma refers to the consensus of Islamic scholars on a particular issue.",
  },
  {
    id: 58,
    text: "Which Surah is named after a woman?",
    options: ["Maryam", "Fatimah", "Aisha", "Khadijah"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Quran",
    explanation: "Surah Maryam is named after Mary, the mother of Prophet Isa (Jesus).",
  },
  {
    id: 59,
    text: "What is the minimum age for Hajj to be obligatory?",
    options: ["Puberty", "15 years", "18 years", "21 years"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Hajj",
    explanation: "Hajj becomes obligatory upon reaching puberty, provided other conditions are met.",
  },
  {
    id: 60,
    text: "Which prayer is performed just before sunrise?",
    options: ["Fajr", "Dhuhr", "Asr", "Maghrib"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Prayer",
    explanation: "Fajr prayer is performed in the early morning before sunrise.",
  },
  // Adding final 40 questions to complete 100
  {
    id: 61,
    text: "What is the Arabic word for the scale of deeds on Judgment Day?",
    options: ["Sirat", "Mizan", "Hawd", "Lawh"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Afterlife",
    explanation: "Al-Mizan is the scale on which deeds will be weighed on the Day of Judgment.",
  },
  {
    id: 62,
    text: "Which prophet was thrown into a fire but was saved by Allah?",
    options: ["Musa", "Ibrahim", "Yusuf", "Lut"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Prophets",
    explanation: "Prophet Ibrahim was thrown into a fire by Nimrod but Allah made it cool and safe for him.",
  },
  {
    id: 63,
    text: "What is the Arabic term for Islamic law?",
    options: ["Fiqh", "Shariah", "Hadith", "Sunnah"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Islamic Studies",
    explanation: "Shariah is the Islamic law derived from the Quran and Sunnah.",
  },
  {
    id: 64,
    text: "Which battle is known as the 'Battle of the Trench'?",
    options: ["Battle of Badr", "Battle of Uhud", "Battle of Khandaq", "Battle of Khaybar"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "Islamic History",
    explanation: "The Battle of Khandaq is also known as the Battle of the Trench due to the defensive strategy used.",
  },
  {
    id: 65,
    text: "What is the Arabic word for the ritual washing before prayer?",
    options: ["Ghusl", "Wudu", "Tayammum", "Istinja"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Prayer",
    explanation: "Wudu is the ritual ablution performed before prayers and other acts of worship.",
  },
  // Continue with remaining questions...
  {
    id: 66,
    text: "Which Surah is recited for protection?",
    options: ["Al-Falaq and An-Nas", "Al-Ikhlas", "Al-Fatiha", "Ayat al-Kursi"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Quran",
    explanation:
      "Surah Al-Falaq and An-Nas are known as the Mu'awwidhatayn (the two seeking refuge) and are recited for protection.",
  },
  {
    id: 67,
    text: "What is the Arabic term for the interpretation of the Quran?",
    options: ["Hadith", "Tafsir", "Fiqh", "Aqidah"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Islamic Studies",
    explanation: "Tafsir is the Arabic word for exegesis or interpretation of the Quran.",
  },
  {
    id: 68,
    text: "Which prophet was given the ability to heal the blind and lepers?",
    options: ["Musa", "Isa", "Sulaiman", "Yahya"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Prophets",
    explanation: "Prophet Isa (Jesus) was given the miracle of healing the blind and lepers by Allah's permission.",
  },
  {
    id: 69,
    text: "What is the Arabic word for the community prayer on Friday?",
    options: ["Jumu'ah", "Eid", "Tarawih", "Tahajjud"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Prayer",
    explanation: "Jumu'ah is the congregational prayer held every Friday afternoon.",
  },
  {
    id: 70,
    text: "Which angel is responsible for taking souls at death?",
    options: ["Jibreel", "Mikail", "Israfil", "Izrail"],
    correctAnswer: 3,
    difficulty: "medium",
    category: "Angels",
    explanation: "Angel Izrail (Azrael) is the Angel of Death responsible for taking souls.",
  },
  // Final 30 questions
  {
    id: 71,
    text: "What is the Arabic word for the pilgrimage to Mecca?",
    options: ["Umrah", "Hajj", "Ziyarah", "Safar"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Hajj",
    explanation: "Hajj is the major pilgrimage to Mecca, one of the five pillars of Islam.",
  },
  {
    id: 72,
    text: "Which Surah mentions the story of Prophet Yusuf in detail?",
    options: ["Yusuf", "Al-Qasas", "Hud", "Al-Anbiya"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Quran",
    explanation: "Surah Yusuf is entirely dedicated to the story of Prophet Yusuf (Joseph).",
  },
  {
    id: 73,
    text: "What is the Arabic term for the night prayers during Ramadan?",
    options: ["Tahajjud", "Tarawih", "Qiyam", "Witr"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Prayer",
    explanation: "Tarawih are the special night prayers performed during the month of Ramadan.",
  },
  {
    id: 74,
    text: "Which companion was the first to accept Islam among men?",
    options: ["Abu Bakr", "Ali ibn Abi Talib", "Umar ibn al-Khattab", "Uthman ibn Affan"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Companions",
    explanation: "Abu Bakr was the first adult male to accept Islam.",
  },
  {
    id: 75,
    text: "What is the Arabic word for the direction of prayer?",
    options: ["Mihrab", "Qibla", "Minbar", "Minaret"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Prayer",
    explanation: "Qibla is the direction Muslims face during prayer, towards the Kaaba in Mecca.",
  },
  // Continue with final questions to reach 100
  {
    id: 76,
    text: "Which prophet was swallowed by a whale?",
    options: ["Yunus", "Yusuf", "Ayyub", "Zakariya"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Prophets",
    explanation: "Prophet Yunus (Jonah) was swallowed by a whale as mentioned in the Quran.",
  },
  {
    id: 77,
    text: "What is the Arabic term for the voluntary night prayer?",
    options: ["Fajr", "Tahajjud", "Witr", "Duha"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Prayer",
    explanation: "Tahajjud is the voluntary night prayer performed after sleeping and before Fajr.",
  },
  {
    id: 78,
    text: "Which Surah is known as the 'Mother of the Book'?",
    options: ["Al-Baqarah", "Al-Fatiha", "Al-Ikhlas", "An-Nas"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Quran",
    explanation: "Al-Fatiha is called 'Umm al-Kitab' (Mother of the Book) due to its comprehensive nature.",
  },
  {
    id: 79,
    text: "What is the minimum amount of silver that makes Zakat obligatory?",
    options: ["595 grams", "612.36 grams", "650 grams", "700 grams"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "Zakat",
    explanation: "The nisab for silver is 612.36 grams (equivalent to 200 dirhams).",
  },
  {
    id: 80,
    text: "Which prophet was known for his wisdom and judgment?",
    options: ["Dawud", "Sulaiman", "Isa", "Musa"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Prophets",
    explanation: "Prophet Sulaiman (Solomon) was renowned for his wisdom and just judgment.",
  },
  // Final 20 questions
  {
    id: 81,
    text: "What is the Arabic word for the pre-dawn meal during Ramadan?",
    options: ["Iftar", "Suhur", "Sahur", "Both B and C"],
    correctAnswer: 3,
    difficulty: "easy",
    category: "Fasting",
    explanation: "Suhur or Sahur is the pre-dawn meal eaten before beginning the fast.",
  },
  {
    id: 82,
    text: "Which battle resulted in the martyrdom of Hamza, the Prophet's uncle?",
    options: ["Battle of Badr", "Battle of Uhud", "Battle of Khandaq", "Battle of Khaybar"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Islamic History",
    explanation: "Hamza ibn Abdul-Muttalib was martyred during the Battle of Uhud.",
  },
  {
    id: 83,
    text: "What is the Arabic term for the ritual circumambulation of the Kaaba?",
    options: ["Sa'i", "Tawaf", "Wuquf", "Rami"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Hajj",
    explanation: "Tawaf is the ritual of walking seven times around the Kaaba during Hajj and Umrah.",
  },
  {
    id: 84,
    text: "Which Surah contains the most verses?",
    options: ["Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Maidah"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Quran",
    explanation: "Surah Al-Baqarah has 286 verses, making it the longest chapter in the Quran.",
  },
  {
    id: 85,
    text: "What is the Arabic word for the meal that breaks the fast?",
    options: ["Suhur", "Iftar", "Sahur", "Qiyam"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Fasting",
    explanation: "Iftar is the meal eaten to break the fast at sunset during Ramadan.",
  },
  // Final 15 questions
  {
    id: 86,
    text: "Which prophet was given the Torah?",
    options: ["Ibrahim", "Musa", "Isa", "Dawud"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Prophets",
    explanation: "Prophet Musa (Moses) was given the Torah (Tawrat) as a holy book.",
  },
  {
    id: 87,
    text: "What is the Arabic term for the Islamic creed?",
    options: ["Shahada", "Aqidah", "Iman", "Tawhid"],
    correctAnswer: 0,
    difficulty: "medium",
    category: "Basics",
    explanation: "Shahada is the Islamic declaration of faith and the first pillar of Islam.",
  },
  {
    id: 88,
    text: "Which companion was known as 'Al-Farooq' (The Criterion)?",
    options: ["Abu Bakr", "Umar ibn al-Khattab", "Uthman ibn Affan", "Ali ibn Abi Talib"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Companions",
    explanation: "Umar ibn al-Khattab was called 'Al-Farooq' for his ability to distinguish between right and wrong.",
  },
  {
    id: 89,
    text: "What is the Arabic word for the pulpit in a mosque?",
    options: ["Mihrab", "Minbar", "Minaret", "Qibla"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Mosque",
    explanation: "Minbar is the pulpit from which the imam delivers the Friday sermon (khutbah).",
  },
  {
    id: 90,
    text: "Which Surah is entirely about the oneness of Allah?",
    options: ["Al-Fatiha", "Al-Ikhlas", "An-Nas", "Al-Falaq"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "Quran",
    explanation: "Surah Al-Ikhlas (The Sincerity) is entirely devoted to the concept of Allah's oneness.",
  },
  // Final 10 questions
  {
    id: 91,
    text: "What is the Arabic term for the Islamic month of pilgrimage?",
    options: ["Ramadan", "Muharram", "Dhul-Hijjah", "Rajab"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Calendar",
    explanation: "Dhul-Hijjah is the twelfth month of the Islamic calendar when Hajj is performed.",
  },
  {
    id: 92,
    text: "Which prophet was known as 'Ruh Allah' (Spirit of Allah)?",
    options: ["Ibrahim", "Musa", "Isa", "Muhammad"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "Prophets",
    explanation: "Prophet Isa (Jesus) is referred to as 'Ruh Allah' (Spirit of Allah) in Islamic tradition.",
  },
  {
    id: 93,
    text: "What is the Arabic word for the niche in a mosque indicating the direction of prayer?",
    options: ["Minbar", "Mihrab", "Minaret", "Qibla"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Mosque",
    explanation: "Mihrab is the niche in the wall of a mosque that indicates the direction of Mecca.",
  },
  {
    id: 94,
    text: "Which Surah is known as the 'Heart of the Quran'?",
    options: ["Al-Fatiha", "Ya-Sin", "Al-Ikhlas", "Al-Baqarah"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "Quran",
    explanation: "Surah Ya-Sin is often called the 'Heart of the Quran' due to its central themes.",
  },
  {
    id: 95,
    text: "What is the Arabic term for the Islamic concept of destiny?",
    options: ["Qadar", "Qada", "Taqdeer", "All of the above"],
    correctAnswer: 3,
    difficulty: "hard",
    category: "Beliefs",
    explanation: "Qadar, Qada, and Taqdeer all refer to the Islamic concept of divine destiny and predestination.",
  },
  // Final 5 questions
  {
    id: 96,
    text: "Which companion was the first to be martyred in Islam?",
    options: ["Hamza", "Sumayya", "Yasir", "Bilal"],
    correctAnswer: 1,
    difficulty: "hard",
    category: "Companions",
    explanation: "Sumayya bint Khayyat was the first martyr in Islam, killed for refusing to renounce her faith.",
  },
  {
    id: 97,
    text: "What is the Arabic word for the tower of a mosque?",
    options: ["Mihrab", "Minbar", "Minaret", "Maqam"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Mosque",
    explanation: "Minaret is the tower of a mosque from which the call to prayer is traditionally made.",
  },
  {
    id: 98,
    text: "Which prophet was given the Gospel (Injil)?",
    options: ["Musa", "Dawud", "Isa", "Muhammad"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "Prophets",
    explanation: "Prophet Isa (Jesus) was given the Gospel (Injil) as a holy book.",
  },
  {
    id: 99,
    text: "What is the Arabic term for the Islamic greeting?",
    options: ["As-salamu alaykum", "Bismillah", "Alhamdulillah", "Subhanallah"],
    correctAnswer: 0,
    difficulty: "easy",
    category: "Basics",
    explanation: "'As-salamu alaykum' means 'Peace be upon you' and is the standard Islamic greeting.",
  },
  {
    id: 100,
    text: "Which Surah is recited in times of difficulty?",
    options: ["Al-Fatiha", "Al-Ikhlas", "Al-Falaq", "All of the above"],
    correctAnswer: 3,
    difficulty: "medium",
    category: "Quran",
    explanation: "All these Surahs are commonly recited during times of difficulty for protection and guidance.",
  },
]

interface QuizState {
  currentQuestionIndex: number
  selectedAnswer: number | null
  score: number
  showResult: boolean
  timeLeft: number
  isActive: boolean
  questions: Question[]
  difficulty: "easy" | "medium" | "hard" | "mixed"
}

export function IslamicQuiz() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswer: null,
    score: 0,
    showResult: false,
    timeLeft: 30,
    isActive: false,
    questions: [],
    difficulty: "mixed",
  })

  const [showExplanation, setShowExplanation] = useState(false)

  // Function to select random questions based on difficulty
  const selectQuestions = (difficulty: "easy" | "medium" | "hard" | "mixed", count = 5): Question[] => {
    let filteredQuestions: Question[]

    if (difficulty === "mixed") {
      // For mixed difficulty, select questions from all levels
      filteredQuestions = [...allQuestions]
    } else {
      // Filter by specific difficulty
      filteredQuestions = allQuestions.filter((q) => q.difficulty === difficulty)
    }

    // Shuffle and select random questions
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (quizState.isActive && quizState.timeLeft > 0 && !quizState.showResult) {
      interval = setInterval(() => {
        setQuizState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }))
      }, 1000)
    } else if (quizState.timeLeft === 0 && !quizState.showResult) {
      // Time's up, move to next question or end quiz
      handleNextQuestion()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [quizState.isActive, quizState.timeLeft, quizState.showResult])

  const startQuiz = (difficulty: "easy" | "medium" | "hard" | "mixed") => {
    const selectedQuestions = selectQuestions(difficulty, 5)
    setQuizState({
      currentQuestionIndex: 0,
      selectedAnswer: null,
      score: 0,
      showResult: false,
      timeLeft: 30,
      isActive: true,
      questions: selectedQuestions,
      difficulty,
    })
    setShowExplanation(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState.selectedAnswer === null) {
      setQuizState((prev) => ({
        ...prev,
        selectedAnswer: answerIndex,
      }))
    }
  }

  const handleNextQuestion = () => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
    const isCorrect = quizState.selectedAnswer === currentQuestion.correctAnswer

    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setTimeout(() => {
        setQuizState((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedAnswer: null,
          score: isCorrect ? prev.score + 1 : prev.score,
          timeLeft: 30,
        }))
        setShowExplanation(false)
      }, 100)
    } else {
      // Quiz finished
      setQuizState((prev) => ({
        ...prev,
        showResult: true,
        isActive: false,
        score: isCorrect ? prev.score + 1 : prev.score,
      }))
    }
  }

  const resetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      selectedAnswer: null,
      score: 0,
      showResult: false,
      timeLeft: 30,
      isActive: false,
      questions: [],
      difficulty: "mixed",
    })
    setShowExplanation(false)
  }

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return "Excellent! Masha'Allah! 🌟"
    if (percentage >= 60) return "Good job! Keep learning! 📚"
    if (percentage >= 40) return "Not bad! Study more! 💪"
    return "Keep trying! Learning is a journey! 🤲"
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  if (!quizState.isActive && !quizState.showResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Islamic Knowledge Quiz
          </CardTitle>
          <CardDescription>
            Test your knowledge with questions from our collection of 100+ Islamic questions. Choose your difficulty
            level to begin!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Each quiz contains 5 randomly selected questions from our extensive database.
            </p>
          </div>

          <Tabs defaultValue="mixed" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
              <TabsTrigger value="mixed">Mixed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button onClick={() => startQuiz("easy")} className="h-16 flex-col">
              <span className="font-semibold">Easy</span>
              <span className="text-xs opacity-75">Basic Islamic knowledge</span>
            </Button>
            <Button onClick={() => startQuiz("medium")} variant="outline" className="h-16 flex-col">
              <span className="font-semibold">Medium</span>
              <span className="text-xs opacity-75">Intermediate level</span>
            </Button>
            <Button onClick={() => startQuiz("hard")} variant="outline" className="h-16 flex-col">
              <span className="font-semibold">Hard</span>
              <span className="text-xs opacity-75">Advanced knowledge</span>
            </Button>
            <Button onClick={() => startQuiz("mixed")} variant="outline" className="h-16 flex-col">
              <span className="font-semibold">Mixed</span>
              <span className="text-xs opacity-75">All difficulty levels</span>
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have 30 seconds per question. Questions are randomly selected from our database of 100+ Islamic
              knowledge questions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (quizState.showResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl font-bold text-emerald-600 dark:text-emerald-400">
            {quizState.score}/{quizState.questions.length}
          </div>
          <p className="text-xl font-semibold">{getScoreMessage(quizState.score, quizState.questions.length)}</p>
          <div className="space-y-2">
            <Progress value={(quizState.score / quizState.questions.length) * 100} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {Math.round((quizState.score / quizState.questions.length) * 100)}% Correct
            </p>
          </div>
          <Badge className={getDifficultyColor(quizState.difficulty)}>
            {quizState.difficulty.charAt(0).toUpperCase() + quizState.difficulty.slice(1)} Level
          </Badge>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button onClick={resetQuiz} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={() => startQuiz(quizState.difficulty)}>New Quiz</Button>
        </CardFooter>
      </Card>
    )
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
  const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(currentQuestion.difficulty)}>{currentQuestion.difficulty}</Badge>
            <Badge variant="outline">{currentQuestion.category}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className={`font-mono ${quizState.timeLeft <= 10 ? "text-red-500" : ""}`}>{quizState.timeLeft}s</span>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">
          Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold leading-relaxed">{currentQuestion.text}</h3>
        <RadioGroup
          key={`question-${quizState.currentQuestionIndex}`}
          value={quizState.selectedAnswer?.toString()}
          onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
          disabled={quizState.selectedAnswer !== null}
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = quizState.selectedAnswer === index
            const isCorrect = index === currentQuestion.correctAnswer
            const showResult = quizState.selectedAnswer !== null

            return (
              <div
                key={index}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                  showResult
                    ? isCorrect
                      ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                      : isSelected
                        ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                        : "bg-gray-50 dark:bg-gray-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
                {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
              </div>
            )
          })}
        </RadioGroup>

        {quizState.selectedAnswer !== null && currentQuestion.explanation && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        {quizState.selectedAnswer !== null && (
          <Button onClick={handleNextQuestion} className="w-full">
            {quizState.currentQuestionIndex < quizState.questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
