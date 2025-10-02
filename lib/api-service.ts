// Al-Quran Cloud API integration
const ALQURAN_API_BASE = "https://api.alquran.cloud/v1"
const QURAN_COM_API_BASE = "https://api.quran.com/api/v4"
const QURANENC_API_BASE = "https://quranenc.com/api/v1"
const MP3QURAN_BASE = "https://server8.mp3quran.net/afs"
const EVERYAYAH_BASE = "https://everyayah.com/data/Alafasy_128kbps"

// Types for API responses
export interface ApiResponse<T> {
  code: number
  status: string
  data: T
}

export interface Chapter {
  id: number
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
  // Additional fields for UI
  name_simple?: string
  name_arabic?: string
  name_complex?: string
  revelation_place?: string
  revelation_order?: number
  verses_count?: number
  translated_name?: {
    language_name: string
    name: string
  }
}

export interface Verse {
  number: number
  text: string
  numberInSurah: number
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda:
    | boolean
    | {
        id: number
        recommended: boolean
        obligatory: boolean
      }
  // Additional fields for UI
  id?: number
  verse_key?: string
  verse_number?: number
  text_uthmani?: string
  words?: any[]
  translations?: {
    id: number
    text: string
    resource_id: number
    resource_name: string
  }[]
  audio?: {
    url: string
  }
}

export interface TamilVerse {
  id: number
  sura: number
  aya: number
  arabic_text: string
  translation: string
  footnotes: string
}

export interface TamilSuraResponse {
  result: TamilVerse[]
}

export interface Edition {
  identifier: string
  language: string
  name: string
  englishName: string
  format: string
  type: string
  direction?: string
}

export interface SearchResult {
  surah: number
  verse: number
  text: string
  edition: Edition
  matches?: string[]
  // Additional fields for UI
  verse_key?: string
  translations?: {
    text: string
  }[]
  highlighted?: {
    text: string
  }
}

export interface Reciter {
  id: number
  name: string
  reciter_name?: string
  style?: string
}

// Cache management
const CACHE_PREFIX = "quran_app_"
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

interface CacheItem<T> {
  data: T
  timestamp: number
}

function getFromCache<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(`${CACHE_PREFIX}${key}`)
    if (!item) return null

    const cacheItem: CacheItem<T> = JSON.parse(item)
    const now = Date.now()

    // Check if cache is expired
    if (now - cacheItem.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`)
      return null
    }

    return cacheItem.data
  } catch (error) {
    console.error("Error retrieving from cache:", error)
    return null
  }
}

function saveToCache<T>(key: string, data: T): void {
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem))
  } catch (error) {
    console.error("Error saving to cache:", error)
  }
}

function clearCache(): void {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error("Error clearing cache:", error)
  }
}

// API functions with caching and fallback mechanisms
export async function getChapters(language = "en"): Promise<Chapter[]> {
  const cacheKey = `chapters_${language}`
  const cachedData = getFromCache<Chapter[]>(cacheKey)

  if (cachedData) {
    console.log("Using cached chapters data")
    return cachedData
  }

  try {
    // Try Al-Quran Cloud API first
    console.log("Fetching chapters from Al-Quran Cloud API")
    const response = await fetch(`${ALQURAN_API_BASE}/surah`)

    if (!response.ok) {
      throw new Error(`Failed to fetch chapters: ${response.status} ${response.statusText}`)
    }

    const data: ApiResponse<Chapter[]> = await response.json()

    if (data.code === 200 && Array.isArray(data.data)) {
      // Transform to match our interface
      const chapters = data.data.map((chapter) => ({
        ...chapter,
        id: chapter.number,
        name_simple: chapter.englishName,
        name_arabic: chapter.name,
        name_complex: chapter.englishNameTranslation,
        revelation_place: chapter.revelationType.toLowerCase(),
        revelation_order: chapter.number,
        verses_count: chapter.numberOfAyahs,
        translated_name: {
          language_name: "english",
          name: chapter.englishNameTranslation,
        },
      }))

      // Save to cache
      saveToCache(cacheKey, chapters)
      return chapters
    }

    throw new Error("Invalid data from Al-Quran Cloud API")
  } catch (primaryError) {
    console.error("Error fetching chapters from Al-Quran Cloud API:", primaryError)

    try {
      // Fallback to Quran.com API
      console.log("Falling back to Quran.com API")
      const fallbackResponse = await fetch(`${QURAN_COM_API_BASE}/chapters?language=${language}`)

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API failed: ${fallbackResponse.status}`)
      }

      const fallbackData = await fallbackResponse.json()

      if (fallbackData.chapters && Array.isArray(fallbackData.chapters)) {
        // Save to cache
        saveToCache(cacheKey, fallbackData.chapters)
        return fallbackData.chapters
      }

      throw new Error("Invalid data from fallback API")
    } catch (fallbackError) {
      console.error("Error fetching from fallback API:", fallbackError)

      // Return empty array as last resort
      return []
    }
  }
}

