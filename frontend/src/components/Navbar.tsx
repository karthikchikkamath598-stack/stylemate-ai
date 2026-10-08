import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Sun, Moon, Presentation, Menu, X, MessageSquareText } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenChat: () => void;
  onOpenPresentation: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  backendOnline?: boolean;
  totalChunks?: number;
  latencyMs?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenSaved,
  onOpenChat,
  onOpenPresentation,
  darkMode,
  setDarkMode,
  backendOnline = true,
  totalChunks = 112,
  latencyMs = 12,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'studio', label: 'Style Studio' },
    { id: 'looks', label: 'My Looks', badge: savedCount > 0 ? savedCount : null },
    { id: 'explorer', label: 'RAG Explorer' },
    { id: 'how-it-works', label: 'How It Works' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav py-3.5 shadow-md shadow-stone-900/5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Live Backend Connection Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-2 text-left focus:outline-none"
          >
            <span className="font-serif text-2xl tracking-wider font-medium text-stone-900 dark:text-stone-50 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              STYLEMATE
            </span>
            <span className="text-amber-500 font-serif text-xl animate-sparkle">✦</span>
          </button>

          {/* Live RAG Backend Connection Status Pill */}
          <div
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all ${
              backendOnline
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
            }`}
            title={`Backend Status: ${backendOnline ? 'Connected' : 'Offline'} | Latency: ${latencyMs}ms | ChromaDB: ${totalChunks} chunks`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span>{backendOnline ? `Backend Connected (${totalChunks} chunks)` : 'Backend Offline'}</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-200/50 dark:bg-stone-800/50 backdrop-blur-md p-1.5 rounded-full border border-stone-300/60 dark:border-stone-700/60">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-50 shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-100 hover:bg-white/40 dark:hover:bg-stone-700/40'
                }`}
              >
                {link.label}
                {link.badge !== null && link.badge !== undefined && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Ask Stylist Chat */}
          <button
            onClick={onOpenChat}
            className="p-2.5 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            title="Ask your stylist chat"
            aria-label="Ask Stylist"
          >
            <MessageSquareText className="w-4 h-4" />
          </button>

          {/* Presentation Mode button */}
          <button
            onClick={onOpenPresentation}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border border-amber-300 dark:border-amber-600/40 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
            title="FAI College Viva Presentation Mode"
          >
            <Presentation className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>🎤 Presentation Mode</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Saved Looks button */}
          <button
            onClick={onOpenSaved}
            className="relative p-2.5 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            aria-label="Saved Looks"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Primary Style Me Button */}
          <button
            onClick={() => handleNavClick('studio')}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-rose-500/10 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600 group-hover:rotate-12 transition-transform" />
            <span>Style Me ✨</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border border-stone-200 dark:border-stone-800"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-nav border-b border-stone-200 dark:border-stone-800 px-6 py-6 space-y-4 animate-slideDown">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium flex items-center justify-between ${
                  activeTab === link.id
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== null && link.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-rose-500 text-white font-mono">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenPresentation();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs font-medium flex items-center justify-center gap-2"
            >
              <Presentation className="w-4 h-4" />
              <span>🎤 Presentation Mode</span>
            </button>

            <button
              onClick={() => {
                onOpenChat();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium flex items-center justify-center gap-2"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Ask Your Stylist</span>
            </button>

            <button
              onClick={() => handleNavClick('studio')}
              className="w-full py-3 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-600" />
              <span>Style Me ✨</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
