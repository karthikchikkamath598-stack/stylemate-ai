import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Palette,
  Gem,
  Database,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import type { OutfitRecommendation, UserPreferences } from '../types';
import { FashionVisual } from '../components/FashionVisual';
import { MatchScoreCircle } from '../components/MatchScoreCircle';

interface ResultViewProps {
  recommendation: OutfitRecommendation;
  preferences: UserPreferences;
  onSaveLook: () => void;
  isSaved: boolean;
  onInspectRag: () => void;
  onRecreate: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  recommendation,
  preferences,
  onSaveLook,
  isSaved,
  onInspectRag,
  onRecreate,
}) => {
  const [whyExpanded, setWhyExpanded] = useState(true);
  const [activeAltIndex, setActiveAltIndex] = useState<number | null>(null);

  // If user selected an alternative look, display those pieces
  const currentPieces =
    activeAltIndex !== null
      ? recommendation.alternative_looks[activeAltIndex].pieces
      : recommendation.pieces;

  const currentTitle =
    activeAltIndex !== null
      ? recommendation.alternative_looks[activeAltIndex].name
      : recommendation.title;

  const currentScore =
    activeAltIndex !== null
      ? recommendation.alternative_looks[activeAltIndex].match_score
      : recommendation.match_score;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {recommendation.mode}
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-stone-900 dark:text-stone-50">
          “Your look has arrived.”
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-base font-light font-sans">
          Curated by StyleMate AI • Augmented by 112 fashion knowledge vectors.
        </p>

        {/* Action button bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onSaveLook}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 ${
              isSaved
                ? 'bg-rose-500 text-white shadow-rose-900/30'
                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : 'text-rose-500'}`} />
            <span>{isSaved ? 'Saved in Wardrobe ♡' : 'Save Look'}</span>
          </button>

          <button
            onClick={onInspectRag}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
          >
            <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>🔍 Inspect in RAG Explorer</span>
          </button>

          <button
            onClick={onRecreate}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Re-style</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editorial Fashion Visual */}
        <div className="lg:col-span-5 space-y-4">
          <FashionVisual
            title={currentTitle}
            category={preferences.occasion}
            style={preferences.style}
            colorName={preferences.color}
            outfitType={preferences.outfit_type}
            isFavorite={isSaved}
            onToggleFavorite={onSaveLook}
          />

          {/* Quick summary card */}
          <div className="p-5 rounded-2xl glass-card space-y-2 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex justify-between">
              <span className="font-semibold text-stone-800 dark:text-stone-200">Occasion:</span>
              <span>{preferences.occasion}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-stone-800 dark:text-stone-200">Weather Adaptation:</span>
              <span>{preferences.weather}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-stone-800 dark:text-stone-200">Silhouette Type:</span>
              <span>{preferences.outfit_type}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Look Breakdown & Pieces */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Look Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-6 border-rose-500/20">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500">
                  {activeAltIndex !== null ? 'ALTERNATIVE VARIANT' : 'PRIMARY CURATION'}
                </span>
                <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100 mt-0.5">
                  {currentTitle}
                </h2>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold text-sm">
                {currentScore}% Preference Match
              </div>
            </div>

            {/* Pieces Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                ✦ THE LOOK ENSEMBLE
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Top */}
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    👕 Top / Primary
                  </span>
                  <div className="text-sm font-serif font-medium text-stone-900 dark:text-stone-100">
                    {currentPieces.top}
                  </div>
                </div>

                {/* Bottom */}
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    👖 Bottom / Silhouette
                  </span>
                  <div className="text-sm font-serif font-medium text-stone-900 dark:text-stone-100">
                    {currentPieces.bottom}
                  </div>
                </div>

                {/* Footwear */}
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    👟 Footwear
                  </span>
                  <div className="text-sm font-serif font-medium text-stone-900 dark:text-stone-100">
                    {currentPieces.footwear}
                  </div>
                </div>

                {/* Bag */}
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    👜 Bag & Carry
                  </span>
                  <div className="text-sm font-serif font-medium text-stone-900 dark:text-stone-100">
                    {currentPieces.bag}
                  </div>
                </div>

                {/* Accessories */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    💍 Curated Accessories
                  </span>
                  <div className="text-sm font-serif font-medium text-stone-900 dark:text-stone-100">
                    {currentPieces.accessories}
                  </div>
                </div>

                {/* Layer if exists */}
                {currentPieces.layer && (
                  <div className="sm:col-span-2 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
                    <span className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      🧥 Layer / Outerwear
                    </span>
                    <div className="text-sm font-serif font-medium text-stone-900 dark:text-stone-100">
                      {currentPieces.layer}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stylist Quote Note */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 dark:from-stone-900 dark:to-stone-950 border border-rose-200/60 dark:border-stone-800 space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> ✦ Stylist’s Note
              </span>
              <p className="font-editorial text-lg italic text-stone-800 dark:text-stone-200 leading-relaxed">
                {recommendation.stylist_note}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MATCH SCORE BREAKDOWN SECTION */}
      <section className="space-y-4">
        <h3 className="font-serif text-2xl font-light text-stone-900 dark:text-stone-100">
          Preference Match Evaluation
        </h3>
        <MatchScoreCircle
          score={recommendation.match_score}
          breakdown={recommendation.score_breakdown}
        />
      </section>

      {/* WHY THIS LOOK SECTION */}
      <section className="p-6 sm:p-8 rounded-3xl glass-card space-y-4">
        <button
          onClick={() => setWhyExpanded(!whyExpanded)}
          className="w-full flex items-center justify-between text-left focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-light text-stone-900 dark:text-stone-100">
                🧠 Why StyleMate Chose This
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Ground truth reasoning derived from retrieved fashion documents
              </p>
            </div>
          </div>
          {whyExpanded ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
        </button>

        {whyExpanded && (
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-200 dark:border-stone-800">
            {recommendation.why_stylemate_chose_this.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/40 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {item.aspect}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* STYLE TIPS SECTION */}
      <section className="space-y-4">
        <h3 className="font-serif text-2xl font-light text-stone-900 dark:text-stone-100">
          Editorial Fashion Directives
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Styling Tip */}
          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              💡 Styling Tip
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {recommendation.tips.styling}
            </p>
          </div>

          {/* Color Tip */}
          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              🎨 Color Harmony Tip
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {recommendation.tips.color}
            </p>
          </div>

          {/* Accessory Tip */}
          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <Gem className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              ✨ Accessory Tip
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {recommendation.tips.accessory}
            </p>
          </div>
        </div>
      </section>

      {/* ALTERNATIVE LOOKS: Three ways to wear it */}
      {recommendation.alternative_looks && recommendation.alternative_looks.length > 0 && (
        <section className="space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-rose-500">
              VERSATILE CAPSULE
            </span>
            <h3 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100">
              “Three ways to wear it.”
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Look Card */}
            <div
              className={`p-6 rounded-3xl border transition-all ${
                activeAltIndex === null
                  ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 shadow-lg'
                  : 'glass-card'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-rose-500">LOOK 01 — Best Match</span>
                <span className="font-mono">{recommendation.match_score}%</span>
              </div>
              <h4 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                {recommendation.title}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2">
                The primary high-relevance curation engineered for your parameters.
              </p>
              <button
                onClick={() => setActiveAltIndex(null)}
                className="mt-4 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline"
              >
                <span>{activeAltIndex === null ? 'Active Look ✓' : 'View Look →'}</span>
              </button>
            </div>

            {/* Alternative Looks */}
            {recommendation.alternative_looks.map((alt, idx) => (
              <div
                key={alt.id}
                className={`p-6 rounded-3xl border transition-all ${
                  activeAltIndex === idx
                    ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 shadow-lg'
                    : 'glass-card'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-amber-500">{alt.badge}</span>
                  <span className="font-mono">{alt.match_score}%</span>
                </div>
                <h4 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                  {alt.name}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2">
                  {alt.short_desc}
                </p>
                <button
                  onClick={() => setActiveAltIndex(idx)}
                  className="mt-4 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline"
                >
                  <span>{activeAltIndex === idx ? 'Active Look ✓' : 'View Look →'}</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
