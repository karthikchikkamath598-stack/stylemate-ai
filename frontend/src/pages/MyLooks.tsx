import React, { useState } from 'react';
import { Heart, Trash2, ExternalLink, Sparkles, Wand2, Calendar, ShoppingBag, Share2, Check } from 'lucide-react';
import type { SavedLook, UserPreferences } from '../types';

interface MyLooksProps {
  savedLooks: SavedLook[];
  onRemoveLook: (id: string) => void;
  onViewLook: (look: SavedLook) => void;
  onTrySimilar: (prefs: UserPreferences) => void;
  onGoToStudio: () => void;
}

export const MyLooks: React.FC<MyLooksProps> = ({
  savedLooks,
  onRemoveLook,
  onViewLook,
  onTrySimilar,
  onGoToStudio,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Derive Style Insights from real localStorage data
  const total = savedLooks.length;
  const styleCounts: Record<string, number> = {};
  const colorCounts: Record<string, number> = {};
  const occCounts: Record<string, number> = {};
  const comfortCounts: Record<string, number> = {};

  savedLooks.forEach((item) => {
    const s = item.preferences.style || 'Minimal';
    const c = item.preferences.color || 'Black';
    const o = item.preferences.occasion || 'College';
    const cf = item.preferences.comfort || 'Balanced';

    styleCounts[s] = (styleCounts[s] || 0) + 1;
    colorCounts[c] = (colorCounts[c] || 0) + 1;
    occCounts[o] = (occCounts[o] || 0) + 1;
    comfortCounts[cf] = (comfortCounts[cf] || 0) + 1;
  });

  const getTopKey = (counts: Record<string, number>, fallback: string) => {
    const entries = Object.entries(counts);
    if (!entries.length) return fallback;
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  };

  const favoriteStyle = getTopKey(styleCounts, 'Trendy');
  const favoriteColor = getTopKey(colorCounts, 'Black');
  const favoriteOccasion = getTopKey(occCounts, 'College');
  const preferredComfort = getTopKey(comfortCounts, 'Balanced');

  const handleShare = (look: SavedLook) => {
    const text = `StyleMate AI Curation: ${look.recommendation.title} (${look.recommendation.look_name})\nTop: ${look.recommendation.pieces.top}\nBottom: ${look.recommendation.pieces.bottom}`;
    navigator.clipboard.writeText(text);
    setCopiedId(look.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-rose-500 bg-rose-500/10 border border-rose-500/20">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          PERSONAL WARDROBE
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-stone-900 dark:text-stone-50">
          “My Looks & Style Profile”
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-base font-light font-sans max-w-xl mx-auto">
          Your saved personalized outfits and algorithmic style telemetry calculated from your history.
        </p>
      </div>

      {/* STYLE INSIGHTS DASHBOARD */}
      <section className="p-6 sm:p-8 rounded-3xl glass-card space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="font-serif text-2xl font-light text-stone-900 dark:text-stone-100">
              Your Style Profile
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
            Telemetry from {total} Saved Look{total === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
              Favorite Style
            </span>
            <div className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
              {favoriteStyle}
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
              Favorite Color
            </span>
            <div className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
              {favoriteColor}
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
              Comfort Stance
            </span>
            <div className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
              {preferredComfort}
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
              Top Occasion
            </span>
            <div className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
              {favoriteOccasion}
            </div>
          </div>

          {/* Card 5 */}
          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-rose-500 font-semibold">
              Saved Looks
            </span>
            <div className="font-serif text-2xl font-bold text-rose-600 dark:text-rose-400">
              {total}
            </div>
          </div>
        </div>
      </section>

      {/* SAVED LOOKS GALLERY */}
      {savedLooks.length === 0 ? (
        <div className="p-16 rounded-3xl glass-card text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-light text-stone-900 dark:text-stone-100">
              Your Wardrobe is Empty
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 font-sans">
              You haven’t saved any curated outfits yet. Head to the Style Studio and craft your first look!
            </p>
          </div>
          <button
            onClick={onGoToStudio}
            className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-rose-900/20"
          >
            Create My First Look ✨
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedLooks.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl glass-card space-y-5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold font-mono">
                    {item.recommendation.match_score}% Match
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-light text-stone-900 dark:text-stone-100">
                  {item.recommendation.title}
                </h3>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {item.preferences.occasion}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {item.preferences.weather}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {item.preferences.color}
                  </span>
                </div>

                {/* Ensemble Preview */}
                <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-700/50 text-xs space-y-1 text-stone-600 dark:text-stone-300">
                  <p className="line-clamp-1">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Top:</span>{' '}
                    {item.recommendation.pieces.top}
                  </p>
                  <p className="line-clamp-1">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Bottom:</span>{' '}
                    {item.recommendation.pieces.bottom}
                  </p>
                  <p className="line-clamp-1">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Shoes:</span>{' '}
                    {item.recommendation.pieces.footwear}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewLook(item)}
                    className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <span>View Look</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onTrySimilar(item.preferences)}
                    className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                    title="Load preferences into Studio"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Try Similar</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(item)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                    title="Copy Look Summary"
                    aria-label="Share Look"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onRemoveLook(item.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 transition-colors"
                    title="Remove from Wardrobe"
                    aria-label="Delete Look"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
