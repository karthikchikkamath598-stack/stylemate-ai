import React, { useState } from 'react';
import {
  GraduationCap,
  Coffee,
  PartyPopper,
  Gem,
  Briefcase,
  Heart,
  Flame,
  Plane,
  Sun,
  CloudSun,
  Snowflake,
  CloudRain,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Wand2,
} from 'lucide-react';
import type { UserPreferences } from '../types';

interface StyleStudioProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const occasions = [
  { id: 'College', label: 'College', icon: GraduationCap, desc: 'Comfortable everyday academic style' },
  { id: 'Casual', label: 'Casual', icon: Coffee, desc: 'Relaxed chic for coffee and errands' },
  { id: 'Party', label: 'Party', icon: PartyPopper, desc: 'High energy glamour and celebration' },
  { id: 'Wedding', label: 'Wedding', icon: Gem, desc: 'Royal luxury, ornate craft & elegance' },
  { id: 'Interview', label: 'Interview', icon: Briefcase, desc: 'Sharp tailoring & executive poise' },
  { id: 'Date', label: 'Date', icon: Heart, desc: 'Romantic allure with subtle charm' },
  { id: 'Festival', label: 'Festival', icon: Flame, desc: 'Vibrant cultural heritage & joy' },
  { id: 'Travel', label: 'Travel', icon: Plane, desc: 'Functional transit & wrinkle-free comfort' },
];

const weathers = [
  { id: 'Hot', label: 'Hot', icon: Sun, desc: '32°C+ • Cooling linen & mulmul' },
  { id: 'Warm', label: 'Warm', icon: CloudSun, desc: '22°C-28°C • Breezy light layers' },
  { id: 'Cold', label: 'Cold', icon: Snowflake, desc: '10°C-18°C • Tailored wool & knits' },
  { id: 'Rainy', label: 'Rainy', icon: CloudRain, desc: 'Monsoon • Waterproof & quick-dry' },
];

const styles = [
  { id: 'Minimal', label: 'Minimal', desc: 'Clean, effortless & timeless silhouettes' },
  { id: 'Trendy', label: 'Trendy', desc: 'Current, confident & street-smart' },
  { id: 'Elegant', label: 'Elegant', desc: 'Polished, refined & graceful tailoring' },
  { id: 'Traditional', label: 'Traditional', desc: 'Classic South Asian heritage textiles' },
  { id: 'Casual', label: 'Casual', desc: 'Relaxed, laid-back & unpretentious' },
  { id: 'Sporty', label: 'Sporty', desc: 'Active, functional & athleisure luxe' },
];

const colors = [
  { id: 'Black', name: 'Black', hex: '#1C1917', border: 'border-stone-700' },
  { id: 'White', name: 'White', hex: '#FFFFFF', border: 'border-stone-300' },
  { id: 'Blue', name: 'Blue', hex: '#2563EB', border: 'border-blue-500' },
  { id: 'Pink', name: 'Pink', hex: '#EC4899', border: 'border-pink-500' },
  { id: 'Red', name: 'Red', hex: '#DC2626', border: 'border-red-500' },
  { id: 'Green', name: 'Green', hex: '#10B981', border: 'border-emerald-500' },
  { id: 'Purple', name: 'Purple', hex: '#8B5CF6', border: 'border-purple-500' },
  { id: 'Beige', name: 'Beige', hex: '#D6C7B2', border: 'border-amber-400' },
  { id: 'Brown', name: 'Brown', hex: '#78350F', border: 'border-amber-800' },
  { id: 'Any', name: 'Any / Neutrals', hex: 'conic-gradient(from 180deg at 50% 50%, #DC2626 0deg, #F59E0B 72deg, #10B981 144deg, #3B82F6 216deg, #8B5CF6 288deg, #DC2626 360deg)', border: 'border-stone-400' },
];

const outfitTypes = [
  { id: 'Western', label: 'Western', desc: 'Contemporary blazers, denim & dresses' },
  { id: 'Traditional', label: 'Traditional', desc: 'Sarees, anarkalis, kurtas & lehengas' },
  { id: 'Indo-Western', label: 'Indo-Western', desc: 'Fusion kurtis with denim or capes' },
  { id: 'Any', label: 'Any', desc: 'Let StyleMate decide best silhouette' },
];

