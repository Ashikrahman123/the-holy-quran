// API service for Quran.com API v4
const QURAN_API_BASE = "https://api.quran.com/api/v4"
const ALQURAN_API_BASE = "https://api.alquran.cloud/v1"
const ALADHAN_API_BASE = "https://api.aladhan.com/v1"

// Types for API responses
export interface Chapter {
  id: number
  revelation_place: string
  revelation_order: number
  bismillah_pre: boolean
  name_simple: string
  name_arabic: string
  name_complex: string
  verses_count: number
  pages: number[]
  translated_name: {
    language_name: string
    name: string
  }
}

export interface ChaptersResponse {
  chapters: Chapter[]
}

export interface Verse {
  id: number
  verse_key: string
  text_uthmani: string
  verse_number: number
  words: any[]
  translations: {
    id: number
    text: string
    resource_id: number
    resource_name: string
  }[]
  audio?: {
    url: string
  }
}

export interface VersesResponse {
  verses: Verse[]
  meta: {
    current_page: number
    next_page: number | null
    prev_page: number | null
    total_pages: number
    total_count: number
  }
}

export interface Reciter {
  id: number
  reciter_name: string
  style: string | null
}

export interface RecitersResponse {
  reciters: Reciter[]
}

export interface SearchResult {
  verse_key: string
  text: string
  translations: {
    text: string
  }[]
  words: any[]
  highlighted: {
    text: string
  }
}

export interface SearchResponse {
  search: {
    query: string
    total_results: number
    results: SearchResult[]
  }
}

export interface PrayerTimes {
  timings: {
    Fajr: string
    Sunrise: string
    Dhuhr: string
    Asr: string
    Sunset: string
    Maghrib: string
    Isha: string
    Imsak: string
    Midnight: string
    Firstthird: string
    Lastthird: string
  }
  date: {
    readable: string
    timestamp: string
    hijri: {
      date: string
      month: {
        number: number
        en: string
        ar: string
      }
      year: string
      designation: {
        abbreviated: string
        expanded: string
      }
      holidays: string[]
    }
    gregorian: {
      date: string
      format: string
      day: string
      weekday: {
        en: string
      }
      month: {
        number: number
        en: string
      }
      year: string
      designation: {
        abbreviated: string
        expanded: string
      }
    }
  }
}

export interface PrayerTimesResponse {
  code: number
  status: string
  data: PrayerTimes
}

// Fallback data for when API fails
const fallbackChapters: Chapter[] = [
  {
    id: 1,
    revelation_place: "makkah",
    revelation_order: 5,
    bismillah_pre: false,
    name_simple: "Al-Fatihah",
    name_arabic: "الفاتحة",
    name_complex: "Al-Fātiĥah",
    verses_count: 7,
    pages: [1, 1],
    translated_name: {
      language_name: "english",
      name: "The Opening",
    },
  },
  {
    id: 2,
    revelation_place: "madinah",
    revelation_order: 87,
    bismillah_pre: true,
    name_simple: "Al-Baqarah",
    name_arabic: "البقرة",
    name_complex: "Al-Baqarah",
    verses_count: 286,
    pages: [2, 49],
    translated_name: {
      language_name: "english",
      name: "The Cow",
    },
  },
  {
    id: 36,
    revelation_place: "makkah",
    revelation_order: 41,
    bismillah_pre: true,
    name_simple: "Ya-Sin",
    name_arabic: "يس",
    name_complex: "Yā-Sīn",
    verses_count: 83,
    pages: [440, 445],
    translated_name: {
      language_name: "english",
      name: "Ya Sin",
    },
  },
  {
    id: 55,
    revelation_place: "madinah",
    revelation_order: 97,
    bismillah_pre: true,
    name_simple: "Ar-Rahman",
    name_arabic: "الرحمن",
    name_complex: "Ar-Raĥmān",
    verses_count: 78,
    pages: [531, 534],
    translated_name: {
      language_name: "english",
      name: "The Beneficent",
    },
  },
]

