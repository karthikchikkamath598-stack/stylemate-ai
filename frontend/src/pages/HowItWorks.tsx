import {
  Compass,
  Search,
  Layers,
  Sparkles,
  Database,
  Brain,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface HowItWorksProps {
  onGoToStudio: () => void;
  onOpenPresentation: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onGoToStudio,
  onOpenPresentation,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Understand You',
      icon: Compass,
      desc: 'StyleMate receives your occasion, weather conditions, style personality, color choice, and comfort requirements through an intuitive multi-step form.',
      faiNote: 'Categorical & unstructured multi-attribute user preference ingestion.',
    },
    {
      num: '02',
      title: 'Search Fashion Knowledge',
      icon: Search,
      desc: 'Instead of assuming answers blindly, the system translates your inputs into a rich semantic retrieval query and searches across 21 fashion domain texts.',
      faiNote: 'Natural Language Processing (NLP) semantic query synthesis.',
    },
    {
      num: '03',
      title: 'Retrieve with ChromaDB',
      icon: Database,
      desc: 'ChromaDB compares your query vector with 112 pre-computed fashion chunks using cosine distance and returns the top 5 highest-relevance excerpts.',
      faiNote: 'Dense Approximate Nearest Neighbor (ANN) search via HNSW cosine indexing.',
    },
    {
      num: '04',
      title: 'Augment the Prompt',
      icon: Layers,
      desc: 'The retrieved fashion guidelines on fabrics, colors, and styling rules are injected into a structured system prompt, grounding the AI in verified rules.',
      faiNote: 'In-Context Learning (ICL) context augmentation.',
    },
    {
      num: '05',
      title: 'Generate Personalized Style',
      icon: Brain,
      desc: 'The language engine creates a cohesive look with matching top, bottom, shoes, and bag, plus a transparent Preference Match Score and alternative outfits.',
      faiNote: 'Deterministic or LLM structured output synthesis without hallucination.',
    },
    {
      num: '06',
      title: 'Explain the Decision',
      icon: ShieldCheck,
      desc: 'StyleMate presents clear reasons for every element—explaining why each piece was chosen and which fashion document informed that choice.',
      faiNote: 'Explainable AI (XAI) feature attribution & transparency.',
    },
  ];

  const faiFaqs = [
    {
      q: 'What is Retrieval-Augmented Generation (RAG)?',
      a: 'RAG is an AI framework that augments an input prompt with factual information retrieved from an external knowledge base before passing it to a generation model. This solves the problem of model hallucination and outdated knowledge.',
    },
    {
      q: 'What is a Vector Embedding?',
      a: 'A vector embedding is a mathematical translation of words or sentences into a list of numbers (vectors) in a multi-dimensional coordinate space. Semantically related concepts (e.g. "linen" and "hot weather") map to nearby coordinates.',
    },
    {
      q: 'What is ChromaDB and why did we use it?',
      a: 'ChromaDB is an open-source vector database designed specifically for AI applications. It stores high-dimensional embeddings and executes lightning-fast similarity searches using HNSW graph algorithms.',
    },
    {
      q: 'Why RAG instead of just fine-tuning a model?',
      a: 'Fine-tuning modifies model weights, which is computationally expensive, prone to catastrophic forgetting, and difficult to update. RAG decouples knowledge from reasoning: we can update, add, or remove fashion rules instantly by modifying text files.',
    },
    {
      q: 'What does the Preference Match Score mean?',
      a: 'It is a deterministic alignment score evaluating how completely the curated outfit satisfies your selected constraints (Occasion, Weather, Style, Outfit Type, Color, Comfort). It is NOT an AI accuracy claim.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-rose-500 bg-rose-500/10 border border-rose-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          EDUCATIONAL ARCHITECTURE
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-stone-900 dark:text-stone-50">
          “How StyleMate Works”
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-base font-light font-sans max-w-xl mx-auto">
          An end-to-end breakdown of how modern AI combines vector mathematics with high-fashion expertise.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onOpenPresentation}
            className="px-5 py-2.5 rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
          >
            🎤 Launch Viva Presentation Mode
          </button>
        </div>
      </div>

      {/* 6-STEP PROCESS GRID */}
      <section className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-mono uppercase text-rose-500 font-semibold">
            THE 6-STAGE WORKFLOW
          </span>
          <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100 mt-1">
            From Your Preference to Runway-Ready
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="p-6 rounded-3xl glass-card space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      STEP {st.num}
                    </span>
                    <Icon className="w-5 h-5 text-stone-400" />
                  </div>

                  <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                    {st.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-[11px] font-mono text-stone-500 dark:text-stone-400">
                  <span className="font-semibold text-rose-500">FAI Concept:</span> {st.faiNote}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAI VIVA FAQ & CONCEPTS */}
      <section className="p-8 sm:p-10 rounded-3xl glass-card space-y-8">
        <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
          <Brain className="w-6 h-6 text-rose-500" />
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-stone-900 dark:text-stone-100">
              Fundamental AI Concepts Explained
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Clear academic definitions formatted for college viva questions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faiFaqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-2">
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 border border-rose-500/20 text-center space-y-4">
        <h3 className="font-serif text-2xl font-light text-stone-900 dark:text-stone-100">
          Ready to experience the RAG stylist in action?
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Start your personalized styling session and watch how external knowledge shapes your look.
        </p>
        <button
          onClick={onGoToStudio}
          className="px-8 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold uppercase tracking-widest transition-colors shadow-lg shadow-rose-900/20"
        >
          Open Style Studio ✨
        </button>
      </div>
    </div>
  );
};
