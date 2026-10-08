import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, BookOpen, Database, Cpu, MessageSquare, Lightbulb } from 'lucide-react';

interface PresentationModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDemo: (scenario: 'college' | 'wedding' | 'interview') => void;
}

const pipelineSteps = [
  {
    step: '01',
    title: 'User Input & Preferences',
    badge: 'STAGE 1: INPUT',
    icon: MessageSquare,
    summary: 'The user selects their occasion, weather, style personality, color preference, and optional notes.',
    technicalDetails: 'Extracts discrete categorical constraints (Occasion, Weather, Style, Color, Comfort) + freeform personal query.',
    vivaTalkingPoint: '“In traditional AI, inputs are often rigid. StyleMate allows multi-dimensional personal preferences paired with natural language desires.”',
    example: 'Occasion: College | Weather: Hot | Style: Trendy | Color: Black | Note: "Need something trendy but comfy for long classes."',
  },
  {
    step: '02',
    title: 'Natural Language Query Formulation',
    badge: 'STAGE 2: NLP QUERY',
    icon: Sparkles,
    summary: 'The system synthesizes structured preferences into an information-dense semantic retrieval query.',
    technicalDetails: 'Converts multi-attribute metadata into an optimal search query: "trendy comfortable western college outfit black hot weather breathable fabrics".',
    vivaTalkingPoint: '“Query formulation bridges tabular user preferences with unconstrained semantic fashion knowledge representation.”',
    example: '“trendy comfortable western college outfit black hot weather breathable fabrics”',
  },
  {
    step: '03',
    title: 'Vector Embedding Generation',
    badge: 'STAGE 3: EMBEDDINGS',
    icon: Cpu,
    summary: 'The semantic query text is converted into a high-dimensional dense numerical vector (384 floating-point dimensions).',
    technicalDetails: 'Uses sentence-transformers / ONNX all-MiniLM-L6-v2 model mapping natural language tokens to 384-dimensional Euclidean vector space.',
    vivaTalkingPoint: '“An embedding maps semantic meaning into numbers. Words with similar fashion contexts (like \'breezy\' and \'cotton\') sit close together in this mathematical space.”',
    example: 'Vector: [0.038, 0.412, -0.187, 0.654, 0.103, -0.289, 0.512, 0.089, ... 384 dims]',
  },
  {
    step: '04',
    title: 'Vector Search in ChromaDB',
    badge: 'STAGE 4: VECTOR DATABASE',
    icon: Database,
    summary: 'ChromaDB performs an approximate nearest neighbor (ANN) vector search against 112 indexed fashion knowledge chunks.',
    technicalDetails: 'Uses Hierarchical Navigable Small World (HNSW) index with Cosine Distance metric: cos(θ) = (A · B) / (||A|| ||B||).',
    vivaTalkingPoint: '“Unlike traditional SQL keyword searches which fail if synonyms differ, vector search matches contextual intent even with different vocabulary.”',
    example: 'Searching 112 chunks indexed from 21 domain-specific fashion knowledge guides.',
  },
  {
    step: '05',
    title: 'Top-K Relevant Chunks Retrieved',
    badge: 'STAGE 5: RETRIEVAL',
    icon: BookOpen,
    summary: 'The top 5 most relevant fashion passages are extracted, ranked by their cosine similarity scores.',
    technicalDetails: 'Returns source file, category metadata, text passage, and calculated similarity: Similarity = 1 - Distance.',
    vivaTalkingPoint: '“We retrieve verified facts on hot weather textiles, campus dressing, and color theory instead of relying on LLM memory alone.”',
    example: '1. college_style.txt (sim: 0.64) | 2. warm_weather.txt (sim: 0.64) | 3. hot_weather.txt (sim: 0.59) | 4. fabrics.txt | 5. color_combinations.txt',
  },
  {
    step: '06',
    title: 'Context Augmentation Prompting',
    badge: 'STAGE 6: AUGMENTATION',
    icon: Lightbulb,
    summary: 'The retrieved chunks are injected into an authoritative system prompt alongside the user’s original constraints.',
    technicalDetails: 'Constructs the augmented prompt: SYSTEM INSTRUCTION + USER CONSTRAINTS + RETRIEVED KNOWLEDGE CHUNKS 1-5 + DESIRED OUTPUT SCHEMA.',
    vivaTalkingPoint: '“This is the core of RAG: We augment the prompt with grounded external facts before asking the LLM to generate recommendations.”',
    example: 'Prompt = [System: Fashion Stylist] + [User: College Hot Black] + [Knowledge: 5 Retrieved Excerpts] + [Schema: JSON]',
  },
  {
    step: '07',
    title: 'LLM Reasoning & Generation',
    badge: 'STAGE 7: GENERATION',
    icon: Sparkles,
    summary: 'The LLM synthesizes the augmented context into a cohesive personalized look, stylist note, and score breakdown.',
    technicalDetails: 'Generates structured JSON with Pieces (Top, Bottom, Footwear, Bag, Accessories), Why It Chose This, Stylist Notes, and 2 Alternative Looks.',
    vivaTalkingPoint: '“RAG eliminates AI hallucination by anchoring recommendations strictly within domain-verified fashion rules.”',
    example: 'Generates "THE CAMPUS TRENDY ICON": Oversized black cotton shirt, relaxed denim, white court sneakers, minimal tote bag.',
  },
];