// Fallback verses for Al-Fatihah (Surah 1)
const fallbackFatihaVerses: Verse[] = [
  {
    id: 1,
    verse_key: "1:1",
    text_uthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
    verse_number: 1,
    words: [],
    translations: [
      {
        id: 1,
        text: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 2,
    verse_key: "1:2",
    text_uthmani: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
    verse_number: 2,
    words: [],
    translations: [
      {
        id: 2,
        text: "All praise is for Allah—Lord of all worlds,",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 3,
    verse_key: "1:3",
    text_uthmani: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
    verse_number: 3,
    words: [],
    translations: [
      {
        id: 3,
        text: "the Most Compassionate, Most Merciful,",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 4,
    verse_key: "1:4",
    text_uthmani: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
    verse_number: 4,
    words: [],
    translations: [
      {
        id: 4,
        text: "Master of the Day of Judgment.",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 5,
    verse_key: "1:5",
    text_uthmani: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    verse_number: 5,
    words: [],
    translations: [
      {
        id: 5,
        text: "You ˹alone˺ we worship and You ˹alone˺ we ask for help.",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 6,
    verse_key: "1:6",
    text_uthmani: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
    verse_number: 6,
    words: [],
    translations: [
      {
        id: 6,
        text: "Guide us along the Straight Path,",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 7,
    verse_key: "1:7",
    text_uthmani: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    verse_number: 7,
    words: [],
    translations: [
      {
        id: 7,
        text: "the Path of those You have blessed—not those You are displeased with, or those who are astray.",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
]

// Add fallback verses for Al-Baqarah (first few verses)
// Add this after the fallbackFatihaVerses array

const fallbackBaqarahVerses: Verse[] = [
  {
    id: 1,
    verse_key: "2:1",
    text_uthmani: "الٓمٓ",
    verse_number: 1,
    words: [],
    translations: [
      {
        id: 1,
        text: "Alif Lam Mim.",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 2,
    verse_key: "2:2",
    text_uthmani: "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
    verse_number: 2,
    words: [],
    translations: [
      {
        id: 2,
        text: "This is the Book! There is no doubt about it—a guide for those mindful ˹of Allah˺,",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 3,
    verse_key: "2:3",
    text_uthmani: "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَـٰهُمْ يُنفِقُونَ",
    verse_number: 3,
    words: [],
    translations: [
      {
        id: 3,
        text: "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 4,
    verse_key: "2:4",
    text_uthmani: "وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْـَٔاخِرَةِ هُمْ يُوقِنُونَ",
    verse_number: 4,
    words: [],
    translations: [
      {
        id: 4,
        text: "and who believe in what has been revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 5,
    verse_key: "2:5",
    text_uthmani: "أُو۟لَـٰٓئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُو۟لَـٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ",
    verse_number: 5,
    words: [],
    translations: [
      {
        id: 5,
        text: "It is they who are ˹truly˺ guided by their Lord, and it is they who will be successful.",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 6,
    verse_key: "2:6",
    text_uthmani: "إِنَّ ٱلَّذِينَ كَفَرُوا۟ سَوَآءٌ عَلَيْهِمْ ءَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ",
    verse_number: 6,
    words: [],
    translations: [
      {
        id: 6,
        text: "As for the disbelievers, it is the same whether you warn them or not—they will never believe.",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 7,
    verse_key: "2:7",
    text_uthmani: "خَتَمَ ٱللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰٓ أَبْصَـٰرِهِمْ غِشَـٰوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ",
    verse_number: 7,
    words: [],
    translations: [
      {
        id: 7,
        text: "Allah has sealed their hearts and their hearing, and their sight is covered. They will suffer a tremendous punishment.",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 8,
    verse_key: "2:8",
    text_uthmani: "وَمِنَ ٱلنَّاسِ مَن يَقُولُ ءَامَنَّا بِٱللَّهِ وَبِٱلْيَوْمِ ٱلْـَٔاخِرِ وَمَا هُم بِمُؤْمِنِينَ",
    verse_number: 8,
    words: [],
    translations: [
      {
        id: 8,
        text: 'And there are some who say, "We believe in Allah and the Last Day," yet they are not ˹true˺ believers.',
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 9,
    verse_key: "2:9",
    text_uthmani: "يُخَـٰدِعُونَ ٱللَّهَ وَٱلَّذِينَ ءَامَنُوا۟ وَمَا يَخْدَعُونَ إِلَّآ أَنفُسَهُمْ وَمَا يَشْعُرُونَ",
    verse_number: 9,
    words: [],
    translations: [
      {
        id: 9,
        text: "They seek to deceive Allah and the believers, yet they only deceive themselves, but they fail to perceive it.",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
  {
    id: 10,
    verse_key: "2:10",
    text_uthmani: "فِى قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ ٱللَّهُ مَرَضًا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌۢ بِمَا كَانُوا۟ يَكْذِبُونَ",
    verse_number: 10,
    words: [],
    translations: [
      {
        id: 10,
        text: "There is a disease in their hearts, and Allah ˹only˺ lets their disease increase. They will suffer a painful punishment for their lies.",
        resource_id: 131,
        resource_name: "Dr. Mustafa Khattab, the Clear Quran",
      },
    ],
  },
]

// API functions with enhanced error handling and fallbacks
export async function getChapters(language = "en"): Promise<Chapter[]> {
  try {
    // Try primary API first
    const response = await fetch(`${QURAN_API_BASE}/chapters?language=${language}`)
    if (!response.ok) throw new Error(`Failed to fetch chapters: ${response.status} ${response.statusText}`)
    const data: ChaptersResponse = await response.json()
    return data.chapters
  } catch (primaryError) {
    console.error("Error fetching chapters from primary API:", primaryError)

    try {
      // Try backup API
      const backupResponse = await fetch(`${ALQURAN_API_BASE}/surah`)
      if (!backupResponse.ok) throw new Error(`Backup API failed: ${backupResponse.status}`)
      const backupData = await backupResponse.json()

      if (backupData.code === 200 && Array.isArray(backupData.data)) {
        // Transform the backup API data to match our interface
        return backupData.data.map((surah: any) => ({
          id: surah.number,
          revelation_place: surah.revelationType.toLowerCase(),
          revelation_order: surah.number,
          bismillah_pre: true,
          name_simple: surah.englishName,
          name_arabic: surah.name,
          name_complex: surah.englishNameTranslation,
          verses_count: surah.numberOfAyahs,
          pages: [1, 1], // Placeholder
          translated_name: {
            language_name: "english",
            name: surah.englishNameTranslation,
          },
        }))
      }
      throw new Error("Invalid data from backup API")
    } catch (backupError) {
      console.error("Error fetching from backup API:", backupError)
      // Return fallback data as last resort
      return fallbackChapters
    }
  }
}

// Now update the getChapterVerses function to include special handling for Surah 2

// Replace this part:
export async function getChapterVerses(
  chapterNumber: number,
  page = 1,
  perPage = 10,
  language = "en",
): Promise<VersesResponse> {
  // Special case for Al-Fatihah (Surah 1) which has only 7 verses
  if (chapterNumber === 1) {
    console.log("Using fallback for Al-Fatihah")
    return {
      verses: fallbackFatihaVerses,
      meta: {
        current_page: 1,
        next_page: null,
        prev_page: null,
        total_pages: 1,
        total_count: 7,
      },
    }
  }

  // Special case for Al-Baqarah (Surah 2) - first page
  if (chapterNumber === 2 && page === 1) {
    console.log("Using fallback for Al-Baqarah (first page)")
    return {
      verses: fallbackBaqarahVerses,
      meta: {
        current_page: 1,
        next_page: 2,
        prev_page: null,
        total_pages: 29, // Al-Baqarah has 286 verses, so with 10 per page that's 29 pages
        total_count: 286,
      },
    }
  }

  try {
    // Try primary API with corrected endpoint
    console.log(`Fetching verses for chapter ${chapterNumber}, page ${page}, perPage ${perPage}`)

    // Use a more reliable endpoint structure
    const url = `${QURAN_API_BASE}/verses/by_chapter/${chapterNumber}?page=${page}&per_page=${perPage}&language=${language}&words=false&translations=131`
    console.log("API URL:", url)

    const response = await fetch(url)

    if (!response.ok) {
      console.error(`API response status: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to fetch verses: ${response.status} ${response.statusText}`)
    }

    const data: VersesResponse = await response.json()
    console.log(`Successfully fetched ${data.verses.length} verses`)
    return data
  } catch (primaryError) {
    console.error("Error fetching verses from primary API:", primaryError)

    try {
      // Try backup API
      console.log("Trying backup API...")
      const backupResponse = await fetch(`${ALQURAN_API_BASE}/surah/${chapterNumber}`)
      if (!backupResponse.ok) throw new Error(`Backup API failed: ${backupResponse.status}`)
      const backupData = await backupResponse.json()

      if (backupData.code === 200 && backupData.data && Array.isArray(backupData.data.ayahs)) {
        console.log("Successfully fetched from backup API")
        // Calculate pagination
        const allVerses = backupData.data.ayahs
        const startIdx = (page - 1) * perPage
        const endIdx = Math.min(startIdx + perPage, allVerses.length)
        const paginatedVerses = allVerses.slice(startIdx, endIdx)

        // Transform to match our interface
        const verses = paginatedVerses.map((ayah: any, index: number) => ({
          id: startIdx + index + 1,
          verse_key: `${chapterNumber}:${ayah.numberInSurah}`,
          text_uthmani: ayah.text,
          verse_number: ayah.numberInSurah,
          words: [],
          translations: [
            {
              id: 1,
              text: ayah.text, // No translation in backup API, use original text
              resource_id: 1,
              resource_name: "Default",
            },
          ],
        }))

        try {
          return {
            verses,
            meta: {
              current_page: page,
              next_page: endIdx < allVerses.length ? page + 1 : null,
              prev_page: page > 1 ? page - 1 : null,
              total_pages: Math.ceil(allVerses.length / perPage),
              total_count: allVerses.length,
            },
          }
        } catch (error) {
          console.error("Error creating response object:", error)
          // Return a valid response structure even if something goes wrong
          return {
            verses: verses || [],
            meta: {
              current_page: page,
              next_page: null,
              prev_page: page > 1 ? page - 1 : null,
              total_pages: 1,
              total_count: verses ? verses.length : 0,
            },
          }
        }
      }
      throw new Error("Invalid data from backup API")
    } catch (backupError) {
      console.error("Error fetching from backup API:", backupError)

      // For Surah 1 (Al-Fatihah), use our fallback data
      if (chapterNumber === 1) {
        console.log("Using fallback for Al-Fatihah after API failures")
        return {
          verses: fallbackFatihaVerses,
          meta: {
            current_page: 1,
            next_page: null,
            prev_page: null,
            total_pages: 1,
            total_count: 7,
          },
        }
      }

      // Return empty result with pagination info for other surahs
      return {
        verses: [],
        meta: {
          current_page: page,
          next_page: null,
          prev_page: page > 1 ? page - 1 : null,
          total_pages: 1,
          total_count: 0,
        },
      }
    }
  }
}

export async function getReciters(): Promise<Reciter[]> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/resources/recitations`)
    if (!response.ok) throw new Error(`Failed to fetch reciters: ${response.status} ${response.statusText}`)
    const data: RecitersResponse = await response.json()
    return data.reciters
  } catch (error) {
    console.error("Error fetching reciters:", error)
    // Return fallback reciters
    return [
      { id: 7, reciter_name: "Mishary Rashid Alafasy", style: "murattal" },
      { id: 1, reciter_name: "Abdul Basit Abdul Samad", style: "murattal" },
      { id: 3, reciter_name: "Abdul Rahman Al-Sudais", style: "murattal" },
      { id: 4, reciter_name: "Abu Bakr al-Shatri", style: "murattal" },
    ]
  }
}

export async function getChapterRecitation(reciterId: number, chapterNumber: number): Promise<string> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/chapter_recitations/${reciterId}/${chapterNumber}`)
    if (!response.ok) throw new Error(`Failed to fetch recitation: ${response.status} ${response.statusText}`)
    const data = await response.json()
    return data.audio_file.audio_url
  } catch (primaryError) {
    console.error("Error fetching recitation:", primaryError)

    try {
      // Try backup API - using alquran.cloud API with Mishary Rashid Alafasy (1)
      const backupReciterId = 1 // Default to Mishary Rashid Alafasy in backup API
      const backupResponse = await fetch(`${ALQURAN_API_BASE}/surah/${chapterNumber}/ar.alafasy`)
      if (!backupResponse.ok) throw new Error(`Backup API failed: ${backupResponse.status}`)

      // This API doesn't provide direct audio URLs for full surahs, so we'll use a fallback
      return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${chapterNumber}.mp3`
    } catch (backupError) {
      console.error("Error fetching from backup API:", backupError)
      return ""
    }
  }
}

export async function getVerseRecitation(reciterId: number, verseKey: string): Promise<string> {
  try {
    const response = await fetch(`${QURAN_API_BASE}/recitations/${reciterId}/by_ayah/${verseKey}`)
    if (!response.ok) throw new Error(`Failed to fetch verse recitation: ${response.status} ${response.statusText}`)
    const data = await response.json()

    // Check the structure of the response and handle it accordingly
    if (data.audio_files && data.audio_files.length > 0) {
      return data.audio_files[0].url || ""
    } else if (data.audio_file && data.audio_file.url) {
      return data.audio_file.url
    } else {
      console.warn("Unexpected API response structure:", data)
      // Fallback to any URL we can find in the response
      if (data.url) return data.url
      if (data.audio_url) return data.audio_url
      throw new Error("Could not find audio URL in response")
    }
  } catch (primaryError) {
    console.error("Error fetching verse recitation:", primaryError)

    try {
      // Try backup API - using alquran.cloud API with Mishary Rashid Alafasy
      const [surahNumber, verseNumber] = verseKey.split(":").map(Number)

      // Construct URL for individual verse audio
      return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verseKey.replace(":", "_")}.mp3`
    } catch (backupError) {
      console.error("Error with backup audio URL:", backupError)
      return ""
    }
  }
}

export async function searchQuran(query: string, size = 20, language = "en"): Promise<SearchResponse> {
  try {
    const response = await fetch(
      `${QURAN_API_BASE}/search?q=${encodeURIComponent(query)}&size=${size}&language=${language}`,
    )
    if (!response.ok) throw new Error(`Failed to search: ${response.status} ${response.statusText}`)
    const data: SearchResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error searching:", error)
    // Return empty search results
    return { search: { query, total_results: 0, results: [] } }
  }
}

export async function getRandomVerse(language = "en"): Promise<Verse | null> {
  try {
    // Generate random chapter (1-114) and verse
    const randomChapter = Math.floor(Math.random() * 114) + 1

    // First get the chapter to know how many verses it has
    const chapters = await getChapters(language)
    const chapter = chapters.find((c) => c.id === randomChapter)

    if (!chapter) return null

    const randomVerse = Math.floor(Math.random() * chapter.verses_count) + 1

    const response = await fetch(
      `${QURAN_API_BASE}/verses/by_key/${randomChapter}:${randomVerse}?language=${language}&words=true&translations=131`,
    )
    if (!response.ok) throw new Error(`Failed to fetch random verse: ${response.status} ${response.statusText}`)
    const data = await response.json()
    return data.verse
  } catch (primaryError) {
    console.error("Error fetching random verse:", primaryError)

    try {
      // Try backup API
      const randomChapter = Math.floor(Math.random() * 114) + 1
      const backupResponse = await fetch(`${ALQURAN_API_BASE}/surah/${randomChapter}`)
      if (!backupResponse.ok) throw new Error(`Backup API failed: ${backupResponse.status}`)

      const backupData = await backupResponse.json()
      if (backupData.code === 200 && backupData.data && Array.isArray(backupData.data.ayahs)) {
        const ayahs = backupData.data.ayahs
        const randomIndex = Math.floor(Math.random() * ayahs.length)
        const randomAyah = ayahs[randomIndex]

        // Transform to match our interface
        return {
          id: randomIndex + 1,
          verse_key: `${randomChapter}:${randomAyah.numberInSurah}`,
          text_uthmani: randomAyah.text,
          verse_number: randomAyah.numberInSurah,
          words: [],
          translations: [
            {
              id: 1,
              text: randomAyah.text, // No translation in backup API
              resource_id: 1,
              resource_name: "Default",
            },
          ],
        }
      }
      throw new Error("Invalid data from backup API")
    } catch (backupError) {
      console.error("Error with backup random verse:", backupError)
      return null
    }
  }
}

export async function getPrayerTimes(city: string, country: string): Promise<PrayerTimes | null> {
  try {
    const response = await fetch(
      `${ALADHAN_API_BASE}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`,
    )
    if (!response.ok) throw new Error(`Failed to fetch prayer times: ${response.status} ${response.statusText}`)
    const data: PrayerTimesResponse = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching prayer times:", error)

    // Return fallback prayer times
    const now = new Date()
    const Day = now.getDate().toString()
    const Last = now.toLocaleDateString("en-US", { weekday: "long" })
    return {
      timings: {
        Fajr: "05:30",
        Sunrise: "06:45",
        Dhuhr: "12:15",
        Asr: "15:30",
        Sunset: "18:00",
        Maghrib: "18:15",
        Isha: "19:30",
        Imsak: "05:20",
        Midnight: "00:00",
        Firstthird: "22:00",
        Lastthird: "02:00",
      },
      date: {
        readable: now.toDateString(),
        timestamp: now.getTime().toString(),
        hijri: {
          date: "01-01-1445",
          month: {
            number: 1,
            en: "Muharram",
            ar: "محرم",
          },
          year: "1445",
          designation: {
            abbreviated: "AH",
            expanded: "Anno Hegirae",
          },
          holidays: [],
        },
        gregorian: {
          date: now.toISOString().split("T")[0],
          format: "DD-MM-YYYY",
          day: Day,
          weekday: {
            en: Last,
          },
          month: {
            number: now.getMonth() + 1,
            en: now.toLocaleDateString("en-US", { month: "long" }),
          },
          year: now.getFullYear().toString(),
          designation: {
            abbreviated: "AD",
            expanded: "Anno Domini",
          },
        },
      },
    }
  }
}

// Function to get Tafsir (commentary) for a verse
export async function getTafsir(verseKey: string, language = "en"): Promise<string> {
  try {
    // Try the primary tafsir endpoint
    const response = await fetch(`${QURAN_API_BASE}/tafsirs/en-tafisr-ibn-kathir?verse_key=${verseKey}`)

    if (!response.ok) {
      console.warn(`Primary tafsir API failed with status ${response.status} for verse ${verseKey}`)
      // Try alternative tafsir endpoint
      const altResponse = await fetch(`${QURAN_API_BASE}/tafsirs/169?verse_key=${verseKey}`)

      if (!altResponse.ok) {
        throw new Error(`Failed to fetch tafsir: ${altResponse.status}`)
      }

      const altData = await altResponse.json()
      if (altData.tafsirs && altData.tafsirs.length > 0) {
        return altData.tafsirs[0].text
      }
      throw new Error("No tafsir content in response")
    }

    const data = await response.json()
    if (data.tafsirs && data.tafsirs.length > 0) {
      return data.tafsirs[0].text
    }

    // If we get here, the API returned OK but no tafsir content
    return getFallbackTafsir(verseKey)
  } catch (error) {
    console.error("Error fetching tafsir:", error)
    return getFallbackTafsir(verseKey)
  }
}

// Add this helper function for fallback tafsir content
function getFallbackTafsir(verseKey: string): string {
  // Extract surah and verse numbers
  const [surahNum, verseNum] = verseKey.split(":").map(Number)

  // Fallback tafsir for Al-Fatihah (Surah 1)
  if (surahNum === 1) {
    const fatihaTafsir: Record<number, string> = {
      1: "<p>This verse is known as the Basmalah and serves as an opening to all chapters of the Quran except for Surah At-Tawbah. It emphasizes beginning all actions with the name of Allah, acknowledging His mercy and compassion.</p>",
      2: "<p>This verse praises Allah as the Lord of all worlds, acknowledging His sovereignty over all creation. Ibn Kathir explains that 'Al-Hamd' means praise accompanied with love and glorification, and 'Rabb' signifies that Allah is the Creator, Provider, and Sustainer of all existence.</p>",
      3: "<p>This verse emphasizes Allah's attributes of mercy. 'Ar-Rahman' refers to the general mercy that encompasses all creation, while 'Ar-Raheem' refers to the special mercy reserved for believers.</p>",
      4: "<p>This verse acknowledges Allah's absolute authority on the Day of Judgment. Ibn Kathir notes that while Allah is the Master of all days, the Day of Judgment is specifically mentioned because on that day, no one will claim any authority except Allah.</p>",
      5: "<p>This verse represents the essence of worship in Islam - dedicating worship exclusively to Allah and seeking help only from Him. It establishes the relationship between the servant and Allah, emphasizing complete dependence on Him.</p>",
      6: "<p>This verse is a supplication for guidance to the Straight Path, which represents the true religion of Islam. Ibn Kathir explains that this guidance includes both being shown the path and being helped to follow it.</p>",
      7: "<p>This verse clarifies the Straight Path as the way of those whom Allah has blessed - the prophets, the truthful, the martyrs, and the righteous. It also warns against following the paths of those who earned Allah's anger by knowing the truth but not following it, or those who went astray by following without proper knowledge.</p>",
    }

    return fatihaTafsir[verseNum] || "<p>Tafsir for this verse is currently unavailable. Please try again later.</p>"
  }

  // Generic fallback message for other surahs
  return "<p>The tafsir (commentary) for this verse is currently unavailable from our sources. Please try again later or refer to other Islamic resources for explanation of this verse.</p>"
}

import { getLanguage as getLanguageFromStorage } from "./language"

export const getLanguage = getLanguageFromStorage
