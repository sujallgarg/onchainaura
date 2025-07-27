'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AuraBurstProps {
  show: boolean
}

export function AuraBurst({ show }: AuraBurstProps) {
  const [plasmaPaths, setPlasmaPaths] = useState<string[]>([])

  // Generate smooth, curved plasma-like paths
  useEffect(() => {
    if (show) {
      const paths: string[] = []
      for (let i = 0; i < 8; i++) {
        let path = 'M'
        const points = 12
        const radius = 100
        for (let j = 0; j <= points; j++) {
          const angle = (j / points) * Math.PI * 2
          const variance = Math.random() * 50 - 25
          const x = Math.cos(angle) * (radius + variance)
          const y = Math.sin(angle) * (radius + variance)
          if (j === 0) {
            path += `${x},${y}`
          } else {
            const prevX = Math.cos((j - 1) / points * Math.PI * 2) * (radius + Math.random() * 50 - 25)
            const prevY = Math.sin((j - 1) / points * Math.PI * 2) * (radius + Math.random() * 50 - 25)
            const midX = (prevX + x) / 2
            const midY = (prevY + y) / 2
            path += ` Q ${midX},${midY} ${x},${y}`
          }
        }
        path += 'Z'
        paths.push(path)
      }
      setPlasmaPaths(paths)
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {/* SVG Filter for glow effect */}
          <svg width="0" height="0">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="turbulence">
                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="turbulence" />
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="50" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>

          {/* Core burst with smooth plasma effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 2, 3],
              opacity: [0, 1, 0]
            }}
            exit={{ scale: 4, opacity: 0 }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
            className="absolute"
          >
            <svg width="800" height="800" viewBox="-200 -200 400 400">
              {/* Smooth plasma layers */}
              {plasmaPaths.map((path, i) => (
                <motion.path
                  key={i}
                  d={path}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 1.5],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  style={{
                    fill: `rgba(${147 + i * 10}, ${197 - i * 10}, ${253}, ${0.3 - i * 0.03})`,
                    filter: 'url(#glow)',
                    transform: `rotate(${i * 45}deg)`
                  }}
                />
              ))}
            </svg>
          </motion.div>

          {/* Particle effects */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              initial={{ 
                scale: 0,
                opacity: 0,
                x: 0,
                y: 0
              }}
              animate={{ 
                scale: [0, Math.random() * 1.5 + 0.5, 0],
                opacity: [0, Math.random() * 0.8 + 0.2, 0],
                x: (Math.random() - 0.5) * 600,
                y: (Math.random() - 0.5) * 600
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                delay: Math.random() * 0.5,
                ease: "easeOut"
              }}
              className="absolute w-4 h-4 rounded-full"
              style={{
                background: `radial-gradient(circle at center, 
                  rgba(192,132,252,0.8) 0%,
                  rgba(129,140,248,0.4) 50%,
                  rgba(147,197,253,0) 100%
                )`,
                filter: 'url(#glow)'
              }}
            />
          ))}

          {/* Central core */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 3, 4],
              opacity: [0, 1, 0]
            }}
            exit={{ scale: 5, opacity: 0 }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle at center,
                rgba(255,255,255,1) 0%,
                rgba(192,132,252,0.8) 30%,
                rgba(129,140,248,0.4) 60%,
                rgba(147,197,253,0) 100%
              )`,
              filter: 'url(#glow)'
            }}
          />

          {/* Energy waves with smoother animation */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 3 + i],
                opacity: [0, 0.5 - i * 0.1, 0]
              }}
              transition={{ 
                duration: 2.5,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="absolute rounded-full"
              style={{
                width: '100%',
                height: '100%',
                border: `4px solid rgba(192,132,252,${0.3 - i * 0.05})`,
                filter: 'url(#turbulence)'
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
