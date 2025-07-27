/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserWindow } from '@/components/BrowserWindow'

interface MemeBrowserProps {
  title: string
  score: number
  type: 'comparison' | 'activities'
}

export function MemeBrowser({ title, score, type }: MemeBrowserProps) {
  const getScoreCategory = (score: number) => {
    if (score <= 200) return 0  // The Wanderer
    if (score <= 800) return 1  // The Explorer
    if (score <= 2000) return 2 // The Rising Star
    if (score <= 4000) return 3 // The Jedi HODLer
    if (score <= 8000) return 4 // The DeFi Guru
    return 5                    // The Legendary Ape
  }

  const getComparison = (score: number) => {
    const category = getScoreCategory(score)
    const messages = {
      0: {
        text: "The Wanderer - Your wallet is basically in hibernation",
        description: "Stop scrolling memes. Make a move! Stake your first token, then we'll talk."
      },
      1: {
        text: "The Explorer - Your aura is flickering...",
        description: "Got a stablecoin stash? Lend it on Aave. Make your coins do yoga (flexibility + interest)."
      },
      2: {
        text: "The Rising Star - You're halfway to crypto glory!",
        description: "Become a DeFi detective: check your approvals on Etherscan and revoke anything suspicious—safety first!"
      },
      3: {
        text: "The Jedi HODLer - You're on a roll!",
        description: "Farm it 'til you make it. Stake your tokens in a fresh yield farm. Just watch out for rug pulls!"
      },
      4: {
        text: "The DeFi Guru - Welcome to the big leagues!",
        description: "You're basically the Vitalik of your friend group—start a DAO for your cat. Seriously, it's 2024."
      },
      5: {
        text: "The Legendary Ape - Your aura is practically glowing",
        description: "Issue your own token, call it $LEGEND, and promise yourself you won't become a rug magnet."
      }
    }

    return messages[category as keyof typeof messages]
  }

  const getActivities = (score: number) => {
    const category = getScoreCategory(score)
    const activities = {
      0: {
        text: "Time to wake up—try bridging 1 token to a brand-new L2!",
        activities: [
          "✗ Your balance is quieter than a lonely block",
          "✗ No governance participation yet",
          "✗ Needs first token bridge experience"
        ]
      },
      1: {
        text: "Try adding liquidity on Uniswap for that 'farm and chill' lifestyle!",
        activities: [
          "✓ Ready for DeFi exploration",
          "✓ Perfect for first NFT purchase",
          "✗ Haven't tried liquidity providing yet"
        ]
      },
      2: {
        text: "Swap some random altcoin on SushiSwap—fortune favors the bold (maybe).",
        activities: [
          "✓ Active in token swaps",
          "✓ Governance participant",
          "✓ Growing DeFi portfolio"
        ]
      },
      3: {
        text: "Time to do something outrageous, like bridging to a chain you've never heard of. YOLO!",
        activities: [
          "✓ Multi-chain explorer",
          "✓ NFT enthusiast",
          "✓ Yield farming initiate"
        ]
      },
      4: {
        text: "Ever tried being a liquidity provider on a newly launched DEX? High risk, high adrenaline, baby!",
        activities: [
          "✓ Cross-chain maestro",
          "✓ Airdrop hunter",
          "✓ Advanced LP strategies"
        ]
      },
      5: {
        text: "Dare to double-dip? Stake your staked tokens somewhere else! Just don't break the chain.",
        activities: [
          "✓ DeFi maxiMAXI",
          "✓ Governance whale",
          "✓ Ultimate yield farmer"
        ]
      }
    }

    return activities[category as keyof typeof activities]
  }

  const content = type === 'comparison'
    ? getComparison(score)
    : getActivities(score)

  return (
    <BrowserWindow title={title} variant="dark">
      <div className="bg-[#16213e] p-6">
        {type === 'comparison' ? (
          <div className="space-y-4">
            <div className="bg-purple-400/10 border-2 border-purple-400/50 p-4 text-center">
              <p className="text-lg font-bold text-gray-300">{content.text}</p>
            </div>
            <div className="bg-[#1a1a2e] border-2 border-purple-400/50 p-4 text-center">
              <p className="text-gray-400">{(content as { text: string; description: string; }).description}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-purple-400/10 border-2 border-purple-400/50 p-4 text-center">
              <p className="text-lg font-bold text-gray-300">{content.text}</p>
            </div>
            <div className="space-y-2">
              {(content as any).activities.map((activity: string, i: number) => (
                <div
                  key={i}
                  className="bg-[#1a1a2e] border-2 border-purple-400/50 p-2 text-gray-300"
                >
                  {activity}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BrowserWindow>
  )
}

export default MemeBrowser;