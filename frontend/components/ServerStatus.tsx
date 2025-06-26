'use client'

import { useState, useEffect, useCallback } from 'react'
import { config, getBackendUrl } from '@/config'

interface ServerStatus {
  isOnline: boolean
  lastChecked: Date | null
  isChecking: boolean
  errorMessage: string | null
  wakeUpAttempts: number
  nextCheckCountdown: number
}

export default function ServerStatus() {
  const [status, setStatus] = useState<ServerStatus>({
    isOnline: false,
    lastChecked: null,
    isChecking: false,
    errorMessage: null,
    wakeUpAttempts: 0,
    nextCheckCountdown: config.statusCheckInterval / 1000
  })
  const [isHidden, setIsHidden] = useState(false)
  const backendUrl = getBackendUrl()

  const checkServerStatus = useCallback(async () => {
    setStatus(prev => ({ ...prev, isChecking: true, errorMessage: null }))
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config.timeouts.statusCheck)

      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      const isOnline = response.ok
      setStatus(prev => ({
        ...prev,
        isOnline,
        lastChecked: new Date(),
        isChecking: false,
        errorMessage: null,
        wakeUpAttempts: isOnline ? 0 : prev.wakeUpAttempts,
        nextCheckCountdown: config.statusCheckInterval / 1000
      }))
      
      return isOnline
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed'
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        lastChecked: new Date(),
        isChecking: false,
        errorMessage: errorMessage === 'The user aborted a request.' ? 'Request timeout' : errorMessage,
        nextCheckCountdown: config.statusCheckInterval / 1000
      }))
      return false
    }
  }, [backendUrl])

  const wakeUpServer = useCallback(async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config.timeouts.wakeUp)

      // Try multiple endpoints to wake up the server
      const wakeUpEndpoints = [
        { url: `${backendUrl}/`, method: 'GET' },
        { url: `${backendUrl}/health`, method: 'GET' },
        { 
          url: `${backendUrl}/ai-enhance`, 
          method: 'POST',
          body: JSON.stringify({
            section: 'summary',
            content: 'Server wake-up test'
          })
        }
      ]

      for (const endpoint of wakeUpEndpoints) {
        try {
          const response = await fetch(endpoint.url, {
            method: endpoint.method as 'GET' | 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: endpoint.body,
            signal: controller.signal
          })
          
          if (response.ok) {
            clearTimeout(timeoutId)
            return true
          }
        } catch (error) {
          console.error(`Wake-up attempt failed for ${endpoint.url}:`, error)
        }
      }
      
      clearTimeout(timeoutId)
      return false
    } catch (error) {
      return false
    }
  }, [backendUrl])

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus()
  }, [checkServerStatus])

  // Countdown timer effect
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        nextCheckCountdown: Math.max(0, prev.nextCheckCountdown - 1)
      }))
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [])

  // Set up periodic status checking and server wake-up
  useEffect(() => {
    const interval = setInterval(async () => {
      const isOnline = await checkServerStatus()
      
      // If server is offline, try to wake it up
      if (!isOnline) {
        setStatus(prev => ({ ...prev, wakeUpAttempts: prev.wakeUpAttempts + 1 }))
        
        const wakeUpSuccess = await wakeUpServer()
        
        if (wakeUpSuccess) {
          // Re-check status after successful wake-up
          setTimeout(() => checkServerStatus(), 2000)
        }
      }
    }, config.statusCheckInterval)

    return () => clearInterval(interval)
  }, [checkServerStatus, wakeUpServer])

  const getStatusColor = () => {
    if (status.isChecking) return 'bg-yellow-500'
    return status.isOnline ? 'bg-green-500' : 'bg-red-500'
  }

  const getStatusText = () => {
    if (status.isChecking) return 'Checking...'
    return status.isOnline ? 'Online' : 'Offline'
  }

  const getStatusMessage = () => {
    if (status.isChecking) return 'Checking server status...'
    if (status.isOnline) return 'Server is running and ready'
    if (status.wakeUpAttempts > 0) {
      return `Server is sleeping. Wake-up attempts: ${status.wakeUpAttempts}`
    }
    return 'Server is sleeping. AI features may be temporarily unavailable.'
  }

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleManualRefresh = () => {
    checkServerStatus()
  }

  const handleHideBanner = () => {
    setIsHidden(true)
  }

  const handleShowBanner = () => {
    setIsHidden(false)
  }

  // Floating button component
  const FloatingStatusButton = () => (
    <div className="fixed z-50 bottom-6 right-5">
      <button
        onClick={handleShowBanner}
        className={`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          status.isOnline ? 'bg-green-500' : 'bg-red-500'
        } text-white`}
        title={`Server Status: ${getStatusText()}`}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${status.isOnline ? 'bg-white' : 'bg-red-200'} animate-pulse`}></div>
          <span className="text-xs font-medium">{getStatusText()}</span>
        </div>
      </button>
    </div>
  )

  // If hidden, show floating button
  if (isHidden) {
    return <FloatingStatusButton />
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className={`${getStatusColor()} text-white px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-center transition-colors duration-300`}>
        <div className="flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${status.isOnline ? 'bg-white' : 'bg-red-200'} animate-pulse`}></div>
            <span>{getStatusText()}</span>
          </div>

          <div className="items-center hidden space-x-2 sm:flex">
            <span className="text-xs opacity-75">•</span>
            <span className="text-xs opacity-75">{getStatusMessage()}</span>
            {status.lastChecked && (
              <>
                <span className="text-xs opacity-75">•</span>
                <span className="text-xs opacity-75">
                  Last checked: {status.lastChecked.toLocaleTimeString()}
                </span>
              </>
            )}
            <span className="text-xs opacity-75">•</span>
            <span className="text-xs opacity-75">
              Next check: {formatCountdown(status.nextCheckCountdown)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleManualRefresh}
              disabled={status.isChecking}
              className="px-2 py-1 text-xs transition-all bg-white rounded bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.isChecking ? 'Checking...' : 'Refresh'}
            </button>
            <button
              onClick={handleHideBanner}
              className="px-2 py-1 text-xs transition-all bg-white rounded bg-opacity-20 hover:bg-opacity-30"
              title="Hide status banner"
            >
              Hide
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}