// Function to get Tamil translation using the specified API
export async function getTamilTranslation(chapterNumber: number): Promise<Verse[]> {
  const cacheKey = `tamil_translation_${chapterNumber}`
  const cachedData = getFromCache<Verse[]>(cacheKey)

  if (cachedData) {
    console.log("Using cached Tamil translation data")
    return cachedData
  }

  try {
    console.log(`Fetching Tamil translation for chapter ${chapterNumber}`)
    const response = await fetch(`${QURANENC_API_BASE}/translation/sura/tamil_omar/${chapterNumber}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch Tamil translation: ${response.status} ${response.statusText}`)
    }

    const data: TamilSuraResponse = await response.json()

    if (data.result && Array.isArray(data.result)) {
      // Transform to match our Verse interface
      const verses = data.result.map((verse) => ({
        id: verse.id,
        number: verse.id,
        verse_key: `${chapterNumber}:${verse.aya}`,
        verse_number: verse.aya,
        numberInSurah: verse.aya,
        text: verse.arabic_text,
        text_uthmani: verse.arabic_text,
        juz: 0,
        manzil: 0,
        page: 0,
        ruku: 0,
        hizbQuarter: 0,
        sajda: false,
        translations: [
          {
            id: 1,
            text: verse.translation,
            resource_id: 1,
            resource_name: "Tamil Omar",
          },
        ],
      }))

      // Save to cache
      saveToCache(cacheKey, verses)
      return verses
    }

    throw new Error("Invalid data from Tamil translation API")
  } catch (error) {
    console.error("Error fetching Tamil translation:", error)
    return [] // Return empty array on error
  }
}

