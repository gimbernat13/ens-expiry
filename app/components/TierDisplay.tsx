interface Tier {
  threshold: number;
  multiplier: number;
  name: string;
}

const TIERS: Record<string, Tier> = {
    BRONZE: {
        threshold: 0,
        multiplier: 1.0,
        name: 'BRONZE'
    },
    SILVER: {
        threshold: 50,
        multiplier: 1.5,
        name: 'SILVER'
    },
    GOLD: {
        threshold: 100,
        multiplier: 2.0,
        name: 'GOLD'
    },
    PLATINUM: {
        threshold: 200,
        multiplier: 3.0,
        name: 'PLATINUM'
    }
};

interface TierDisplayProps {
  currentTxCount: number;
  currentTier: string;
}

export function TierDisplay({ currentTxCount, currentTier }: TierDisplayProps) {
  const baseAPR = 5; // Base APR percentage

  return (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(TIERS).map(([key, tier]) => {
        const isCurrentTier = key === currentTier;
        const isUnlocked = currentTxCount >= tier.threshold;
        
        return (
          <div
            key={key}
            className={`relative p-6 rounded-lg border-2 transition-all ${
              isCurrentTier 
                ? 'bg-zinc-800/50 border-blue-500/50' 
                : isUnlocked 
                  ? 'bg-zinc-900/50 border-zinc-700/50' 
                  : 'bg-zinc-900/20 border-zinc-800/50'
            }`}
          >
            {/* Tier Badge */}
            <div className="absolute -top-3 left-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isUnlocked ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {tier.threshold === 0 ? 'START' : `${tier.threshold}+ TX`}
              </span>
            </div>

            {/* Tier Icon & Name */}
            <div className="mt-3 mb-4">
              <div className={`text-xl font-bold mb-1 ${
                isUnlocked ? 'text-white' : 'text-zinc-600'
              }`}>
                {tier.name}
              </div>
              <div className={`text-sm ${
                isUnlocked ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                Tier {Object.keys(TIERS).indexOf(key) + 1}
              </div>
            </div>

            {/* Multiplier & APR */}
            <div className="space-y-3">
              <div className={`${isUnlocked ? 'text-zinc-300' : 'text-zinc-600'}`}>
                <div className="text-3xl font-bold">
                  {(baseAPR * tier.multiplier).toFixed(1)}%
                </div>
                <div className="text-sm text-zinc-500">
                  APR
                </div>
              </div>
              
              <div className={`text-sm ${
                isUnlocked ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                {tier.multiplier}x Multiplier
              </div>
            </div>

            {/* Current Tier Indicator */}
            {isCurrentTier && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-blue-500 rounded-full p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 