/**
 * Utility functions for debugging API issues
 */

// Log API requests with detailed information
export function logApiRequest(endpoint: string, params: any) {
  console.log(`API Request to ${endpoint}:`, {
    timestamp: new Date().toISOString(),
    params,
  })
}

// Log API responses with status and timing
export function logApiResponse(endpoint: string, status: number, data: any, startTime: number) {
  const duration = Date.now() - startTime
  console.log(`API Response from ${endpoint}:`, {
    timestamp: new Date().toISOString(),
    status,
    duration: `${duration}ms`,
    data: typeof data === "object" ? "(object)" : data,
  })
}

// Test API connectivity and log results
export async function testApiConnectivity(apiUrl: string): Promise<boolean> {
  try {
    const startTime = Date.now()
    console.log(`Testing connectivity to ${apiUrl}...`)

    const response = await fetch(apiUrl, {
      method: "HEAD",
      cache: "no-store",
    })

    const duration = Date.now() - startTime
    const success = response.ok

    console.log(`Connectivity test to ${apiUrl}: ${success ? "SUCCESS" : "FAILED"} (${duration}ms)`)
    return success
  } catch (error) {
    console.error(`Connectivity test to ${apiUrl} failed:`, error)
    return false
  }
}

// Add this to any component to test API connectivity on load
export function useApiConnectivityTest(apiUrls: string[]) {
  if (typeof window !== "undefined") {
    console.log("Testing API connectivity...")
    apiUrls.forEach((url) => {
      testApiConnectivity(url)
    })
  }
}

// Helper to format error messages for display
export function formatErrorForDisplay(error: any): string {
  if (typeof error === "string") return error
  if (error instanceof Error) return error.message
  return "An unknown error occurred"
}
