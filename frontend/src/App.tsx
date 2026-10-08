import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Toast } from './components/Toast';
import { ChatStylistModal } from './components/ChatStylistModal';
import { PresentationModeModal } from './components/PresentationModeModal';

import { Home } from './pages/Home';
import { StyleStudio } from './pages/StyleStudio';
import { ResultView } from './pages/ResultView';
import { MyLooks } from './pages/MyLooks';
import { RagExplorer } from './pages/RagExplorer';
import { HowItWorks } from './pages/HowItWorks';

import type { UserPreferences, OutfitRecommendation, SavedLook } from './types';
import { requestRecommendation, fetchHealth } from './services/api';

const defaultPreferences: UserPreferences = {
  occasion: 'College',
  weather: 'Hot',
  style: 'Trendy',
  color: 'Black',
  outfit_type: 'Western',
  comfort: 'Balanced',
  personal_note: '',
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('stylemate_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('stylemate_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const [backendStatus, setBackendStatus] = useState<{ online: boolean; totalChunks: number; latencyMs: number }>({
    online: true,
    totalChunks: 112,
    latencyMs: 12,
  });

  // Load saved looks from localStorage on initial render and poll backend health
  useEffect(() => {
    try {
      const stored = localStorage.getItem('stylemate_saved_looks');
      if (stored) {
        setSavedLooks(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load saved looks:', e);
    }

    // Verify backend connectivity
    const checkConnection = () => {
      fetchHealth().then((health) => {
        setBackendStatus({
          online: health.status === 'healthy',
          totalChunks: health.total_chunks || 112,
          latencyMs: health.latency_ms || 12,
        });
      });
    };
    checkConnection();
    const interval = setInterval(checkConnection, 12000);
    return () => clearInterval(interval);
  }, []);

  // Save looks persistence
  const saveLookToStorage = (lookToSave: SavedLook) => {
    const updated = [lookToSave, ...savedLooks.filter((l) => l.id !== lookToSave.id)];
    setSavedLooks(updated);
    localStorage.setItem('stylemate_saved_looks', JSON.stringify(updated));
  };

  const removeLookFromStorage = (id: string) => {
    const updated = savedLooks.filter((l) => l.id !== id);
    setSavedLooks(updated);
    localStorage.setItem('stylemate_saved_looks', JSON.stringify(updated));
    setToast({ message: 'Look removed from your wardrobe', type: 'info' });
  };

  // Submit preferences to RAG pipeline
  const handleCreateLook = async () => {
    setIsLoading(true);
    try {
      const result = await requestRecommendation(preferences);
      setRecommendation(result);
      setActiveTab('result');

      // Trigger celebratory confetti on recommendation receipt
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#C4727A', '#D4AF37', '#FAF8F5'],
        });
      } catch (err) {
        // Ignore if canvas is not supported
      }
    } catch (error: any) {
      console.error('Error curating look:', error);
      setToast({
        message: error.message || 'Failed to curate recommendation. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCurrentLook = () => {
    if (!recommendation) return;
    const newLook: SavedLook = {
      id: `look_${Date.now()}`,
      date: new Date().toISOString(),
      preferences: { ...preferences },
      recommendation: { ...recommendation },
    };
    saveLookToStorage(newLook);
    setToast({ message: 'Look saved to your personal wardrobe! ♡', type: 'success' });
  };

  const handleLaunchDemoPreset = (preset: 'college' | 'wedding' | 'interview') => {
    if (preset === 'college') {
      setPreferences({
        occasion: 'College',
        weather: 'Hot',
        style: 'Trendy',
        color: 'Black',
        outfit_type: 'Western',
        comfort: 'Balanced',
        personal_note: 'I want something trendy but comfortable for college.',
      });
    } else if (preset === 'wedding') {
      setPreferences({
        occasion: 'Wedding',
        weather: 'Warm',
        style: 'Elegant',
        color: 'Pink',
        outfit_type: 'Traditional',
        comfort: 'Balanced',
        personal_note: 'Attending a close friend’s royal wedding ceremony.',
      });
    } else {
      setPreferences({
        occasion: 'Interview',
        weather: 'Warm',
        style: 'Minimal',
        color: 'Blue',
        outfit_type: 'Western',
        comfort: 'Balanced',
        personal_note: 'Corporate tech interview. Looking for confident professional poise.',
      });
    }
    setActiveTab('studio');
    setToast({ message: `Loaded ${preset.toUpperCase()} demo scenario!`, type: 'info' });
  };

  const isCurrentLookSaved = Boolean(
    recommendation &&
      savedLooks.some((l) => l.recommendation.title === recommendation.title && l.preferences.occasion === preferences.occasion)
  );

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedLooks.length}
        onOpenSaved={() => setActiveTab('looks')}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        backendOnline={backendStatus.online}
        totalChunks={backendStatus.totalChunks}
        latencyMs={backendStatus.latencyMs}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 pt-20">
        {activeTab === 'home' && (
          <Home
            onStartStyling={() => setActiveTab('studio')}
            onExploreHowItWorks={() => setActiveTab('how-it-works')}
            onLaunchDemo={handleLaunchDemoPreset}
          />
        )}

        {activeTab === 'studio' && (
          <StyleStudio
            preferences={preferences}
            setPreferences={setPreferences}
            onSubmit={handleCreateLook}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'result' && recommendation && (
          <ResultView
            recommendation={recommendation}
            preferences={preferences}
            onSaveLook={handleSaveCurrentLook}
            isSaved={isCurrentLookSaved}
            onInspectRag={() => setActiveTab('explorer')}
            onRecreate={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'looks' && (
          <MyLooks
            savedLooks={savedLooks}
            onRemoveLook={removeLookFromStorage}
            onViewLook={(look) => {
              setPreferences(look.preferences);
              setRecommendation(look.recommendation);
              setActiveTab('result');
            }}
            onTrySimilar={(prefs) => {
              setPreferences(prefs);
              setActiveTab('studio');
            }}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'explorer' && (
          <RagExplorer lastRecommendation={recommendation} />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorks
            onGoToStudio={() => setActiveTab('studio')}
            onOpenPresentation={() => setIsPresentationOpen(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Loading Overlay with 4 animated steps */}
      {isLoading && <LoadingOverlay />}

      {/* Chat Stylist Modal */}
      <ChatStylistModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Viva Presentation Mode Modal */}
      <PresentationModeModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        onLaunchDemo={handleLaunchDemoPreset}
      />

      {/* Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
