import React from 'react';
import { Sparkles, Database, Cpu, Compass, BookOpen } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenPresentation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenPresentation }) => {
  return (
    <footer className="mt-24 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-100/50 dark:bg-stone-950/50 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-200 dark:border-stone-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl tracking-wider font-light text-stone-900 dark:text-stone-100">
                STYLEMATE
              </span>
              <span className="text-amber-500 font-serif text-xl">✦</span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm leading-relaxed font-sans">
              “Your style. Your mood. Your perfect look.”
              <br />
              An intelligent personal fashion stylist demonstrating Retrieval-Augmented Generation (RAG) for college Fundamentals of AI.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <Database className="w-3 h-3 text-rose-500" /> ChromaDB Vector Store
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <Cpu className="w-3 h-3 text-amber-500" /> all-MiniLM-L6-v2 Embeddings
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-900 dark:text-stone-100">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-rose-500 transition-colors">
                  Home Editorial
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('studio')} className="hover:text-rose-500 transition-colors">
                  Style Studio (Multi-Step)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('looks')} className="hover:text-rose-500 transition-colors">
                  My Saved Looks
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('explorer')} className="hover:text-rose-500 transition-colors">
                  RAG Pipeline Explorer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('how-it-works')} className="hover:text-rose-500 transition-colors">
                  How It Works & Concepts
                </button>
              </li>
            </ul>
          </div>

          {/* Academic / Presentation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-900 dark:text-stone-100">
              FAI Presentation
            </h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li>
                <button
                  onClick={onOpenPresentation}
                  className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Launch Presentation Mode
                </button>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                <BookOpen className="w-3.5 h-3.5" /> 21 Curated Knowledge Files
              </li>
              <li className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                <Compass className="w-3.5 h-3.5" /> Cosine Similarity Ranking
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-stone-500 gap-4">
          <div>
            © {new Date().getFullYear()} STYLEMATE AI — College Fundamentals of Artificial Intelligence Project.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>RAG Engine Active</span>
            </span>
            <span>•</span>
            <span>Zero API Key Exposure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
