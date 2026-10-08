import type { MatchScoreBreakdown } from '../types';
import { CheckCircle2, Info } from 'lucide-react';

interface MatchScoreCircleProps {
  score: number;
  breakdown: MatchScoreBreakdown;
  className?: string;
}

export const MatchScoreCircle: React.FC<MatchScoreCircleProps> = ({
  score,
  breakdown,
  className = '',
}) => {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreItems = [
    { label: 'Occasion Alignment', value: breakdown.occasion, max: breakdown.occasion_max, weight: '30%' },
    { label: 'Weather Adaptability', value: breakdown.weather, max: breakdown.weather_max, weight: '20%' },
    { label: 'Style Persona Fit', value: breakdown.style, max: breakdown.style_max, weight: '20%' },
    { label: 'Silhouette / Outfit Type', value: breakdown.outfit_type, max: breakdown.outfit_type_max, weight: '15%' },
    { label: 'Color Theory Harmony', value: breakdown.color, max: breakdown.color_max, weight: '10%' },
    { label: 'Comfort & Movement', value: breakdown.comfort, max: breakdown.comfort_max, weight: '5%' },
  ];

  return (
    <div className={`p-6 sm:p-8 rounded-3xl glass-card transition-all ${className}`}>
      <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
        {/* Left: Circular SVG Score Meter */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              {/* Background track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-stone-200 dark:stroke-stone-800"
                strokeWidth="9"
                fill="none"
              />
              {/* Animated Progress circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-rose-500 transition-all duration-1000 ease-out"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-serif text-5xl font-light text-stone-900 dark:text-stone-100">
                {score}%
              </span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-stone-500 dark:text-stone-400 mt-1">
                PREFERENCE MATCH
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <Info className="w-3.5 h-3.5 text-amber-500" />
            <span>Multi-factor preference alignment score</span>
          </div>
        </div>

        {/* Right: Breakdown bars */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-800">
            <span className="text-xs font-semibold tracking-wider uppercase text-stone-600 dark:text-stone-400">
              Curated Dimension
            </span>
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
              Contribution
            </span>
          </div>

          {scoreItems.map((item, idx) => {
            const pct = Math.round((item.value / item.max) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                    {item.label}
                  </span>
                  <span className="font-mono text-stone-600 dark:text-stone-300">
                    {item.value}/{item.max}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-400 to-amber-400 transition-all duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
