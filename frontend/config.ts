// Configuration for the Resume Editor application
export const config = {
  // Backend URL - replace with your actual Render backend URL
  backendUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Server status check interval in milliseconds (30 seconds)
  statusCheckInterval: 30000,
  
  // Request timeout in milliseconds (5 seconds for status checks, 15 seconds for wake-up)
  timeouts: {
    statusCheck: 5000,
    wakeUp: 15000
  }
}

// Helper function to validate backend URL
export const validateBackendUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:'
  } catch {
    return false
  }
}

// Helper function to get backend URL with validation
export const getBackendUrl = (): string => {
  const url = config.backendUrl
  
  if (!validateBackendUrl(url)) {
    console.warn('Invalid backend URL configured. Please check your NEXT_PUBLIC_API_URL environment variable.')
    return 'http://localhost:8000'
  }
  
  return url
} 