export async function getChapterVerses(
  chapterNumber: number,
  page = 1,
  perPage = 10,
  language = "en",
): Promise<{
  verses: Verse[]
  meta: {
    current_page: number
    next_page: number | null
    prev_page: number | null
    total_pages: number
    total_count: number
  }
}> {
  // Special handling for Tamil language
  if (language === "ta") {
    try {
      const tamilVerses = await getTamilTranslation(chapterNumber)

      // Calculate pagination
      const startIdx = (page - 1) * perPage
      const endIdx = Math.min(startIdx + perPage, tamilVerses.length)
      const paginatedVerses = tamilVerses.slice(startIdx, endIdx)

      return {
        verses: paginatedVerses,
        meta: {
          current_page: page,
          next_page: endIdx < tamilVerses.length ? page + 1 : null,
          prev_page: page > 1 ? page - 1 : null,
          total_pages: Math.ceil(tamilVerses.length / perPage),
          total_count: tamilVerses.length,
        },
      }
    } catch (tamilError) {
      console.error("Error with Tamil translation, falling back to standard method:", tamilError)
      // Continue with standard method if Tamil API fails
    }
  }

  const cacheKey = `verses_${chapterNumber}_${page}_${perPage}_${language}`
  const cachedData = getFromCache<{
    verses: Verse[]
    meta: {
      current_page: number
      next_page: number | null
      prev_page: number | null
      total_pages: number
      total_count: number
    }
  }>(cacheKey)

  if (cachedData) {
    console.log("Using cached verses data")
    return cachedData
  }

  try {
    // Try Al-Quran Cloud API first
    console.log(`Fetching verses for chapter ${chapterNumber} from Al-Quran Cloud API`)

    // Get Arabic text
    const arabicResponse = await fetch(`${ALQURAN_API_BASE}/surah/${chapterNumber}`)

    if (!arabicResponse.ok) {
      throw new Error(`Failed to fetch Arabic verses: ${arabicResponse.status} ${arabicResponse.statusText}`)
    }

    const arabicData: ApiResponse<{
      ayahs: Verse[]
      number: number
      name: string
      englishName: string
      englishNameTranslation: string
    }> = await arabicResponse.json()

    // Get translation based on language
    let translationIdentifier = "en.sahih" // Default to English Sahih International

    if (language === "ur") {
      translationIdentifier = "ur.ahmedali"
    } else if (language === "fr") {
      translationIdentifier = "fr.hamidullah"
    } else if (language === "es") {
      translationIdentifier = "es.asad"
    } else if (language === "id") {
      translationIdentifier = "id.indonesian"
    } else if (language === "tr") {
      translationIdentifier = "tr.ates"
    }

    const translationResponse = await fetch(`${ALQURAN_API_BASE}/surah/${chapterNumber}/${translationIdentifier}`)

    if (!translationResponse.ok) {
      throw new Error(`Failed to fetch translation: ${translationResponse.status} ${translationResponse.statusText}`)
    }

    const translationData: ApiResponse<{ ayahs: Verse[] }> = await translationResponse.json()

    // Combine Arabic with translations
    if (arabicData.code === 200 && translationData.code === 200) {
      const allVerses = arabicData.data.ayahs.map((verse, index) => {
        const translation = translationData.data.ayahs[index]

        return {
          ...verse,
          id: verse.number,
          verse_key: `${chapterNumber}:${verse.numberInSurah}`,
          verse_number: verse.numberInSurah,
          text_uthmani: verse.text,
          translations: translation?.text
            ? [
                {
                  id: 1,
                  text: translation.text,
                  resource_id: 1,
                  resource_name: language === "ta" ? "Tamil" : "English",
                },
              ]
            : [], // Set to empty array if no translation text
        }
      })

      // Calculate pagination
      const startIdx = (page - 1) * perPage
      const endIdx = Math.min(startIdx + perPage, allVerses.length)
      const paginatedVerses = allVerses.slice(startIdx, endIdx)

      const result = {
        verses: paginatedVerses,
        meta: {
          current_page: page,
          next_page: endIdx < allVerses.length ? page + 1 : null,
          prev_page: page > 1 ? page - 1 : null,
          total_pages: Math.ceil(allVerses.length / perPage),
          total_count: allVerses.length,
        },
      }

      // Save to cache
      saveToCache(cacheKey, result)
      return result
    }

    throw new Error("Invalid data from Al-Quran Cloud API")
  } catch (primaryError) {
    console.error("Error fetching verses from Al-Quran Cloud API:", primaryError)

    try {
      // Fallback to Quran.com API
      console.log("Falling back to Quran.com API")
      const url = `${QURAN_COM_API_BASE}/verses/by_chapter/${chapterNumber}?page=${page}&per_page=${perPage}&language=${language}&words=false&translations=131`

      const fallbackResponse = await fetch(url)

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API failed: ${fallbackResponse.status}`)
      }

      const fallbackData = await fallbackResponse.json()

      if (fallbackData.verses) {
        // Save to cache
        saveToCache(cacheKey, fallbackData)
        return fallbackData
      }

      throw new Error("Invalid data from fallback API")
    } catch (fallbackError) {
      console.error("Error fetching from fallback API:", fallbackError)

      // Return empty result as last resort
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

export async function searchQuran(
  query: string,
  size = 20,
  language = "en",
): Promise<{
  search: {
    query: string
    total_results: number
    results: SearchResult[]
  }
}> {
  const cacheKey = `search_${query}_${size}_${language}`
  const cachedData = getFromCache<{
    search: {
      query: string
      total_results: number
      results: SearchResult[]
    }
  }>(cacheKey)

  if (cachedData) {
    console.log("Using cached search results")
    return cachedData
  }

  try {
    // Determine which edition to search in based on language
    let edition = "en.sahih" // Default to English Sahih International

    if (language === "ar") {
      edition = "quran-simple"
    } else if (language === "ur") {
      edition = "ur.ahmedali"
    } else if (language === "fr") {
      edition = "fr.hamidullah"
    } else if (language === "es") {
      edition = "es.asad"
    } else if (language === "id") {
      edition = "id.indonesian"
    } else if (language === "tr") {
      edition = "tr.ates"
    } else if (language === "ta") {
      edition = "en.sahih" // Fallback to English for Tamil since direct API doesn't exist
    }

    console.log(`Searching Quran for "${query}" in ${edition}`)

    // FIXED: Correct URL format for Al-Quran Cloud API search
    const response = await fetch(`${ALQURAN_API_BASE}/search/${edition}/${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error(`Failed to search: ${response.status} ${response.statusText}`)
    }

    const data: ApiResponse<{ count: number; matches: SearchResult[] }> = await response.json()

    if (data.code === 200) {
      // Transform to match our interface
      const results = data.data.matches.slice(0, size).map((match) => ({
        ...match,
        verse_key: `${match.surah}:${match.verse}`,
        translations: match.text
          ? [
              {
                text: match.text,
              },
            ]
          : [],
        highlighted: {
          text: match.text,
        },
      }))

      const result = {
        search: {
          query,
          total_results: data.data.count,
          results,
        },
      }

      // Save to cache
      saveToCache(cacheKey, result)
      return result
    }

    throw new Error("Invalid data from Al-Quran Cloud API")
  } catch (primaryError) {
    console.error("Error searching from Al-Quran Cloud API:", primaryError)

    try {
      // Fallback to Quran.com API
      console.log("Falling back to Quran.com API")
      const fallbackResponse = await fetch(
        `${QURAN_COM_API_BASE}/search?q=${encodeURIComponent(query)}&size=${size}&language=${language}`,
      )

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API failed: ${fallbackResponse.status}`)
      }

      const fallbackData = await fallbackResponse.json()

      if (fallbackData.search) {
        // Save to cache
        saveToCache(cacheKey, fallbackData)
        return fallbackData
      }

      throw new Error("Invalid data from fallback API")
    } catch (fallbackError) {
      console.error("Error searching from fallback API:", fallbackError)

      // Return mock data as a last resort
      return {
        search: {
          query,
          total_results: 1,
          results: [
            {
              surah: 1,
              verse: 1,
              text: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
              edition: {
                identifier: "en.sahih",
                language: "en",
                name: "Sahih International",
                englishName: "Sahih International",
                format: "text",
                type: "translation",
              },
              verse_key: "1:1",
              translations: [
                {
                  text: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
                },
              ],
              highlighted: {
                text: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
              },
            },
          ],
        },
      }
    }
  }
}

// Add this function to the api-service.ts file

export async function searchQuranAdvanced(
  query: string,
  size = 20,
  language = "en",
): Promise<{
  search: {
    query: string
    total_results: number
    results: SearchResult[]
  }
}> {
  const cacheKey = `advanced_search_${query}_${size}_${language}`
  const cachedData = getFromCache<{
    search: {
      query: string
      total_results: number
      results: SearchResult[]
    }
  }>(cacheKey)

  if (cachedData) {
    console.log("Using cached advanced search results")
    return cachedData
  }

  try {
    // Check if query is a specific keyword that needs special handling
    const specialKeywords = {
      mercy: ["mercy", "merciful", "compassion", "rahman", "raheem", "compassionate"],
      patience: ["patience", "patient", "sabr", "perseverance", "endurance"],
      forgiveness: ["forgive", "forgiveness", "pardon", "mercy", "repentance"],
    }

    let searchTerms = [query]

    // If it's a special keyword, search for all related terms
    for (const [key, terms] of Object.entries(specialKeywords)) {
      if (terms.includes(query.toLowerCase())) {
        searchTerms = terms
        break
      }
    }

    // Perform searches for all terms and combine results
    const allResults: SearchResult[] = []
    let totalResults = 0

    for (const term of searchTerms) {
      try {
        // Determine which edition to search in based on language
        let edition = "en.sahih" // Default to English Sahih International

        if (language === "ar") {
          edition = "quran-simple"
        } else if (language === "ur") {
          edition = "ur.ahmedali"
        } else if (language === "fr") {
          edition = "fr.hamidullah"
        } else if (language === "es") {
          edition = "es.asad"
        } else if (language === "id") {
          edition = "id.indonesian"
        } else if (language === "tr") {
          edition = "tr.ates"
        } else if (language === "ta") {
          edition = "en.sahih" // Fallback to English for Tamil since direct API doesn't exist
        }

        console.log(`Searching Quran for "${term}" in ${edition}`)
        const response = await fetch(`${ALQURAN_API_BASE}/search/${encodeURIComponent(term)}/all/${edition}`)

        if (!response.ok) {
          throw new Error(`Failed to search: ${response.status} ${response.statusText}`)
        }

        const data: ApiResponse<{ count: number; matches: SearchResult[] }> = await response.json()

        if (data.code === 200) {
          // Add unique results to our collection
          data.data.matches.forEach((match) => {
            const verseKey = `${match.surah}:${match.verse}`
            if (!allResults.some((r) => `${r.surah}:${r.verse}` === verseKey)) {
              allResults.push({
                ...match,
                verse_key: verseKey,
                translations: match.text
                  ? [
                      {
                        text: match.text,
                      },
                    ]
                  : [],
                highlighted: {
                  text: match.text,
                },
              })
            }
          })

          totalResults += data.data.count
        }
      } catch (error) {
        console.error(`Error searching for term "${term}":`, error)
        // Continue with other terms even if one fails
      }
    }

    // Sort results by surah and verse number
    allResults.sort((a, b) => {
      if (a.surah !== b.surah) {
        return a.surah - b.surah
      }
      return a.verse - b.verse
    })

    // Limit to requested size
    const limitedResults = allResults.slice(0, size)

    const result = {
      search: {
        query,
        total_results: totalResults,
        results: limitedResults,
      },
    }

    // Save to cache
    saveToCache(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error with advanced search:", error)

    // Fallback to regular search
    try {
      return await searchQuran(query, size, language)
    } catch (fallbackError) {
      console.error("Error with fallback search:", fallbackError)

      // Return empty search results as last resort
      return { search: { query, total_results: 0, results: [] } }
    }
  }
}

export async function getReciters(): Promise<Reciter[]> {
  const cacheKey = "reciters"
  const cachedData = getFromCache<Reciter[]>(cacheKey)

  if (cachedData) {
    console.log("Using cached reciters data")
    return cachedData
  }

  try {
    console.log("Fetching reciters from Al-Quran Cloud API")
    const response = await fetch(`${ALQURAN_API_BASE}/edition/format/audio`)

    if (!response.ok) {
      throw new Error(`Failed to fetch reciters: ${response.status} ${response.statusText}`)
    }

    const data: ApiResponse<Edition[]> = await response.json()

    if (data.code === 200 && Array.isArray(data.data)) {
      // Transform to match our interface
      const reciters = data.data.map((edition, index) => ({
        id: index + 1,
        name: edition.englishName,
        reciter_name: edition.englishName,
        style: edition.type,
        identifier: edition.identifier,
      }))

      // Save to cache
      saveToCache(cacheKey, reciters)
      return reciters
    }

    throw new Error("Invalid data from Al-Quran Cloud API")
  } catch (primaryError) {
    console.error("Error fetching reciters from Al-Quran Cloud API:", primaryError)

    try {
      // Fallback to Quran.com API
      console.log("Falling back to Quran.com API")
      const fallbackResponse = await fetch(`${QURAN_COM_API_BASE}/resources/recitations`)

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API failed: ${fallbackResponse.status}`)
      }

      const fallbackData = await fallbackResponse.json()

      if (fallbackData.reciters && Array.isArray(fallbackData.reciters)) {
        // Save to cache
        saveToCache(cacheKey, fallbackData.reciters)
        return fallbackData.reciters
      }

      throw new Error("Invalid data from fallback API")
    } catch (fallbackError) {
      console.error("Error fetching from fallback API:", fallbackError)

      // Return fallback reciters
      return [
        { id: 1, name: "Mishary Rashid Alafasy", reciter_name: "Mishary Rashid Alafasy", style: "murattal" },
        { id: 2, name: "Abdul Basit Abdul Samad", reciter_name: "Abdul Basit Abdul Samad", style: "murattal" },
        { id: 3, name: "Abdul Rahman Al-Sudais", reciter_name: "Abdul Rahman Al-Sudais", style: "murattal" },
        { id: 4, name: "Abu Bakr al-Shatri", reciter_name: "Abu Bakr al-Shatri", style: "murattal" },
      ]
    }
  }
}

