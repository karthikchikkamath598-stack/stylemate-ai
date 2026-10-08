import React, { useEffect, useState } from 'react';
import { Sparkles, Search, Brain, Wand2, Check } from 'lucide-react';

interface LoadingOverlayProps {
  onComplete?: () => void;
}

const steps = [
  { text: '✦ Understanding your style...', icon: Sparkles, detail: 'Processing silhouette, color, and occasion constraints...' },
  { text: '🔎 Searching fashion knowledge...', icon: Search, detail: 'Querying 112 ChromaDB vectors across 21 styling guides...' },
  { text: '🧠 Finding the best combinations...', icon: Brain, detail: 'Evaluating fabric breathability, shoes, and color harmony...' },
  { text: '✨ Creating your personalized look...', icon: Wand2, detail: 'Synthesizing tailored styling notes & alternative outfits...' },
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 850);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xl p-4 transition-all">
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl text-stone-100 flex flex-col items-center text-center relative overflow-hidden">
        {/* Editorial Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase bg-stone-800/80 text-rose-300 border border-rose-500/20 mb-8">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          STYLEMATE AI ENGINE ACTIVE
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-wide mb-8">
          Curating Your Signature Look
        </h3>

        {/* Steps progression */}
        <div className="w-full space-y-4 text-left">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-500 flex items-start gap-4 ${
                  isCurrent
                    ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/50 translate-x-1'
                    : isCompleted
                    ? 'bg-stone-800/40 border-emerald-500/30 text-stone-400'
                    : 'bg-transparent border-transparent text-stone-600'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-rose-500 text-white animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-stone-800 text-stone-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <div
                    className={`text-sm font-medium transition-colors ${
                      isCurrent
                        ? 'text-white'
                        : isCompleted
                        ? 'text-stone-300'
                        : 'text-stone-600'
                    }`}
                  >
                    {s.text}
                  </div>
                  {isCurrent && (
                    <p className="mt-1 text-xs text-rose-300/80 animate-fadeIn">
                      {s.detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom subtle note */}
        <div className="mt-8 text-xs text-stone-500 font-mono">
          RAG Pipeline: User Query → Embeddings → ChromaDB → Context Augmentation
        </div>
      </div>
    </div>
  );
};
