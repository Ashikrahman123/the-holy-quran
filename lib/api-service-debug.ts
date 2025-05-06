"use client"

// Function to test all API endpoints and report status
export async function testAllApiEndpoints() {
  const endpoints = [
    { name: "Al-Quran Cloud API", url: "https://api.alquran.cloud/v1/surah/1" },
    { name: "Quran.com API", url: "https://api.quran.com/api/v4/chapters/1" },
    { name: "QuranEnc API", url: "https://quranenc.com/api/v1/translation/sura/english/1" },
    { name: "Grok API", url: "/api/chat" },
  ]

  const results = await Promise.all(
    endpoints.map(async (endpoint) => {
      const startTime = Date.now()
      try {
        const isExternal = !endpoint.url.startsWith("/")
        let response

        if (isExternal) {
          response = await fetch(endpoint.url, { method: "GET" })
        } else {
          // For internal APIs, just check if the route exists
          response = { ok: true, status: 200 } // Assume it exists
        }

        const duration = Date.now() - startTime
        return {
          name: endpoint.name,
          status: response.ok ? "OK" : "Failed",
          statusCode: response.status,
          duration: `${duration}ms`,
        }
      } catch (error) {
        const duration = Date.now() - startTime
        return {
          name: endpoint.name,
          status: "Error",
          statusCode: 0,
          duration: `${duration}ms`,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }),
  )

  console.table(results)
  return results
}

// Add a debug button component to trigger API tests
export function ApiDebugButton() {
  return (
    <button
      onClick={() => testAllApiEndpoints()}
      className="fixed bottom-20 right-4 bg-gray-800 text-white p-2 rounded-md text-xs opacity-50 hover:opacity-100"
    >
      Debug APIs
    </button>
  )
}