export async function getChapterRecitation(reciterId: number, chapterNumber: number): Promise<string> {
  const cacheKey = `recitation_${reciterId}_${chapterNumber}`
  const cachedData = getFromCache<string>(cacheKey)

  if (cachedData) {
    console.log("Using cached recitation URL")
    return cachedData
  }

  try {
    console.log(`Getting recitation for chapter ${chapterNumber} with reciter ${reciterId}`)

    // Format surah number with leading zeros for consistent URL formatting
    const paddedSurah = chapterNumber.toString().padStart(3, "0")

    // Try MP3Quran.net first (more reliable for full surahs)
    let audioUrl = ""

    if (reciterId === 7 || reciterId === 1) {
      // Mishary Alafasy or default
      // MP3Quran.net URL format
      audioUrl = `${MP3QURAN_BASE}/${paddedSurah}.mp3`
    } else if (reciterId === 3) {
      // Al-Sudais
      audioUrl = `https://server10.mp3quran.net/sudais/${paddedSurah}.mp3`
    } else if (reciterId === 4) {
      // Abu Bakr al-Shatri
      audioUrl = `https://server7.mp3quran.net/shuraym/${paddedSurah}.mp3`
    } else {
      // Fallback to EveryAyah for any other reciter
      audioUrl = `${EVERYAYAH_BASE}/${paddedSurah}001.mp3`
    }

    console.log("Generated audio URL:", audioUrl)

    // Verify the URL is accessible
    try {
      const response = await fetch(audioUrl, { method: "HEAD" })
      if (!response.ok) {
        console.warn(`Primary audio URL not accessible: ${audioUrl}`)
        // If primary URL fails, try EveryAyah as fallback
        audioUrl = `${EVERYAYAH_BASE}/${paddedSurah}001.mp3`
        console.log("Using fallback URL:", audioUrl)
      }
    } catch (error) {
      console.warn("Error checking audio URL:", error)
      // If checking fails, still use the URL but log the issue
    }

    // Save to cache
    saveToCache(cacheKey, audioUrl)
    return audioUrl
  } catch (error) {
    console.error("Error getting chapter recitation:", error)

    // Fallback to a reliable reciter and source
    const paddedSurah = chapterNumber.toString().padStart(3, "0")
    return `${EVERYAYAH_BASE}/${paddedSurah}001.mp3`
  }
}

