'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { BrowserWindow } from '@/components/BrowserWindow'
import { RetroButton } from '@/components/RetroButton'
import { AuraEffect } from './components/AuraEffect'
import { MemeBrowser } from './components/MemeBrowser'
import { motion, AnimatePresence } from 'framer-motion'
import ConnectWallett from '@/components/ConnectWallet'
import { RetroLoader } from '@/components/RetroLoader'
import { AuraBurst } from '@/components/AuraBurst'
import { Footer } from '@/components/Footer'
import AuraShareButton from '@/components/AuraShareButton'
import { Suspense } from 'react'

function RetroAuraWebsite() {
  const scoreRef = useRef<HTMLDivElement | null>(null)
  const searchParams = useSearchParams()
  const address = searchParams.get('address')
  const [inputValue, setInputValue] = useState(address || '')
  const [auraScore, setAuraScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const loadingAudioRef = useRef<HTMLAudioElement | null>(null)
  const completionAudioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlayingLoadingSound, setIsPlayingLoadingSound] = useState<boolean>(false)
  const audioPromiseRef = useRef<Promise<void> | null>(null)

  // Initialize audio on component mount
  useEffect(() => {
    loadingAudioRef.current = new Audio('/loadingSound.mp4')
    completionAudioRef.current = new Audio('/burstSound.mp4')

    loadingAudioRef.current.addEventListener('ended', () => {
      setIsPlayingLoadingSound(false)
    })

    loadingAudioRef.current.load()
    completionAudioRef.current.load()

    return () => {
      if (loadingAudioRef.current) {
        loadingAudioRef.current.removeEventListener('ended', () => {
          setIsPlayingLoadingSound(false)
        })
        loadingAudioRef.current.pause()
        loadingAudioRef.current.currentTime = 0
      }
      if (completionAudioRef.current) {
        completionAudioRef.current.pause()
        completionAudioRef.current.currentTime = 0
      }
    }
  }, [])

  const playLoadingSound = async () => {
    if (loadingAudioRef.current && !isPlayingLoadingSound) {
      try {
        setIsPlayingLoadingSound(true)
        loadingAudioRef.current.currentTime = 0
        audioPromiseRef.current = loadingAudioRef.current.play()
        await loadingAudioRef.current.play()
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Audio playback failed:', error)
        }
        setIsPlayingLoadingSound(false)
      }
    }
  }

  const stopLoadingSound = async () => {
    if (loadingAudioRef.current && isPlayingLoadingSound) {
      try {
        // Wait for any pending play promise to resolve before pausing
        if (audioPromiseRef.current) {
          await audioPromiseRef.current
        }
        loadingAudioRef.current.pause()
        loadingAudioRef.current.currentTime = 0
        setIsPlayingLoadingSound(false)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error stopping loading sound:', error)
        }
      }
    }
  }

  const playCompletionSound = async () => {
    try {
      // Stop loading sound first
      await stopLoadingSound()

      // Small delay to ensure clean transition
      await new Promise(resolve => setTimeout(resolve, 100))

      if (completionAudioRef.current) {
        completionAudioRef.current.currentTime = 0
        await completionAudioRef.current.play()
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Completion audio playback failed:', error)
      }
    }
  }


  // Update URL when input changes
  const updateURL = (value: string) => {
    const newURL = value
      ? `${window.location.pathname}?address=${encodeURIComponent(value)}`
      : window.location.pathname

    window.history.pushState({}, '', newURL)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    updateURL(newValue)
  }

  // Calculate aura function
  const calculateAura = async (value: string) => {
    if (!value) return

    setIsLoading(true)
    setShowConfetti(false)
    await playLoadingSound()

    try {
      const response = await fetch(`/api/lookup?address=${value}`)
      const data = await response.json()

      if (data) {
        setAuraScore(Math.round(data.auraScore))
        await playCompletionSound()
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
    } catch (err) {
      console.error(err)
      setAuraScore(null)
      await stopLoadingSound()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (address) {
      calculateAura(address)
    }
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const newAddress = params.get('address') || ''
      setInputValue(newAddress)
      if (newAddress) {
        calculateAura(newAddress)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (address !== inputValue) {
      setInputValue(address || '')
      if (address) {
        calculateAura(address)
      }
    }
  }, [address])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    calculateAura(inputValue)
  }

  // Rest of the component remains the same...
  return (
    <div className="relative min-h-screen bg-[#1a1a2e] p-4">
      <AuraBurst show={showConfetti} />
      {auraScore !== null && <AuraEffect score={auraScore} />}

      <div className="absolute top-4 right-4 z-10">
        <ConnectWallett />
      </div>

      {
        auraScore !== null && scoreRef !== null && (
          <div className="absolute top-20 right-4 z-10">
            <AuraShareButton auraScore={auraScore} divRef={scoreRef} userAddress={inputValue} />
          </div>
        )
      }
      <h1 className="text-2xl font-bold text-purple-400 flex justify-center uppercase tracking-widest">
        Aura Analyzer v1.0
      </h1>
      <div className='bg-[#1a1a2e]' ref={scoreRef}>
        <div className="max-w-5xl mx-auto grid gap-4 pt-4 flex-gorw mb-6">
          <BrowserWindow title="AURA.ANALYZER/INPUT" variant="dark">
            <div className="bg-[#16213e] p-6">
              <div className="text-center mb-4">

                <div className="bg-purple-400/10 border border-purple-400/50 p-2 text-sm text-gray-300">
                  Enter your address to find your Aura
                </div>
              </div>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <div className="bg-[#1a1a2e] border border-purple-400/50 p-4">
                  <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="What's your current vibe?"
                    className="w-full border-2 border-purple-400/50 bg-[#16213e] px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-0"
                  />
                </div>
                <RetroButton type="submit" className="w-full" variant="primary" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <RetroLoader />
                      <span>Calculating Aura...</span>
                    </div>
                  ) : (
                    'Calculate Aura Power'
                  )}
                </RetroButton>
              </form>
            </div>
          </BrowserWindow>


          <AnimatePresence>
            {auraScore !== null && !isLoading && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.2 }}
                >
                  <BrowserWindow title="AURA.ANALYZER/RESULTS" variant="dark">
                    <div className="bg-[#16213e] p-6">
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-purple-400">
                          {auraScore >= 70 ? 'STRONG AURA' : 'WEAK AURA'}
                        </h2>
                        <div className="text-4xl font-bold text-gray-300">
                          +{auraScore} AURA POINTS
                        </div>
                        <div className="h-6 bg-[#1a1a2e] border-2 border-purple-400/50 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-1000"
                            style={{
                              width: `${auraScore}%`,
                              background: auraScore >= 70
                                ? 'linear-gradient(90deg, #c084fc, #818cf8)'
                                : 'linear-gradient(90deg, #ef4444, #7f1d1d)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </BrowserWindow>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.4 }}
                  >
                    <MemeBrowser
                      title="AURA.COMPARISON"
                      score={auraScore}
                      type="comparison"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.6 }}
                  >
                    <MemeBrowser
                      title="AURA.ACTIVITIES"
                      score={auraScore}
                      type="activities"
                    />
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function RetroAuraWebsiteWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RetroAuraWebsite />
    </Suspense>
  )
}
