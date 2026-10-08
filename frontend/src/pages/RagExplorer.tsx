import React, { useState } from 'react';
import {
  Search,
  Database,
  Cpu,
  Layers,
  Sparkles,
  FileText,
  CheckCircle,
  Terminal,
  Info,
  Loader2,
} from 'lucide-react';
import type { OutfitRecommendation, RetrievedChunk } from '../types';
import { searchKnowledge } from '../services/api';

interface RagExplorerProps {
  lastRecommendation: OutfitRecommendation | null;
}

export const RagExplorer: React.FC<RagExplorerProps> = ({ lastRecommendation }) => {
  const [activeStage, setActiveStage] = useState<number>(3); // Default to stage 3 (Vector Search & Retrieval)
  const [selectedChunkIndex, setSelectedChunkIndex] = useState<number>(0);
  
  // Live query search tool
  const [liveQuery, setLiveQuery] = useState('trendy college outfit hot weather breathable fabrics');
  const [liveResults, setLiveResults] = useState<RetrievedChunk[] | null>(null);
  const [isSearchingLive, setIsSearchingLive] = useState(false);

  // Fallback demo sample if user hasn't generated a look yet
  const sampleData: OutfitRecommendation = lastRecommendation || {
    title: 'THE CAMPUS TRENDY ICON',
    look_name: 'Trendy College Ensemble in Black',
    match_score: 97,
    score_breakdown: {
      occasion: 30, occasion_max: 30,
      weather: 20, weather_max: 20,
      style: 20, style_max: 20,
      outfit_type: 15, outfit_type_max: 15,
      color: 8, color_max: 10,
      comfort: 4, comfort_max: 5,
      total: 97, total_max: 100,
    },
    pieces: {
      top: 'Breathable black oversized boxy cotton poplin shirt',
      bottom: 'Relaxed high-waisted linen-blend straight trousers',
      footwear: 'Clean minimalist retro white court sneakers',
      bag: 'Structured canvas and vegan leather everyday tote',
      accessories: 'Dainty gold huggie earrings and rectangular acetate sunglasses',
    },
    why_stylemate_chose_this: [
      { aspect: 'Occasion Alignment', reason: 'High mobility for walking across campus and sitting in long lectures.' },
      { aspect: 'Weather Thermal Balance', reason: 'Pure linen and breathable cotton poplin encourage air circulation.' },
    ],
    stylist_note: '“Keep the base silhouette clean with black accents, and let the white retro sneakers ground the look.”',
    tips: {
      styling: 'Tuck the shirt slightly in front to elongate proportions.',
      color: 'Pair black with crisp ivory neutrals for a 60-30-10 ratio.',
      accessory: 'Delicate gold huggie hoops frame the face effortlessly.',
    },
    alternative_looks: [],
    image_query: 'trendy college outfit black',
    retrieved_chunks: [
      {
        chunk_id: 'warm_weather_001',
        source: 'warm_weather.txt',
        category: 'warm_weather',
        text: 'Warm weather (22°C - 28°C) offers the sweet spot in styling: pleasant conditions allowing stylish light layering, diverse textiles, and versatile day-to-night transitions. Fabrics: Cotton poplin, lightweight denim, silk-cotton blends, lyocell.',
        relevance_score: 0.6391,
        distance: 0.3609,
      },
      {
        chunk_id: 'college_001',
        source: 'college_style.txt',
        category: 'college',
        text: 'College styling revolves around low-effort cool, functional comfort, breathable layers, and durability. Students spend long hours walking across campus, sitting in lectures, and socializing.',
        relevance_score: 0.639,
        distance: 0.361,
      },
      {
        chunk_id: 'hot_weather_001',
        source: 'hot_weather.txt',
        category: 'hot_weather',
        text: 'Hot weather dressing prioritizes thermal regulation, moisture dissipation, loose breathable silhouettes, and UV protection. Pure Linen: highly breathable, hollow fibers allow maximum air circulation.',
        relevance_score: 0.5913,
        distance: 0.4087,
      },
      {
        chunk_id: 'fabrics_001',
        source: 'fabrics.txt',
        category: 'fabrics',
        text: 'Natural fibers: Cotton is absorbent, hypoallergenic, durable, easy care; essential for everyday tees, denim, shirts. Linen has high thermal conductivity.',
        relevance_score: 0.5642,
        distance: 0.4358,
      },
      {
        chunk_id: 'color_combinations_001',
        source: 'color_combinations.txt',
        category: 'color_combinations',
        text: 'Black pairs exquisitely with crisp white, warm camel/beige, deep denim blue, soft grey, blush pink, metallic gold, and silver. The 60-30-10 rule balances base neutrals and accents.',
        relevance_score: 0.542,
        distance: 0.458,
      },
    ],
    augmented_prompt: `SYSTEM:\nYou are StyleMate AI, an intelligent personal fashion stylist powered by fashion knowledge and RAG.\n\nUSER PROFILE:\n- Occasion: College\n- Weather: Hot\n- Style: Trendy\n- Color: Black\n- Outfit Type: Western\n- Comfort Level: Balanced\n\nUSER REQUEST:\nI want something trendy but comfortable for college.\n\nRETRIEVED FASHION KNOWLEDGE:\n[Chunk 1 - warm_weather.txt]: Warm weather allows stylish light layering...\n[Chunk 2 - college_style.txt]: College styling revolves around low-effort cool...\n\nTASK:\nGenerate a personalized outfit recommendation using the user's preferences and the retrieved knowledge.`,
    embedding_sample: [0.038, 0.412, -0.187, 0.654, 0.103, -0.289, 0.512, 0.089],
    retrieval_query: 'trendy comfortable western college outfit black hot weather breathable fabrics',
    is_fallback: true,
    mode: 'Local Demo Mode (FAI Deterministic Engine)',
  };

  const stages = [
    { id: 0, label: '01 USER QUERY', icon: Search, name: 'Query Formulation' },
    { id: 1, label: '02 EMBEDDING', icon: Cpu, name: 'Dense Vectorization' },
    { id: 2, label: '03 VECTOR SEARCH', icon: Database, name: 'ChromaDB ANN' },
    { id: 3, label: '04 RETRIEVED KNOWLEDGE', icon: FileText, name: 'Top-K Ranking' },
    { id: 4, label: '05 AUGMENTED CONTEXT', icon: Layers, name: 'Prompt Assembly' },
    { id: 5, label: '06 LLM REASONING', icon: Sparkles, name: 'Synthesis Engine' },
    { id: 6, label: '07 FINAL STYLE', icon: CheckCircle, name: 'Curated Ensemble' },
  ];

  const handleLiveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveQuery.trim() || isSearchingLive) return;
    setIsSearchingLive(true);
    try {
      const res = await searchKnowledge(liveQuery, 5);
      setLiveResults(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingLive(false);
    }
  };

  const chunksToDisplay = liveResults || sampleData.retrieved_chunks;
  const currentChunk = chunksToDisplay[selectedChunkIndex] || chunksToDisplay[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20">
          <Terminal className="w-3.5 h-3.5" />
          TECHNICAL INSPECTION CONSOLE
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-stone-900 dark:text-stone-50">
          “🔍 RAG Explorer”
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-base font-light font-sans max-w-xl mx-auto">
          See how StyleMate thinks. Inspect the internal data transformations across every stage of the Retrieval-Augmented Generation pipeline.
        </p>
      </div>

      {/* RAG Educational Explanation Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 text-white shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-light text-stone-100 flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-400" />
            What is Retrieval-Augmented Generation (RAG)?
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-stone-800 text-rose-300">RETRIEVE</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-md bg-stone-800 text-amber-300">AUGMENT</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-md bg-stone-800 text-emerald-300">GENERATE</span>
          </div>
        </div>
        <p className="text-sm text-stone-300 leading-relaxed font-sans max-w-4xl">
          Retrieval-Augmented Generation allows StyleMate to retrieve relevant information from an external fashion knowledge base (21 documents indexed into ChromaDB) before generating an answer. This gives the AI verified contextual principles instead of relying only on static pre-training weights, preventing hallucinations.
        </p>
      </section>

      {/* INTERACTIVE VISUAL PIPELINE FLOW */}
      <section className="p-6 sm:p-8 rounded-3xl glass-card space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
            Interactive Architecture Flow (Click any stage to inspect)
          </span>
          <span className="text-xs font-mono text-rose-500">
            Active: Stage {activeStage + 1}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {stages.map((st) => {
            const Icon = st.icon;
            const isCurrent = activeStage === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStage(st.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-900/30 scale-105 ring-2 ring-rose-400/40'
                    : 'glass-card hover:border-stone-400 dark:hover:border-stone-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono ${isCurrent ? 'text-white/80' : 'text-stone-400'}`}>
                    {st.label.split(' ')[0]}
                  </span>
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-rose-500'}`} />
                </div>
                <div className="font-semibold text-xs leading-tight">
                  {st.label.replace(st.label.split(' ')[0], '').trim()}
                </div>
                <span className={`text-[10px] mt-1 line-clamp-1 ${isCurrent ? 'text-white/80' : 'text-stone-500'}`}>
                  {st.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* INSPECTOR PANEL FOR THE ACTIVE STAGE */}
      <section className="p-6 sm:p-8 rounded-3xl glass-card space-y-6">
        {/* STAGE 0: QUERY PANEL */}
        {activeStage === 0 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
              <Search className="w-4 h-4" />
              <span>STAGE 01 — USER NATURAL LANGUAGE QUERY & PROFILE</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="text-xs text-stone-500 uppercase tracking-wider font-mono">
                Synthesized Vector Search Query:
              </div>
              <div className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-light">
                “{sampleData.retrieval_query}”
              </div>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">
                Formulated by merging the user’s categorical choices (Occasion, Weather, Style, Color, Comfort) with any personal notes.
              </p>
            </div>
          </div>
        )}

        {/* STAGE 1: EMBEDDING PANEL */}
        {activeStage === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              <span>STAGE 02 — VECTOR EMBEDDING REPRESENTATION (384 DIMENSIONS)</span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 font-sans">
              “The user’s query is converted into a numerical vector so the system can find semantically similar fashion knowledge.”
            </p>
            <div className="p-5 rounded-2xl bg-stone-950 text-emerald-400 font-mono text-xs space-y-3 border border-stone-800">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider">
                First Dimensions Sample (all-MiniLM-L6-v2 ONNX Model):
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                {sampleData.embedding_sample.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-amber-300"
                  >
                    [{val.toFixed(3)}]
                  </span>
                ))}
                <span className="text-stone-500 py-1 font-mono">... + 376 more dimensions</span>
              </div>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-800">
                Vector magnitude normalized: ||v|| = 1.0 (Cosine Metric Space)
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2 & 3: VECTOR SEARCH & RETRIEVAL PANEL */}
        {(activeStage === 2 || activeStage === 3) && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
                <Database className="w-4 h-4" />
                <span>STAGE 03/04 — CHROMADB VECTOR SEARCH & TOP-5 RETRIEVED SOURCES</span>
              </div>
              <span className="text-xs font-mono text-stone-500">
                ChromaDB HNSW Index: Cosine Distance
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Top 5 Sources List */}
              <div className="lg:col-span-5 space-y-2.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Top 5 Retrieved Chunks
                </div>
                {chunksToDisplay.map((chunk, idx) => {
                  const isSelected = selectedChunkIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedChunkIndex(idx)}
                      className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 shadow-md'
                          : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <span>0{idx + 1}</span>
                          <span>{chunk.source}</span>
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                          ID: {chunk.chunk_id} • {chunk.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {Math.round(chunk.relevance_score * 100)}% Sim
                        </span>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                          dist: {chunk.distance.toFixed(3)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Chunk Text Viewer */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                  <div>
                    <span className="text-xs font-mono uppercase text-rose-500 font-semibold">
                      Chunk Inspector: {currentChunk?.chunk_id}
                    </span>
                    <h4 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 mt-0.5">
                      Source: {currentChunk?.source}
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-stone-400">
                    Category: {currentChunk?.category}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-stone-100/70 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
                  {currentChunk?.text}
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span>Cosine Similarity: {currentChunk?.relevance_score}</span>
                  <span>ChromaDB Metric: cos(θ) = 1 - distance</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: AUGMENTED CONTEXT PANEL */}
        {activeStage === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              <span>STAGE 05 — AUGMENTED PROMPT PASSED TO LLM</span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 font-sans">
              Here is the exact prompt containing the user profile, user query, and all top-K retrieved fashion passages passed into the model.
            </p>
            <div className="p-5 rounded-2xl bg-stone-950 text-stone-200 font-mono text-xs leading-relaxed border border-stone-800 whitespace-pre-line max-h-96 overflow-y-auto">
              {sampleData.augmented_prompt}
            </div>
          </div>
        )}

        {/* STAGE 5: LLM REASONING & GENERATION */}
        {activeStage === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>STAGE 06 — LLM REASONING & OUTPUT SYNTHESIS</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                  {sampleData.title}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                  {sampleData.mode}
                </span>
              </div>
              <p className="font-editorial text-base italic text-stone-700 dark:text-stone-300">
                {sampleData.stylist_note}
              </p>
            </div>
          </div>
        )}

        {/* STAGE 6: FINAL STYLE */}
        {activeStage === 6 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>STAGE 07 — FINAL PERSONALIZED OUTFIT RECOMMENDATION</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-500 font-mono">TOP</span>
                <div className="text-sm font-serif font-medium mt-1">{sampleData.pieces.top}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-500 font-mono">BOTTOM</span>
                <div className="text-sm font-serif font-medium mt-1">{sampleData.pieces.bottom}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-500 font-mono">FOOTWEAR</span>
                <div className="text-sm font-serif font-medium mt-1">{sampleData.pieces.footwear}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-500 font-mono">BAG</span>
                <div className="text-sm font-serif font-medium mt-1">{sampleData.pieces.bag}</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* LIVE QUERY TESTER */}
      <section className="p-6 sm:p-8 rounded-3xl glass-card space-y-4">
        <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
          <Terminal className="w-4 h-4" />
          <span>LIVE CHROMADB VECTOR SEARCH TESTER</span>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Test real-time semantic similarity retrieval directly against the 112 ChromaDB indexed knowledge chunks:
        </p>

        <form onSubmit={handleLiveSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={liveQuery}
            onChange={(e) => setLiveQuery(e.target.value)}
            placeholder="e.g. breathable fabrics hot weather linen sandals"
            className="flex-1 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-sm focus:outline-none focus:border-rose-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isSearchingLive}
            className="px-6 py-3.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSearchingLive ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Execute Vector Search</span>
              </>
            )}
          </button>
        </form>

        {liveResults && (
          <div className="pt-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Retrieved {liveResults.length} real chunks from ChromaDB! Click Stage 03/04 above to inspect them.</span>
          </div>
        )}
      </section>
    </div>
  );
};
