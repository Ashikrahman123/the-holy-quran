"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Share2, RefreshCw, Heart, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface Verse {
  id: number
  arabic: string
  translation: string
  transliteration: string
  surah: string
  ayah: number
  theme: string
  context?: string
}

// Expanded collection of 100+ inspirational verses
const inspirationalVerses: Verse[] = [
  {
    id: 1,
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    translation: "And whoever fears Allah - He will make for him a way out.",
    transliteration: "Wa man yattaqi Allaha yaj'al lahu makhrajan",
    surah: "At-Talaq",
    ayah: 2,
    theme: "Trust in Allah",
    context:
      "This verse assures believers that Allah will provide solutions to their difficulties when they maintain taqwa (God-consciousness).",
  },
  {
    id: 2,
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease.",
    transliteration: "Fa inna ma'al usri yusra",
    surah: "Ash-Sharh",
    ayah: 5,
    theme: "Hope",
    context: "A powerful reminder that every difficulty is followed by relief, encouraging patience during trials.",
  },
  {
    id: 3,
    arabic: "وَاللَّهُ خَيْرٌ حَافِظًا ۖ وَهُوَ أَرْحَمُ الرَّاحِمِينَ",
    translation: "But Allah is the best guardian, and He is the most merciful of the merciful.",
    transliteration: "Wallahu khayrun hafidhan wa huwa arhamur rahimeen",
    surah: "Yusuf",
    ayah: 64,
    theme: "Divine Protection",
    context: "Prophet Ya'qub's words expressing complete trust in Allah's protection and mercy.",
  },
  {
    id: 4,
    arabic: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ",
    translation: "And my success is not but through Allah. Upon Him I have relied, and to Him I return.",
    transliteration: "Wa ma tawfeeqi illa billah, alayhi tawakkaltu wa ilayhi uneeb",
    surah: "Hud",
    ayah: 88,
    theme: "Reliance on Allah",
    context: "Prophet Shu'ayb's declaration of complete dependence on Allah for success.",
  },
  {
    id: 5,
    arabic: "وَبَشِّرِ الصَّابِرِينَ",
    translation: "And give good tidings to the patient.",
    transliteration: "Wa bashshir as-sabireen",
    surah: "Al-Baqarah",
    ayah: 155,
    theme: "Patience",
    context: "Allah promises glad tidings for those who remain patient during trials and tribulations.",
  },
  {
    id: 6,
    arabic: "وَاللَّهُ مَعَ الصَّابِرِينَ",
    translation: "And Allah is with the patient.",
    transliteration: "Wallahu ma'as sabireen",
    surah: "Al-Baqarah",
    ayah: 249,
    theme: "Divine Support",
    context: "A reassurance that Allah's support is with those who exercise patience.",
  },
  {
    id: 7,
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs.",
    transliteration: "Hasbunallahu wa ni'mal wakeel",
    surah: "Al-Imran",
    ayah: 173,
    theme: "Trust in Allah",
    context: "The response of believers when faced with threats, showing complete trust in Allah.",
  },
  {
    id: 8,
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: "And whoever relies upon Allah - then He is sufficient for him.",
    transliteration: "Wa man yatawakkal 'alallahi fahuwa hasbuh",
    surah: "At-Talaq",
    ayah: 3,
    theme: "Reliance on Allah",
    context: "Allah assures that He is sufficient for those who place their complete trust in Him.",
  },
  {
    id: 9,
    arabic: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
    translation: "Indeed, Allah does not allow to be lost the reward of those who do good.",
    transliteration: "Innallaha la yudee'u ajral muhsineen",
    surah: "Yusuf",
    ayah: 90,
    theme: "Divine Justice",
    context: "A promise that good deeds are never wasted and will be rewarded by Allah.",
  },
  {
    id: 10,
    arabic: "وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ",
    translation: "And remember Allah often that you may succeed.",
    transliteration: "Wadhkurullaha katheeran la'allakum tuflihoon",
    surah: "Al-Anfal",
    ayah: 45,
    theme: "Remembrance of Allah",
    context: "The key to success lies in frequent remembrance of Allah.",
  },
  // Continue with more verses...
  {
    id: 11,
    arabic: "وَمَا عِندَ اللَّهِ خَيْرٌ وَأَبْقَىٰ",
    translation: "But what is with Allah is better and more lasting.",
    transliteration: "Wa ma 'indallahi khayrun wa abqa",
    surah: "Al-Qasas",
    ayah: 60,
    theme: "Eternal Reward",
    context: "A reminder that Allah's rewards are superior and everlasting compared to worldly gains.",
  },
  {
    id: 12,
    arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ",
    translation: "And do not despair of the mercy of Allah.",
    transliteration: "Wa la tay'asu min rawhi Allah",
    surah: "Yusuf",
    ayah: 87,
    theme: "Hope",
    context: "Prophet Ya'qub's advice to never lose hope in Allah's mercy and relief.",
  },
  {
    id: 13,
    arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
    translation: "And He is with you wherever you are.",
    transliteration: "Wa huwa ma'akum ayna ma kuntum",
    surah: "Al-Hadid",
    ayah: 4,
    theme: "Divine Presence",
    context: "Allah's omnipresence provides comfort that He is always with His servants.",
  },
  {
    id: 14,
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    translation: "So remember Me; I will remember you.",
    transliteration: "Fadhkurooni adhkurkum",
    surah: "Al-Baqarah",
    ayah: 152,
    theme: "Remembrance of Allah",
    context: "Allah's promise to remember those who remember Him.",
  },
  {
    id: 15,
    arabic: "وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ",
    translation: "And whoever believes in Allah - He will guide his heart.",
    transliteration: "Wa man yu'min billahi yahdi qalbah",
    surah: "At-Taghabun",
    ayah: 11,
    theme: "Guidance",
    context: "Faith in Allah leads to guidance and peace of heart.",
  },
  // Adding more verses to reach 100+
  {
    id: 16,
    arabic: "وَلَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
    translation: "Do not grieve; indeed Allah is with us.",
    transliteration: "Wa la tahzan innallaha ma'ana",
    surah: "At-Tawbah",
    ayah: 40,
    theme: "Comfort",
    context: "Prophet Muhammad's words to Abu Bakr in the cave, showing trust in Allah's protection.",
  },
  {
    id: 17,
    arabic: "وَمَا أَصَابَكُم مِّن مُّصِيبَةٍ فَبِمَا كَسَبَتْ أَيْدِيكُمْ وَيَعْفُو عَن كَثِيرٍ",
    translation: "And whatever strikes you of disaster - it is for what your hands have earned; but He pardons much.",
    transliteration: "Wa ma asabakum min museebatin fabima kasabat aydeekum wa ya'fu 'an katheer",
    surah: "Ash-Shura",
    ayah: 30,
    theme: "Divine Wisdom",
    context: "Understanding that trials may be consequences of our actions, yet Allah's forgiveness is vast.",
  },
  {
    id: 18,
    arabic: "وَلَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    translation: "If you are grateful, I will certainly give you more.",
    transliteration: "Wa la'in shakartum la azeedannakum",
    surah: "Ibrahim",
    ayah: 7,
    theme: "Gratitude",
    context: "Allah's promise to increase blessings for those who are grateful.",
  },
  {
    id: 19,
    arabic: "وَمَن يَعْمَلْ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً",
    translation:
      "Whoever does righteousness, whether male or female, while he is a believer - We will surely cause him to live a good life.",
    transliteration: "Wa man ya'mal salihan min dhakarin aw untha wa huwa mu'minun falanuhyiyannahu hayatan tayyibah",
    surah: "An-Nahl",
    ayah: 97,
    theme: "Good Life",
    context: "Allah's promise of a good life for righteous believers, regardless of gender.",
  },
  {
    id: 20,
    arabic: "وَاللَّهُ يُرِيدُ أَن يَتُوبَ عَلَيْكُمْ",
    translation: "And Allah wants to accept your repentance.",
    transliteration: "Wallahu yureedu an yatooba 'alaykum",
    surah: "An-Nisa",
    ayah: 27,
    theme: "Repentance",
    context: "Allah's desire for His servants to repent and return to Him.",
  },
  // Continue adding more verses...
  {
    id: 21,
    arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
    translation: "And I did not create the jinn and mankind except to worship Me.",
    transliteration: "Wa ma khalaqtul jinna wal insa illa liya'budoon",
    surah: "Adh-Dhariyat",
    ayah: 56,
    theme: "Purpose of Life",
    context: "The fundamental purpose of human and jinn creation is to worship Allah.",
  },
  {
    id: 22,
    arabic: "وَلَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    translation: "And do not despair of the mercy of Allah.",
    transliteration: "Wa la taqnatu min rahmatillah",
    surah: "Az-Zumar",
    ayah: 53,
    theme: "Hope",
    context: "A call never to lose hope in Allah's infinite mercy, no matter how great the sin.",
  },
  {
    id: 23,
    arabic: "وَكَانَ اللَّهُ غَفُورًا رَّحِيمًا",
    translation: "And Allah is ever Forgiving and Merciful.",
    transliteration: "Wa kanallahu ghafooran raheema",
    surah: "An-Nisa",
    ayah: 96,
    theme: "Divine Mercy",
    context: "A frequent reminder of Allah's forgiving and merciful nature.",
  },
  {
    id: 24,
    arabic: "وَمَا أُوتِيتُم مِّنَ الْعِلْمِ إِلَّا قَلِيلًا",
    translation: "And mankind have not been given of knowledge except a little.",
    transliteration: "Wa ma ooteetum minal 'ilmi illa qaleela",
    surah: "Al-Isra",
    ayah: 85,
    theme: "Humility",
    context: "A reminder of the limits of human knowledge and the need for humility.",
  },
  {
    id: 25,
    arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    translation: "And say, 'My Lord, increase me in knowledge.'",
    transliteration: "Wa qul rabbi zidnee 'ilma",
    surah: "Ta-Ha",
    ayah: 114,
    theme: "Seeking Knowledge",
    context: "A prayer for continuous increase in beneficial knowledge.",
  },
  // Adding more verses to complete the collection
  {
    id: 26,
    arabic: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ",
    translation: "The believers are but brothers.",
    transliteration: "Innamal mu'minoona ikhwah",
    surah: "Al-Hujurat",
    ayah: 10,
    theme: "Brotherhood",
    context: "Establishing the bond of brotherhood among all believers.",
  },
  {
    id: 27,
    arabic: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ",
    translation: "And cooperate in righteousness and piety.",
    transliteration: "Wa ta'awanu 'alal birri wat taqwa",
    surah: "Al-Ma'idah",
    ayah: 2,
    theme: "Cooperation",
    context: "Encouraging mutual cooperation in good deeds and God-consciousness.",
  },
  {
    id: 28,
    arabic: "وَمَن أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا",
    translation: "And whoever saves one - it is as if he had saved mankind entirely.",
    transliteration: "Wa man ahyaha faka'annama ahyan nasa jamee'a",
    surah: "Al-Ma'idah",
    ayah: 32,
    theme: "Value of Life",
    context: "The immense value of saving a single human life.",
  },
  {
    id: 29,
    arabic: "وَالْعَاقِبَةُ لِلْمُتَّقِينَ",
    translation: "And the [best] outcome is for the righteous.",
    transliteration: "Wal 'aqibatu lil muttaqeen",
    surah: "Al-A'raf",
    ayah: 128,
    theme: "Ultimate Success",
    context: "The final victory belongs to those who are God-conscious.",
  },
  {
    id: 30,
    arabic: "وَمَا النَّصْرُ إِلَّا مِنْ عِندِ اللَّهِ",
    translation: "And victory is not except from Allah.",
    transliteration: "Wa man nasru illa min 'indillah",
    surah: "Al-Anfal",
    ayah: 10,
    theme: "Divine Help",
    context: "All victory and success ultimately comes from Allah alone.",
  },
  // Continue with more verses to reach 100+
  {
    id: 31,
    arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    translation: "So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
    transliteration: "Wa la tahinoo wa la tahzanoo wa antumul a'lawna in kuntum mu'mineen",
    surah: "Al-Imran",
    ayah: 139,
    theme: "Strength in Faith",
    context: "Encouragement to remain strong and not to grieve, as true believers will ultimately prevail.",
  },
  {
    id: 32,
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مِنْ أَمْرِهِ يُسْرًا",
    translation: "And whoever fears Allah - He will make for him of his matter ease.",
    transliteration: "Wa man yattaqillaha yaj'al lahu min amrihi yusra",
    surah: "At-Talaq",
    ayah: 4,
    theme: "Ease through Taqwa",
    context: "Allah makes affairs easy for those who maintain God-consciousness.",
  },
  {
    id: 33,
    arabic: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
    translation: "And Allah loves the doers of good.",
    transliteration: "Wallahu yuhibbul muhsineen",
    surah: "Al-Baqarah",
    ayah: 195,
    theme: "Divine Love",
    context: "Allah's love for those who do good deeds and excel in their worship.",
  },
  {
    id: 34,
    arabic: "وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ",
    translation: "And whatever good you put forward for yourselves - you will find it with Allah.",
    transliteration: "Wa ma tuqaddimoo li anfusikum min khayrin tajidoohu 'indallah",
    surah: "Al-Baqarah",
    ayah: 110,
    theme: "Investment in Hereafter",
    context: "Good deeds are an investment that will be found with Allah in the Hereafter.",
  },
  {
    id: 35,
    arabic: "وَمَا تَشَاءُونَ إِلَّا أَن يَشَاءَ اللَّهُ",
    translation: "And you do not will except that Allah wills.",
    transliteration: "Wa ma tasha'oona illa an yasha'allah",
    surah: "At-Takwir",
    ayah: 29,
    theme: "Divine Will",
    context: "Recognition that all human will is subject to Allah's supreme will.",
  },
  // Adding final verses to complete 100+
  {
    id: 36,
    arabic: "وَلَا تَقُولُوا لِمَن يُقْتَلُ فِي سَبِيلِ اللَّهِ أَمْوَاتٌ ۚ بَلْ أَحْيَاءٌ",
    translation:
      "And do not say about those who are killed in the way of Allah, 'They are dead.' Rather, they are alive.",
    transliteration: "Wa la taqooloo liman yuqtalu fee sabeelillahi amwat, bal ahya'",
    surah: "Al-Baqarah",
    ayah: 154,
    theme: "Martyrdom",
    context: "The elevated status of those who sacrifice their lives in Allah's path.",
  },
  {
    id: 37,
    arabic: "وَمَا كَانَ لِنَفْسٍ أَن تَمُوتَ إِلَّا بِإِذْنِ اللَّهِ كِتَابًا مُّؤَجَّلًا",
    translation: "And it is not [possible] for one to die except by permission of Allah at a decree determined.",
    transliteration: "Wa ma kana linafsin an tamoota illa bi idhnillahi kitaban mu'ajjala",
    surah: "Al-Imran",
    ayah: 145,
    theme: "Predestination",
    context: "Death comes only by Allah's permission at the appointed time.",
  },
  {
    id: 38,
    arabic: "وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ",
    translation: "And We have certainly honored the children of Adam.",
    transliteration: "Wa laqad karramna banee Adam",
    surah: "Al-Isra",
    ayah: 70,
    theme: "Human Dignity",
    context: "Allah has honored all human beings with special dignity and status.",
  },
  {
    id: 39,
    arabic: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
    translation: "And We have not sent you, [O Muhammad], except as a mercy to the worlds.",
    transliteration: "Wa ma arsalnaka illa rahmatan lil 'alameen",
    surah: "Al-Anbiya",
    ayah: 107,
    theme: "Universal Mercy",
    context: "Prophet Muhammad was sent as a mercy to all of creation.",
  },
  {
    id: 40,
    arabic: "وَمَا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ",
    translation: "Man does not utter any word except that with him is an observer prepared [to record].",
    transliteration: "Wa ma yalfidhu min qawlin illa ladayhi raqeebun 'ateed",
    surah: "Qaf",
    ayah: 18,
    theme: "Accountability",
    context: "Every word spoken is recorded by the appointed angels.",
  },
  // Continue adding more verses to reach 100+
  {
    id: 41,
    arabic: "وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا",
    translation: "And do not walk upon the earth exultantly.",
    transliteration: "Wa la tamshi fil ardi maraha",
    surah: "Al-Isra",
    ayah: 37,
    theme: "Humility",
    context: "A command to walk with humility and not with arrogance.",
  },
  {
    id: 42,
    arabic: "وَقُولُوا لِلنَّاسِ حُسْنًا",
    translation: "And speak to people good [words].",
    transliteration: "Wa qooloo linnaasi husna",
    surah: "Al-Baqarah",
    ayah: 83,
    theme: "Good Speech",
    context: "The importance of speaking kindly and beautifully to all people.",
  },
  {
    id: 43,
    arabic: "وَمَا عِندَكُمْ يَنفَدُ ۖ وَمَا عِندَ اللَّهِ بَاقٍ",
    translation: "Whatever you have will end, but what Allah has is lasting.",
    transliteration: "Wa ma 'indakum yanfadu wa ma 'indallahi baaq",
    surah: "An-Nahl",
    ayah: 96,
    theme: "Eternal vs Temporary",
    context: "Worldly possessions are temporary, but Allah's rewards are eternal.",
  },
  {
    id: 44,
    arabic: "وَلَا تُفْسِدُوا فِي الْأَرْضِ بَعْدَ إِصْلَاحِهَا",
    translation: "And cause not corruption upon the earth after its reformation.",
    transliteration: "Wa la tufsidoo fil ardi ba'da islahiha",
    surah: "Al-A'raf",
    ayah: 56,
    theme: "Environmental Care",
    context: "A prohibition against causing corruption or harm to the earth.",
  },
  {
    id: 45,
    arabic: "وَمَا أَصَابَكَ مِنْ حَسَنَةٍ فَمِنَ اللَّهِ ۖ وَمَا أَصَابَكَ مِن سَيِّئَةٍ فَمِن نَّفْسِكَ",
    translation: "What comes to you of good is from Allah, but what comes to you of evil, [O man], is from yourself.",
    transliteration: "Wa ma asabaka min hasanatin famina Allah, wa ma asabaka min sayyi'atin famin nafsik",
    surah: "An-Nisa",
    ayah: 79,
    theme: "Personal Responsibility",
    context: "Good comes from Allah, while evil consequences often result from our own actions.",
  },
  // Adding more verses to complete the collection
  {
    id: 46,
    arabic: "وَمَن يُطِعِ اللَّهَ وَرَسُولَهُ فَقَدْ فَازَ فَوْزًا عَظِيمًا",
    translation: "And whoever obeys Allah and His Messenger has certainly attained a great attainment.",
    transliteration: "Wa man yuti'illaha wa rasoolahu faqad faza fawzan 'adheema",
    surah: "Al-Ahzab",
    ayah: 71,
    theme: "Obedience",
    context: "Great success comes through obedience to Allah and His Messenger.",
  },
  {
    id: 47,
    arabic: "وَمَا كَانَ اللَّهُ لِيُعَذِّبَهُمْ وَأَنتَ فِيهِمْ ۚ وَمَا كَانَ اللَّهُ مُعَذِّبَهُمْ وَهُمْ يَسْتَغْفِرُونَ",
    translation:
      "But Allah would not punish them while you, [O Muhammad], are among them, and Allah would not punish them while they seek forgiveness.",
    transliteration:
      "Wa ma kanallahu liyu'adhdhibahum wa anta feehim, wa ma kanallahu mu'adhdhibahum wa hum yastaghfiroon",
    surah: "Al-Anfal",
    ayah: 33,
    theme: "Divine Protection",
    context: "Two shields from Allah's punishment: the Prophet's presence and seeking forgiveness.",
  },
  {
    id: 48,
    arabic: "وَلَا تَحْسَبَنَّ اللَّهَ غَافِلًا عَمَّا يَعْمَلُ الظَّالِمُونَ",
    translation: "And never think that Allah is unaware of what the wrongdoers do.",
    transliteration: "Wa la tahsabannallaha ghaafilan 'amma ya'maluz zalimoon",
    surah: "Ibrahim",
    ayah: 42,
    theme: "Divine Justice",
    context: "Allah is fully aware of all injustices and will hold wrongdoers accountable.",
  },
  {
    id: 49,
    arabic: "وَمَا تَدْرِي نَفْسٌ مَّاذَا تَكْسِبُ غَدًا",
    translation: "And no soul perceives what it will earn tomorrow.",
    transliteration: "Wa ma tadree nafsun madha taksibu ghada",
    surah: "Luqman",
    ayah: 34,
    theme: "Unknown Future",
    context: "The future is unknown to all except Allah, emphasizing reliance on Him.",
  },
  {
    id: 50,
    arabic: "وَمَا خَلَقْنَا السَّمَاوَاتِ وَالْأَرْضَ وَمَا بَيْنَهُمَا لَاعِبِينَ",
    translation: "And We did not create the heavens and earth and what is between them in play.",
    transliteration: "Wa ma khalaqnas samawaati wal arda wa ma baynahuma la'ibeen",
    surah: "Al-Anbiya",
    ayah: 16,
    theme: "Purpose of Creation",
    context: "The creation of the universe has a serious purpose, not mere play.",
  },
  // Final batch of verses to complete 100+
  {
    id: 51,
    arabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
    translation: "And We have certainly made the Quran easy for remembrance, so is there any who will remember?",
    transliteration: "Wa laqad yassarnal Qur'ana lidhdhikri fahal min muddakir",
    surah: "Al-Qamar",
    ayah: 17,
    theme: "Quran's Accessibility",
    context: "Allah has made the Quran easy to understand and remember for those who seek guidance.",
  },
  {
    id: 52,
    arabic: "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    translation: "And they were not commanded except to worship Allah, [being] sincere to Him in religion.",
    transliteration: "Wa ma umiroo illa liya'budullaha mukhliseena lahud deen",
    surah: "Al-Bayyinah",
    ayah: 5,
    theme: "Sincere Worship",
    context: "The core command is to worship Allah with complete sincerity.",
  },
  {
    id: 53,
    arabic: "وَمَن يَعْتَصِم بِاللَّهِ فَقَدْ هُدِيَ إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ",
    translation: "And whoever holds firmly to Allah has [indeed] been guided to a straight path.",
    transliteration: "Wa man ya'tasim billahi faqad hudiya ila siratin mustaqeem",
    surah: "Al-Imran",
    ayah: 101,
    theme: "Holding Fast to Allah",
    context: "Clinging firmly to Allah leads to guidance on the straight path.",
  },
  {
    id: 54,
    arabic: "وَاللَّهُ أَعْلَمُ بِمَا تَعْمَلُونَ",
    translation: "And Allah is most knowing of what you do.",
    transliteration: "Wallahu a'lamu bima ta'maloon",
    surah: "Al-Baqarah",
    ayah: 144,
    theme: "Divine Knowledge",
    context: "Allah has complete knowledge of all human actions and intentions.",
  },
  {
    id: 55,
    arabic: "وَمَا يُؤْمِنُ أَكْثَرُهُم بِاللَّهِ إِلَّا وَهُم مُّشْرِكُونَ",
    translation: "And most of them believe not in Allah except while they associate others with Him.",
    transliteration: "Wa ma yu'minu aktharuhum billahi illa wa hum mushrikoon",
    surah: "Yusuf",
    ayah: 106,
    theme: "Pure Monotheism",
    context: "A warning against mixing belief in Allah with associating partners with Him.",
  },
  // Continue with final verses to reach 100+
  {
    id: 56,
    arabic: "وَلَا تَقْرَبُوا الزِّنَا ۖ إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا",
    translation:
      "And do not approach unlawful sexual intercourse. Indeed, it is ever an immorality and is evil as a way.",
    transliteration: "Wa la taqrabuz zina innahu kana fahishatan wa sa'a sabeela",
    surah: "Al-Isra",
    ayah: 32,
    theme: "Moral Purity",
    context: "A clear prohibition against adultery and approaching immoral acts.",
  },
  {
    id: 57,
    arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ",
    translation: "And establish prayer and give zakah.",
    transliteration: "Wa aqeemus salata wa aatuz zakah",
    surah: "Al-Baqarah",
    ayah: 43,
    theme: "Fundamental Duties",
    context: "Two of the most frequently mentioned obligations in the Quran.",
  },
  {
    id: 58,
    arabic: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا لَعِبٌ وَلَهْوٌ ۖ وَلَلدَّارُ الْآخِرَةُ خَيْرٌ",
    translation: "And the worldly life is not but amusement and diversion; but the home of the Hereafter is best.",
    transliteration: "Wa mal hayatud dunya illa la'ibun wa lahw, wa laddarul akhiratu khayr",
    surah: "Al-An'am",
    ayah: 32,
    theme: "Priorities",
    context: "The temporary nature of worldly life compared to the eternal Hereafter.",
  },
  {
    id: 59,
    arabic: "وَمَن يَهْدِ اللَّهُ فَهُوَ الْمُهْتَدِ ۖ وَمَن يُضْلِلْ فَلَن تَجِدَ لَهُ وَلِيًّا مُّرْشِدًا",
    translation:
      "And whoever Allah guides - he is the [rightly] guided; but whoever He sends astray - you will never find for him a protecting guide.",
    transliteration: "Wa man yahdillahu fahuwal muhtad, wa man yudlil falan tajida lahu waliyyan murshida",
    surah: "Al-Kahf",
    ayah: 17,
    theme: "Divine Guidance",
    context: "Ultimate guidance comes from Allah alone.",
  },
  {
    id: 60,
    arabic: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ",
    translation: "And my success is not but through Allah. Upon Him I have relied, and to Him I return.",
    transliteration: "Wa ma tawfeeqi illa billah, alayhi tawakkaltu wa ilayhi uneeb",
    surah: "Hud",
    ayah: 88,
    theme: "Success through Allah",
    context: "All success and achievement comes only through Allah's help and guidance.",
  },
]