export async function getVerseRecitation(reciterId: number, verseKey: string): Promise<string> {
  const cacheKey = `verse_recitation_${reciterId}_${verseKey}`
  const cachedData = getFromCache<string>(cacheKey)

  if (cachedData) {
    console.log("Using cached verse recitation URL")
    return cachedData
  }

  try {
    // Parse the verse key
    const [surahStr, ayahStr] = verseKey.split(":")
    const surahNum = Number.parseInt(surahStr, 10)
    const ayahNum = Number.parseInt(ayahStr, 10)

    // Format with leading zeros
    const paddedSurah = surahNum.toString().padStart(3, "0")
    const paddedAyah = ayahNum.toString().padStart(3, "0")

    // Use EveryAyah.com for individual verses (most reliable)
    const audioUrl = `${EVERYAYAH_BASE}/${paddedSurah}${paddedAyah}.mp3`

    console.log("Generated verse audio URL:", audioUrl)

    // Save to cache
    saveToCache(cacheKey, audioUrl)
    return audioUrl
  } catch (error) {
    console.error("Error getting verse recitation:", error)

    // Fallback to a reliable format
    const [surahStr, ayahStr] = verseKey.split(":")
    const surahNum = Number.parseInt(surahStr, 10)
    const ayahNum = Number.parseInt(ayahStr, 10)
    const paddedSurah = surahNum.toString().padStart(3, "0")
    const paddedAyah = ayahNum.toString().padStart(3, "0")

    return `${EVERYAYAH_BASE}/${paddedSurah}${paddedAyah}.mp3`
  }
}