const comfortLevels = [
  { id: 'Maximum Comfort', label: '☁ Maximum Comfort', subtitle: '“Easy all day”', desc: 'Relaxed cuts, ultra-soft fibers, zero restriction' },
  { id: 'Balanced', label: '⚖ Balanced', subtitle: '“Comfort + style”', desc: 'The golden mean of structure and movement' },
  { id: 'Fashion First', label: '✨ Fashion First', subtitle: '“Make a statement”', desc: 'Sculptural silhouette & editorial impact prioritized' },
];

export const StyleStudio: React.FC<StyleStudioProps> = ({
  preferences,
  setPreferences,
  onSubmit,
  isLoading,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const loadPreset = (preset: 'college' | 'wedding' | 'interview') => {
    if (preset === 'college') {
      setPreferences({
        occasion: 'College',
        weather: 'Hot',
        style: 'Trendy',
        color: 'Black',
        outfit_type: 'Western',
        comfort: 'Balanced',
        personal_note: 'I want something trendy but comfortable for college lectures. I love black.',
      });
    } else if (preset === 'wedding') {
      setPreferences({
        occasion: 'Wedding',
        weather: 'Warm',
        style: 'Elegant',
        color: 'Pink',
        outfit_type: 'Traditional',
        comfort: 'Balanced',
        personal_note: 'Attending a close friend’s royal wedding ceremony. Need graceful traditional jewelry.',
      });
    } else {
      setPreferences({
        occasion: 'Interview',
        weather: 'Warm',
        style: 'Minimal',
        color: 'Blue',
        outfit_type: 'Western',
        comfort: 'Balanced',
        personal_note: 'Corporate tech interview. Looking for confident professional poise without feeling stiff.',
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title & Subtitle Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20">
          ✦ STYLE STUDIO STUDIO
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-stone-900 dark:text-stone-50">
          “Let’s create your look.”
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-base font-light font-sans">
          Tell me a little about your day.
        </p>

        {/* Demo Presets Bar */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-stone-500 dark:text-stone-400">FAI Viva Presets:</span>
          <button
            type="button"
            onClick={() => loadPreset('college')}
            className="px-3 py-1.5 rounded-full text-xs border border-stone-300 dark:border-stone-700 hover:border-rose-400 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors shadow-sm"
          >
            🎓 College (Hot + Trendy + Black)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('wedding')}
            className="px-3 py-1.5 rounded-full text-xs border border-stone-300 dark:border-stone-700 hover:border-rose-400 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors shadow-sm"
          >
            💍 Wedding (Warm + Elegant + Traditional)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('interview')}
            className="px-3 py-1.5 rounded-full text-xs border border-stone-300 dark:border-stone-700 hover:border-rose-400 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors shadow-sm"
          >
            💼 Interview (Warm + Minimal + Professional)
          </button>
        </div>
      </div>

      {/* Animated Step Progress Indicator */}
      <div className="p-4 rounded-3xl glass-card space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-stone-500 dark:text-stone-400 px-2 overflow-x-auto gap-4">
          <span className={currentStep >= 1 ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>01 Occasion</span>
          <span className={currentStep >= 2 ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>02 Weather</span>
          <span className={currentStep >= 3 ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>03 Style</span>
          <span className={currentStep >= 4 ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>04 Color</span>
          <span className={currentStep >= 5 ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>05 Silhouette</span>
          <span className={currentStep >= 6 ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>06 Comfort</span>
        </div>
        <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Multi-Step Body */}
      <div className="min-h-[440px]">
        {/* STEP 01 — OCCASION */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-left space-y-1">
              <span className="text-xs font-mono text-rose-500 tracking-wider uppercase">Step 01</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-light">
                “Where are you headed?”
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {occasions.map((item) => {
                const Icon = item.icon;
                const isSelected = preferences.occasion === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, occasion: item.id })}
                    className={`relative p-5 rounded-2xl text-left border transition-all duration-300 ${
                      isSelected
                        ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 shadow-md shadow-rose-900/10 -translate-y-1'
                        : 'glass-card hover:-translate-y-0.5'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                      {item.label}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 02 — WEATHER */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-left space-y-1">
              <span className="text-xs font-mono text-rose-500 tracking-wider uppercase">Step 02</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-light">
                “What’s the weather feeling like?”
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {weathers.map((item) => {
                const Icon = item.icon;
                const isSelected = preferences.weather === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, weather: item.id })}
                    className={`relative p-5 rounded-2xl text-left border transition-all duration-300 ${
                      isSelected
                        ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 shadow-md shadow-rose-900/10 -translate-y-1'
                        : 'glass-card hover:-translate-y-0.5'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-amber-500 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                      {item.label}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 03 — STYLE PERSONALITY */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-left space-y-1">
              <span className="text-xs font-mono text-rose-500 tracking-wider uppercase">Step 03</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-light">
                “What’s your style mood?”
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {styles.map((item) => {
                const isSelected = preferences.style === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, style: item.id })}
                    className={`relative p-6 rounded-2xl text-left border transition-all duration-300 ${
                      isSelected
                        ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 shadow-md shadow-rose-900/10 -translate-y-1'
                        : 'glass-card hover:-translate-y-0.5'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    <div className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                      {item.label}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 04 — COLOR */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-left space-y-1">
              <span className="text-xs font-mono text-rose-500 tracking-wider uppercase">Step 04</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-light">
                “What color are you feeling?”
              </h2>
            </div>

            <div className="p-6 rounded-3xl glass-card space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-6">
                {colors.map((c) => {
                  const isSelected = preferences.color === c.id;
                  return (
                    <div key={c.id} className="flex flex-col items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreferences({ ...preferences, color: c.id })}
                        title={c.name}
                        className={`w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center shadow-md relative ${
                          c.border
                        } ${
                          isSelected
                            ? 'scale-110 ring-4 ring-rose-500/30 border-rose-500'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          background: c.hex.startsWith('conic') ? c.hex : c.hex,
                        }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-5 h-5 ${
                              c.id === 'White' || c.id === 'Beige' ? 'text-stone-900' : 'text-white'
                            }`}
                          />
                        )}
                      </button>
                      <span
                        className={`text-xs transition-colors ${
                          isSelected
                            ? 'font-bold text-rose-600 dark:text-rose-400'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {c.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center text-xs text-stone-500 dark:text-stone-400">
                Selected: <span className="font-medium text-stone-900 dark:text-stone-100">{preferences.color}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 05 — OUTFIT TYPE */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-left space-y-1">
              <span className="text-xs font-mono text-rose-500 tracking-wider uppercase">Step 05</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-light">
                “Choose your silhouette preference”
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {outfitTypes.map((item) => {
                const isSelected = preferences.outfit_type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, outfit_type: item.id })}
                    className={`relative p-5 rounded-2xl text-left border transition-all duration-300 ${
                      isSelected
                        ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 shadow-md shadow-rose-900/10 -translate-y-1'
                        : 'glass-card hover:-translate-y-0.5'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    <div className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                      {item.label}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 06 — COMFORT & PERSONAL MESSAGE */}
        {currentStep === 6 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-left space-y-1">
              <span className="text-xs font-mono text-rose-500 tracking-wider uppercase">Step 06</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-light">
                “How do you want to feel?”
              </h2>
            </div>

            {/* Comfort Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comfortLevels.map((item) => {
                const isSelected = preferences.comfort === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, comfort: item.id })}
                    className={`relative p-6 rounded-2xl text-left border transition-all duration-300 ${
                      isSelected
                        ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 shadow-md shadow-rose-900/10 -translate-y-1'
                        : 'glass-card hover:-translate-y-0.5'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    <div className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                      {item.label}
                    </div>
                    <div className="text-xs font-medium text-rose-500 mt-1">
                      {item.subtitle}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Personal Message Textarea */}
            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  “Tell your stylist anything else.”
                </label>
                <span className="text-xs font-mono text-stone-400">
                  {preferences.personal_note.length}/300 chars
                </span>
              </div>
              <textarea
                value={preferences.personal_note}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    personal_note: e.target.value.slice(0, 300),
                  })
                }
                rows={3}
                placeholder="“I want something trendy but comfortable for college. I love black and don’t want anything too complicated.”"
                className="w-full p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-30 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-rose-600 transition-colors"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold tracking-wider uppercase shadow-xl shadow-rose-900/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4 text-amber-300 animate-spin" />
            <span>✨ CREATE MY LOOK</span>
          </button>
        )}
      </div>
    </div>
  );
};
