'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { BrowserWindow } from '@/components/BrowserWindow'
import { RetroButton } from '@/components/RetroButton'
import ConnectWallett from '@/components/ConnectWallet'
import { Footer } from '@/components/Footer'
import { Analytics } from "@vercel/analytics/react"

export default function LandingPage() {
  const [address, setAddress] = useState<string>('')
  const router = useRouter()
  
  const handleCheckScore = (e: React.FormEvent) => {
    e.preventDefault()
    if (address) {
      const trimmedAddress = address.trim()
      router.push(`/base/points?address=${trimmedAddress}`)
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e]">
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              get your BASED AURA
            </h1>
            <p className="text-xl text-gray-400">
              Discover Your Aura Score based on your onchain journey
            </p>
          </div>
          <Analytics/>
          <BrowserWindow title="AURA.CHECKER">
            <div className="bg-[#1a1a2e] p-8">
              <div className="max-w-md mx-auto space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-purple-400">
                    Aura
                  </h2>
                  <p className="text-gray-400">
                    Connect your Base wallet or enter an address to check your score
                  </p>
                </div>
                
                <form onSubmit={handleCheckScore} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="0xABC..."
                      className="flex-1 bg-[#16213e] border-2 border-purple-400/50 text-white placeholder-gray-500"
                    />
                    <RetroButton type="submit" variant="primary">
                      Check Score
                    </RetroButton>
                  </div>
                </form>
                
                <div className="text-center">
                  <ConnectWallett />
                </div>
              </div>
            </div>
          </BrowserWindow>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