export async function getTafsir(verseKey: string, language = "en"): Promise<string> {
  const cacheKey = `tafsir_${verseKey}_${language}`
  const cachedData = getFromCache<string>(cacheKey)

  if (cachedData) {
    console.log("Using cached tafsir data")
    return cachedData
  }

  try {
    // Split verse key into surah and ayah
    const [surah, ayah] = verseKey.split(":")

    // Determine which tafsir to use based on language
    let tafsirIdentifier = "en.ibn-kathir" // Default to English Ibn Kathir

    if (language === "ar") {
      tafsirIdentifier = "ar.muyassar"
    } else if (language === "ur") {
      tafsirIdentifier = "ur.maududi"
    }

    console.log(`Fetching tafsir for ${verseKey} in ${tafsirIdentifier}`)
    const response = await fetch(`${ALQURAN_API_BASE}/ayah/${surah}:${ayah}/${tafsirIdentifier}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch tafsir: ${response.status} ${response.statusText}`)
    }

    const data: ApiResponse<{ text: string }> = await response.json()

    if (data.code === 200) {
      // Save to cache
      saveToCache(cacheKey, data.data.text)
      return data.data.text
    }

    throw new Error("Invalid data from Al-Quran Cloud API")
  } catch (primaryError) {
    console.error("Error fetching tafsir from Al-Quran Cloud API:", primaryError)

    try {
      // Fallback to Quran.com API
      console.log("Falling back to Quran.com API")
      const fallbackResponse = await fetch(`${QURAN_COM_API_BASE}/tafsirs/en-tafisr-ibn-kathir?verse_key=${verseKey}`)

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API failed: ${fallbackResponse.status}`)
      }

      const fallbackData = await fallbackResponse.json()

      if (fallbackData.tafsirs && fallbackData.tafsirs.length > 0) {
        // Save to cache
        saveToCache(cacheKey, fallbackData.tafsirs[0].text)
        return fallbackData.tafsirs[0].text
      }

      throw new Error("Invalid data from fallback API")
    } catch (fallbackError) {
      console.error("Error fetching from fallback API:", fallbackError)

      // Return fallback message
      return "Tafsir not available for this verse. Please try another verse or check your connection."
    }
  }
}

// User preferences management
export interface UserPreferences {
  language: string
  fontSize: string
  theme: string
  reciterId: number
  lastRead: {
    surah: number
    verse: number
    timestamp: number
  }[]
}

export function getUserPreferences(): UserPreferences {
  const defaultPreferences: UserPreferences = {
    language: "en",
    fontSize: "medium",
    theme: "system",
    reciterId: 1,
    lastRead: [],
  }

  try {
    const storedPreferences = localStorage.getItem(`${CACHE_PREFIX}user_preferences`)

    if (!storedPreferences) {
      return defaultPreferences
    }

    return JSON.parse(storedPreferences)
  } catch (error) {
    console.error("Error retrieving user preferences:", error)
    return defaultPreferences
  }
}

export function saveUserPreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(`${CACHE_PREFIX}user_preferences`, JSON.stringify(preferences))
  } catch (error) {
    console.error("Error saving user preferences:", error)
  }
}

export function updateLastRead(surah: number, verse: number): void {
  try {
    const preferences = getUserPreferences()

    // Remove this surah if it exists
    const filteredLastRead = preferences.lastRead.filter((item) => item.surah !== surah)

    // Add to the beginning of the array
    preferences.lastRead = [
      {
        surah,
        verse,
        timestamp: Date.now(),
      },
      ...filteredLastRead,
    ].slice(0, 5) // Keep only the 5 most recent

    saveUserPreferences(preferences)
  } catch (error) {
    console.error("Error updating last read:", error)
  }
}

import { getLanguage as getLanguageFromStorage } from "./language"

export const getLanguage = getLanguageFromStorage

// Removed ensureTranslations function as it's no longer needed to force a translation string.

export async function getRandomVerse(language = "en"): Promise<any> {
  try {
    // Generate random chapter (1-114) and verse
    const randomChapter = Math.floor(Math.random() * 114) + 1

    // First get the chapter to know how many verses it has
    const chapters = await getChapters(language)
    const chapter = chapters.find((c) => c.id === randomChapter)

    if (!chapter) return null

    const randomVerseNumber = Math.floor(Math.random() * chapter.verses_count) + 1
    const verseKey = `${randomChapter}:${randomVerseNumber}`

    // Try primary API (Quran.com) first for both Arabic and translation
    console.log(`Attempting to fetch random verse from Quran.com API: ${verseKey}`)
    const response = await fetch(
      `${QURAN_COM_API_BASE}/verses/by_key/${verseKey}?language=${language}&words=true&translations=131`,
    )
    if (response.ok) {
      const data = await response.json()
      const verse = data.verse
      // Return verse as is; DailyAyah will handle conditional rendering of translation
      return verse
    } else {
      console.warn(`Failed to fetch from Quran.com API (${response.status}), falling back...`)
      throw new Error(`Failed to fetch from Quran.com: ${response.status}`) // Throw to trigger fallback
    }
  } catch (primaryError) {
    console.error("Error fetching random verse from primary API:", primaryError)

    try {
      // Fallback: Try Al-Quran Cloud for Arabic text, then Quran.com for translation
      const randomChapter = Math.floor(Math.random() * 114) + 1
      const backupResponse = await fetch(`${ALQURAN_API_BASE}/surah/${randomChapter}`)

      if (!backupResponse.ok) {
        throw new Error(`Backup API failed to fetch Arabic text: ${backupResponse.status}`)
      }

      const backupData = await backupResponse.json()
      if (backupData.code === 200 && backupData.data && Array.isArray(backupData.data.ayahs)) {
        const ayahs = backupData.data.ayahs
        const randomIndex = Math.floor(Math.random() * ayahs.length)
        const randomAyah = ayahs[randomIndex]
        const verseKey = `${randomChapter}:${randomAyah.numberInSurah}`

        let translations: { id: number; text: string; resource_id: number; resource_name: string }[] = []

        // Attempt to fetch translation for this specific ayah from Quran.com
        try {
          console.log(`Attempting to fetch translation for ${verseKey} from Quran.com API (fallback)`)
          const translationResponse = await fetch(
            `${QURAN_COM_API_BASE}/verses/by_key/${verseKey}?language=${language}&translations=131`,
          )
          if (translationResponse.ok) {
            const translationData = await translationResponse.json()
            if (translationData.verse?.translations && translationData.verse.translations.length > 0) {
              translations = translationData.verse.translations.map((t: any) => ({
                id: t.id || 1,
                text: t.text,
                resource_id: t.resource_id || 1,
                resource_name: t.resource_name || "Quran.com",
              }))
            }
          } else {
            console.warn(`Failed to fetch translation from Quran.com API (fallback): ${translationResponse.status}`)
          }
        } catch (translationFetchError) {
          console.warn("Error fetching specific ayah translation for fallback:", translationFetchError)
        }

        // Transform to match our interface
        const verse = {
          id: randomAyah.number,
          verse_key: verseKey,
          text_uthmani: randomAyah.text,
          verse_number: randomAyah.numberInSurah,
          words: [], // Al-Quran Cloud doesn't provide words in this format
          translations: translations, // Will be empty array if no translation found
        }
        return verse
      }
      throw new Error("Invalid data from backup API (Al-Quran Cloud)")
    } catch (backupError) {
      console.error("Error with backup random verse fetching:", backupError)
      return null
    }
  }
}

// Export cache management functions
export { clearCache }
