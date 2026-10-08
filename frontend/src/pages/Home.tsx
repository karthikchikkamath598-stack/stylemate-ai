import { Sparkles, ArrowRight, Heart, CloudSun, Palette, Brain } from 'lucide-react';
import { FashionVisual } from '../components/FashionVisual';

interface HomeProps {
  onStartStyling: () => void;
  onExploreHowItWorks: () => void;
  onLaunchDemo: (scenario: 'college' | 'wedding' | 'interview') => void;
}

export const Home: React.FC<HomeProps> = ({
  onStartStyling,
  onExploreHowItWorks,
  onLaunchDemo,
}) => {
  return (
    <div className="space-y-28 pt-8">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center">
        {/* Ambient background glows */}
        <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-rose-200/30 dark:bg-rose-950/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-amber-200/30 dark:bg-amber-950/20 blur-3xl pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-rose-500/10 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300/40 dark:border-rose-800/40">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              ✦ AI PERSONAL STYLIST
            </div>

            {/* Main Editorial Heading */}
            <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-light text-stone-900 dark:text-stone-50 leading-[1.08] tracking-tight">
              Style isn’t <br />
              just what you wear. <br />
              It’s{' '}
              <span className="font-normal italic bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
                how you feel.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed font-sans font-light">
              Tell StyleMate where you’re going, what you’re feeling, and the style you love. Your personal AI stylist will curate the perfect look grounded in real fashion theory.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartStyling}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-semibold tracking-wider uppercase hover:shadow-xl hover:shadow-rose-900/10 hover:bg-rose-700 dark:hover:bg-rose-200 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-600 group-hover:rotate-12 transition-transform" />
                <span>✨ Style Me</span>
              </button>

              <button
                onClick={onExploreHowItWorks}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-stone-300 dark:border-stone-700 bg-white/40 dark:bg-stone-900/40 text-stone-800 dark:text-stone-200 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <span>Explore How It Works</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Demo Quickstarts */}
            <div className="pt-4 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span>Quick Presets:</span>
              <button
                onClick={() => onLaunchDemo('college')}
                className="px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-800 hover:border-rose-400 text-stone-700 dark:text-stone-300 transition-colors"
              >
                🎓 College
              </button>
              <button
                onClick={() => onLaunchDemo('wedding')}
                className="px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-800 hover:border-rose-400 text-stone-700 dark:text-stone-300 transition-colors"
              >
                💍 Wedding
              </button>
              <button
                onClick={() => onLaunchDemo('interview')}
                className="px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-800 hover:border-rose-400 text-stone-700 dark:text-stone-300 transition-colors"
              >
                💼 Interview
              </button>
            </div>
          </div>

          {/* Right Column: Premium Fashion Composition with Floating Cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Center Visual */}
            <div className="w-full max-w-md sm:max-w-lg transition-transform duration-500 hover:scale-[1.01]">
              <FashionVisual
                title="The Modern Minimalist"
                category="College"
                style="Minimal"
                colorName="Black & Ivory"
                outfitType="Western"
                isFavorite={true}
              />
            </div>

            {/* Floating Card 1: Match Score & StyleMate Pick */}
            <div className="absolute -top-6 -left-2 sm:-left-8 p-4 rounded-2xl glass-card shadow-2xl animate-float max-w-[210px] hidden sm:block">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-rose-500 mb-1">
                <span>STYLEMATE’S PICK</span>
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl font-light text-stone-900 dark:text-stone-100">
                  94%
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                  MATCH
                </span>
              </div>
              <div className="text-xs font-medium text-stone-800 dark:text-stone-200 mt-0.5">
                Modern Minimal Look
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                College • Warm • Trendy
              </div>
            </div>

            {/* Floating Card 2: Weather Smart */}
            <div className="absolute -bottom-6 -right-2 sm:-right-6 p-4 rounded-2xl glass-card shadow-2xl animate-float-delayed flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  ☀ 28°C Warm
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  Light & breathable fabrics
                </div>
              </div>
            </div>

            {/* Floating Card 3: Personalization Badge */}
            <div className="absolute top-1/2 -right-4 sm:-right-8 p-3 rounded-2xl glass-card shadow-lg hidden md:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[11px] font-medium text-stone-800 dark:text-stone-200">
                ✦ Personalized for you
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 dark:text-stone-100">
            “A stylist that actually gets you.”
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base font-light font-sans">
            From occasion to accessories, StyleMate thinks through every detail using external fashion knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl glass-card space-y-4 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
              ✨ Personalized
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Recommendations uniquely shaped by your exact occasion, comfort level, and personal style persona.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl glass-card space-y-4 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <CloudSun className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
              🌤 Weather Smart
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Calculates textile thermal conductivity, breathability, and layering to adapt to hot, rainy, or chilly days.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl glass-card space-y-4 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
              🎨 Color Intelligent
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Builds balanced 60-30-10 palettes, matching chosen shades with complementary neutrals and accents.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl glass-card space-y-4 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
              🧠 RAG Powered
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Retrieves verified knowledge across 21 styling guides before generating, eliminating hallucinations.
            </p>
          </div>
        </div>
      </section>

      {/* EDITORIAL QUOTE BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20">
            ✦ THE STYLEMATE PHILOSOPHY
          </div>

          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-light italic leading-snug max-w-2xl mx-auto">
            “True elegance is not about having an overflowing wardrobe. It is knowing how to compose each piece with intention.”
          </blockquote>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onStartStyling}
              className="px-8 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-lg shadow-rose-900/40"
            >
              Start Your Look Creation →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
