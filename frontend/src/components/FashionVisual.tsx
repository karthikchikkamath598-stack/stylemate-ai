import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface FashionVisualProps {
  title: string;
  category: string;
  style: string;
  colorName: string;
  outfitType?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  className?: string;
}

// Sophisticated fashion color maps for editorial cards
const colorThemes: Record<string, { bg: string; text: string; accent: string; badge: string }> = {
  black: { bg: 'from-zinc-900 via-stone-800 to-black', text: 'text-zinc-100', accent: '#E4E4E7', badge: 'bg-zinc-800 text-zinc-200' },
  white: { bg: 'from-amber-50 via-stone-100 to-rose-50', text: 'text-stone-900', accent: '#D4AF37', badge: 'bg-white/90 text-stone-800 shadow-sm' },
  blue: { bg: 'from-slate-900 via-sky-950 to-blue-900', text: 'text-sky-100', accent: '#93C5FD', badge: 'bg-sky-900/60 text-sky-200' },
  pink: { bg: 'from-rose-950 via-pink-900 to-stone-900', text: 'text-pink-100', accent: '#F472B6', badge: 'bg-rose-900/60 text-pink-200' },
  red: { bg: 'from-rose-950 via-red-950 to-stone-950', text: 'text-rose-100', accent: '#FDA4AF', badge: 'bg-red-900/60 text-red-200' },
  green: { bg: 'from-emerald-950 via-stone-900 to-teal-950', text: 'text-emerald-100', accent: '#6EE7B7', badge: 'bg-emerald-900/60 text-emerald-200' },
  purple: { bg: 'from-purple-950 via-violet-900 to-stone-900', text: 'text-purple-100', accent: '#C084FC', badge: 'bg-purple-900/60 text-purple-200' },
  beige: { bg: 'from-amber-950 via-stone-800 to-yellow-950', text: 'text-amber-100', accent: '#FDE68A', badge: 'bg-amber-900/60 text-amber-200' },
  brown: { bg: 'from-stone-950 via-amber-950 to-stone-900', text: 'text-amber-100', accent: '#D97706', badge: 'bg-stone-900/80 text-amber-200' },
};

export const FashionVisual: React.FC<FashionVisualProps> = ({
  title,
  category,
  style,
  colorName,
  outfitType = 'Western',
  isFavorite = false,
  onToggleFavorite,
  className = '',
}) => {
  const normColor = colorName.toLowerCase().trim();
  const matchedKey = Object.keys(colorThemes).find((k) => normColor.includes(k)) || 'black';
  const theme = colorThemes[matchedKey];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.bg} p-6 sm:p-8 shadow-2xl transition-all duration-500 hover:shadow-rose-900/10 ${className}`}
      style={{ minHeight: '380px' }}
    >
      {/* Editorial Background Texture and Subtle Geometric Gradients */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase backdrop-blur-md bg-white/10 text-white/90 border border-white/10">
            <Sparkles className="w-3 h-3 text-amber-300" />
            VOGUE × STYLEMATE
          </span>
          <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider text-white/60">
            AUTUMN / SPRING EDIT
          </span>
        </div>

        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            aria-label="Save Look"
            className="p-2.5 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 text-white transition-transform active:scale-90"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </button>
        )}
      </div>

      {/* Editorial Silhouette & Typography centerpiece */}
      <div className="relative z-10 mt-12 mb-8 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wider uppercase ${theme.badge}`}>
            {outfitType}
          </span>
          <span className="text-xs tracking-wider uppercase text-white/70">
            {category} • {style}
          </span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight tracking-tight">
          {title}
        </h3>

        <p className="mt-3 text-sm text-white/80 max-w-md font-sans">
          Curated with <span className="font-medium text-amber-200 capitalize">{colorName}</span> tonal harmony, engineered for optimal movement and confidence.
        </p>
      </div>

      {/* Editorial Bottom Watermark / Details */}
      <div className="relative z-10 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between text-xs text-white/70">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>RAG Verified Balance</span>
          </div>
          <span>•</span>
          <span className="capitalize">{style} Silhouette</span>
        </div>
        <div className="text-[11px] tracking-widest uppercase font-mono text-white/50">
          N° {category.toUpperCase()}-01
        </div>
      </div>
    </div>
  );
};