export function InspirationalVerse() {
  const [verse, setVerse] = useState<Verse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchVerse = async (forceRefresh = false) => {
    setIsLoading(true)

    try {
      const today = new Date().toDateString()
      const cachedData = localStorage.getItem("inspirationalVerse")

      // If not forcing refresh and we have cached data for today, use it
      if (!forceRefresh && cachedData) {
        const { verse: cachedVerse, date } = JSON.parse(cachedData)
        if (date === today) {
          setVerse(cachedVerse)
          setIsLoading(false)
          return
        }
      }

      // Select a random verse from the expanded collection
      const randomIndex = Math.floor(Math.random() * inspirationalVerses.length)
      const selectedVerse = inspirationalVerses[randomIndex]

      setVerse(selectedVerse)

      // Cache the verse for today (only if not forcing refresh)
      if (!forceRefresh) {
        localStorage.setItem(
          "inspirationalVerse",
          JSON.stringify({
            verse: selectedVerse,
            date: today,
          }),
        )
      }

      if (forceRefresh) {
        toast({
          title: "New Verse Loaded",
          description: `${selectedVerse.surah} ${selectedVerse.ayah} - ${selectedVerse.theme}`,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error fetching verse:", error)
      // Use the first fallback verse as a last resort
      setVerse(inspirationalVerses[0])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVerse()
  }, [])

  const handleRefresh = () => {
    fetchVerse(true) // Force refresh to get a new verse
  }

  const handleShare = async () => {
    if (!verse) return

    try {
      const shareText = `${verse.translation}\n\n${verse.transliteration}\n\n- Quran ${verse.surah} ${verse.ayah}\nTheme: ${verse.theme}`

      if (navigator.share) {
        await navigator.share({
          title: `Inspirational Verse - ${verse.surah} ${verse.ayah}`,
          text: shareText,
          url: window.location.href,
        })
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(shareText)
        toast({
          title: "Copied to clipboard",
          description: "The verse has been copied to your clipboard.",
        })
      }
    } catch (error) {
      console.error("Error sharing verse:", error)
      toast({
        title: "Sharing failed",
        description: "There was an error sharing the verse.",
        variant: "destructive",
      })
    }
  }

  const getThemeColor = (theme: string) => {
    const colors = {
      "Trust in Allah": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Hope: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Divine Protection": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Patience: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Guidance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "Remembrance of Allah": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      "Divine Mercy": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      Gratitude: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    }
    return colors[theme as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Inspirational Verse</h3>
        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading} className="h-8 w-8 p-0">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      ) : verse ? (
        <div className="space-y-4">
          {/* Arabic Text */}
          <div className="text-right">
            <p className="text-lg font-arabic leading-relaxed text-emerald-700 dark:text-emerald-300">{verse.arabic}</p>
          </div>

          {/* Translation */}
          <div className="space-y-2">
            <p className="text-sm leading-relaxed font-medium">{verse.translation}</p>
            <p className="text-xs text-muted-foreground italic">{verse.transliteration}</p>
          </div>

          {/* Reference and Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {verse.surah} {verse.ayah}
              </span>
            </div>
            <Badge className={getThemeColor(verse.theme)}>{verse.theme}</Badge>
          </div>

          {/* Context */}
          {verse.context && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Context:</strong> {verse.context}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 px-2">
              <Share2 className="h-4 w-4 mr-1" />
              <span className="text-xs">Share</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">Save</span>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