export const PresentationModeModal: React.FC<PresentationModeModalProps> = ({
  isOpen,
  onClose,
  onLaunchDemo,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const current = pipelineSteps[activeStep];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="w-full max-w-4xl h-[90vh] max-h-[720px] flex flex-col rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl text-stone-100 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/50">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              🎤 FAI VIVA PRESENTATION MODE
            </div>
            <span className="text-xs text-stone-400 hidden sm:inline">
              Step {activeStep + 1} of {pipelineSteps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
            aria-label="Close Presentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Visual Stepper */}
        <div className="px-6 py-3 bg-stone-950/30 border-b border-stone-800 flex items-center gap-1.5 overflow-x-auto">
          {pipelineSteps.map((s, idx) => {
            const isCurrent = idx === activeStep;
            const isCompleted = idx < activeStep;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isCurrent
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-900/50'
                    : isCompleted
                    ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    : 'text-stone-600 hover:text-stone-400'
                }`}
              >
                <span>{s.step}</span>
                <span className="hidden md:inline">{s.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Stage Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                {current.badge}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-100 mt-1">
                {current.title}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-rose-400 shrink-0">
              <StepIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Overview
            </h4>
            <p className="text-base text-stone-200 leading-relaxed font-sans">
              {current.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical Card */}
            <div className="p-5 rounded-2xl bg-stone-800/40 border border-stone-800 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Technical Mechanism
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed font-mono">
                {current.technicalDetails}
              </p>
            </div>

            {/* Viva Talking Point Card */}
            <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-900/40 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Viva Explanation Quote
              </h4>
              <p className="text-xs text-amber-100/90 italic leading-relaxed">
                {current.vivaTalkingPoint}
              </p>
            </div>
          </div>

          {/* Example Data Box */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider mb-1">
              Sample Pipeline Trace Data:
            </div>
            <code className="text-xs text-emerald-400 font-mono break-all">
              {current.example}
            </code>
          </div>

          {/* Preset Demo launcher shortcuts */}
          <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-stone-400">Live Demo Scenarios:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onLaunchDemo('college');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
              >
                🎓 College
              </button>
              <button
                onClick={() => {
                  onLaunchDemo('wedding');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
              >
                💍 Wedding
              </button>
              <button
                onClick={() => {
                  onLaunchDemo('interview');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
              >
                💼 Interview
              </button>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-stone-800 flex items-center justify-between bg-stone-950/60">
          <button
            onClick={() => setActiveStep((prev: number) => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Stage</span>
          </button>

          <span className="text-xs font-mono text-stone-500">
            {activeStep + 1} / {pipelineSteps.length}
          </span>

          <button
            onClick={() => setActiveStep((prev: number) => Math.min(pipelineSteps.length - 1, prev + 1))}
            disabled={activeStep === pipelineSteps.length - 1}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-40 transition-colors"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
