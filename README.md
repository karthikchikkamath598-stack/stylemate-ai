# ✨ STYLEMATE AI — Your Personal AI Fashion Stylist
> **College Fundamentals of Artificial Intelligence (FAI) Project**  
> *Demonstrating Retrieval-Augmented Generation (RAG) through an Intelligent Personal Fashion Stylist*

---

## ✦ Table of Contents
1. [Project Overview & Identity](#-project-overview--identity)
2. [Problem Statement](#-problem-statement)
3. [Project Objective](#-project-objective)
4. [Technology Stack](#-technology-stack)
5. [Complete RAG Architecture](#-complete-rag-architecture)
6. [Knowledge Base Structure (21 Guides)](#-knowledge-base-structure-21-guides)
7. [Installation & Setup](#-installation--setup)
8. [How to Run (Frontend & Backend)](#-how-to-run-frontend--backend)
9. [Environment Variables](#-environment-variables)
10. [Key Features](#-key-features)
11. [Fundamentals of AI Concepts Breakdown](#-fundamentals-of-ai-concepts-breakdown)
12. [FAI Viva Q&A Guide ("How I Can Explain This Project")](#-fai-viva-qa-guide-how-i-can-explain-this-project)

---

## ✦ Project Overview & Identity
- **Application Name**: STYLEMATE AI
- **Logo**: `STYLEMATE ✦`
- **Tagline**: *“Your style. Your mood. Your perfect look.”*
- **Secondary Tagline**: *“An AI personal stylist powered by fashion knowledge and RAG.”*
- **Brand Personality**: Elegant, Intelligent, Modern, Premium, Friendly, Minimal, Fashion-forward.
- **Aesthetic**: Warm Ivory, Editorial Rose Gold, Soft Cream, Champagne, Deep Plum & Charcoal in Dark Mode.

---

## ✦ Problem Statement
Traditional fashion recommendation applications typically suffer from two core limitations:
1. **Shallow Rule Engines**: Basic recommendation systems rely on rigid SQL database filters that cannot understand natural nuances (e.g., “*I want something trendy and comfortable for college on a hot day*”).
2. **Pure LLM Hallucinations**: Standard Generative AI chatbots often generate impractical fashion advice (recommending heavy synthetics in hot humid weather, mismatching traditional dress codes, or proposing color combinations that clash) because they lack access to structured domain-specific styling science.

---

## ✦ Project Objective
To develop **STYLEMATE AI**, an AI-powered personal stylist that implements **Retrieval-Augmented Generation (RAG)**. The application anchors its recommendations strictly inside a curated knowledge base of 21 fashion documents indexed into **ChromaDB**, delivering personalized, weather-appropriate, and color-harmonious outfits with transparent explainability.

---

## ✦ Technology Stack

| Layer | Technologies Used | Description |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 | High-performance, responsive editorial UI with micro-animations |
| **Typography** | Playfair Display, Cormorant Garamond, Inter | Luxury fashion editorial and clean UI typography |
| **Backend** | Python 3.14, FastAPI, Uvicorn | Asynchronous REST API with auto-ingestion |
| **Vector Database** | ChromaDB (Persistent Client) | Stores dense vector embeddings with HNSW indexing |
| **Embedding Model** | `all-MiniLM-L6-v2` (ONNX) | 384-dimensional dense semantic text embeddings |
| **Reasoning / LLM** | Google Gemini 1.5 / OpenAI GPT-4o-mini / Local Demo Engine | Context-augmented generation with deterministic fallback |

---

## ✦ Complete RAG Architecture

```text
 ┌────────────────────────────────────────────────────────┐
 │                   KNOWLEDGE INGESTION                   │
 │                                                        │
 │  21 Markdown/Text Guides (backend/knowledge_base/)     │
 │                    ↓                                   │
 │       Semantic Paragraph Chunking (112 Chunks)         │
 │                    ↓                                   │
 │   Dense Embedding (all-MiniLM-L6-v2, 384 dims)         │
 │                    ↓                                   │
 │       ChromaDB Vector Store (HNSW Cosine Index)        │
 └──────────────────────────┬─────────────────────────────┘
                            │
 ┌──────────────────────────▼─────────────────────────────┐
 │                ONLINE INFERENCE PIPELINE               │
 │                                                        │
 │  1. USER INPUTS (Occasion, Weather, Style, Color...)   │
 │                    ↓                                   │
 │  2. NATURAL LANGUAGE QUERY FORMULATION                 │
 │                    ↓                                   │
 │  3. EMBEDDING GENERATION (384-dimensional vector)      │
 │                    ↓                                   │
 │  4. VECTOR SEARCH IN CHROMADB (Cosine Similarity)      │
 │                    ↓                                   │
 │  5. TOP-K RETRIEVED FASHION KNOWLEDGE (Top 5 Chunks)   │
 │                    ↓                                   │
 │  6. CONTEXT AUGMENTATION (System + Profile + Chunks)   │
 │                    ↓                                   │
 │  7. LLM SYNTHESIS / LOCAL DETERMINISTIC ENGINE         │
 │                    ↓                                   │
 │  8. PERSONALIZED OUTFIT RECOMMENDATION + EXPLANATION   │
 └────────────────────────────────────────────────────────┘
```

---

## ✦ Knowledge Base Structure (21 Guides)

The knowledge base in `backend/knowledge_base/` consists of 21 comprehensive fashion styling documents:

1. `fashion_basics.txt` — Proportions, silhouette balance, Rule of Thirds, wardrobe architecture.
2. `college_style.txt` — Campus mobility, lecture comfort, sneaker pairings, casual layering.
3. `casual_style.txt` — Weekend brunch, Parisian effortless chic, minimal athleisure.
4. `party_style.txt` — Evening cocktail wear, velvet, sequins, statement accessories.
5. `wedding_style.txt` — Royal handloom sarees, Banarasi brocades, pastel lehengas, jewelry.
6. `interview_style.txt` — Corporate power tailoring, clean neutrals, executive poise.
7. `date_style.txt` — Romantic silhouettes, bias-cut slip dresses, delicate jewelry.
8. `festival_style.txt` — Heritage textiles, Diwali, Dandiya fusion, auspicious color palettes.
9. `travel_style.txt` — Airport chic, wrinkle-resistant fabrics, non-restrictive transit sets.
10. `hot_weather.txt` — 100% pure linen, mulmul cotton, high thermal conductivity, UV protection.
11. `warm_weather.txt` — Transitional layers, cotton poplin, lightweight denim.
12. `cold_weather.txt` — Three-layer system, merino wool, tailored overcoats, thermal retention.
13. `rainy_weather.txt` — Monsoon dressing, quick-drying textiles, water-resistant footwear.
14. `color_combinations.txt` — 60-30-10 distribution, complementary and analogous palettes.
15. `accessories.txt` — Jewelry frameworks, bag curation (tote, baguette, potli), sunglasses.
16. `footwear.txt` — Wrong Shoe Theory, retro court sneakers, loafers, block heels.
17. `fabrics.txt` — Textile science: natural fibers, tencel, drape, tactile texture.
18. `styling_rules.txt` — Volume counterbalance, Sandwich Rule, Rule of Three Elements.
19. `western_style.txt` — Contemporary minimalism, tailored separates, street-smart chic.
20. `traditional_style.txt` — Heritage Indian wear, handloom drapes, zardozi embroidery.
21. `indo_western_style.txt` — Fusion kurtis with denim, capes with dhoti pants, blazer-sarees.

---

## ✦ Installation & Setup

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.14)
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### 1. Clone & Enter Project
```bash
cd "c:\Users\Karthik B Chikkamath\OneDrive\Desktop\OUTFIT RECOMDATION"
```

### 2. Backend Setup
```bash
# Activate existing virtual environment or create one:
python -m venv venv
.\venv\Scripts\activate

# Install backend dependencies:
pip install -r backend/requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

---

## ✦ How to Run (Frontend & Backend)

### Start the Backend Server (Terminal 1)
```bash
.\venv\Scripts\activate
cd backend
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*The backend automatically indexes all 21 knowledge base documents into ChromaDB on startup.*

### Start the Frontend Dev Server (Terminal 2)
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

Visit the application at: **`http://127.0.0.1:5173/`**

---

## ✦ Environment Variables

The project includes `backend/.env.example`:
```env
# Optional external LLM API keys
# If left blank, StyleMate AI runs seamlessly in "Local Demo Mode" with full ChromaDB RAG retrieval!
GEMINI_API_KEY=
OPENAI_API_KEY=
PORT=8000
```
> **Security Guarantee**: No API keys are ever stored or exposed in the client-side React code. All AI operations are encapsulated inside FastAPI.

---

## ✦ Key Features

1. **Editorial Fashion Experience**: Full-screen Vogue-inspired hero section, floating trend cards, and responsive dark/light theme toggle.
2. **Interactive 6-Step Style Studio**:
   - Occasions: 🎓 College, ☕ Casual, 🎉 Party, 💍 Wedding, 💼 Interview, 💕 Date, 🪔 Festival, ✈️ Travel
   - Weather: ☀️ Hot, 🌤️ Warm, ❄️ Cold, 🌧️ Rainy
   - Styles: Minimal, Trendy, Elegant, Traditional, Casual, Sporty
   - Color Swatches: Black, White, Blue, Pink, Red, Green, Purple, Beige, Brown, Any
   - Silhouettes: Western, Traditional, Indo-Western, Any
   - Comfort Levels: Maximum Comfort, Balanced, Fashion First
   - Personal Note with character counter.
3. **Multi-Step Processing Screen**:
   - `✦ Understanding your style...`
   - `🔎 Searching fashion knowledge...`
   - `🧠 Finding the best combinations...`
   - `✨ Creating your personalized look...`
4. **Transparent Preference Match Score**:
   - Visual circular score breakdown (Occasion 30/30, Weather 20/20, Style 20/20, Outfit Type 15/15, Color 5/10, Comfort 4/5). Clearly labeled as **Preference Match Score**, not AI accuracy.
5. **Alternative Capsule Outfits**:
   - Look 01 (Best Match), Look 02 (Relaxed), Look 03 (Statement) with one-click view swapping.
6. **Wardrobe Persistence & Style Telemetry**:
   - Saves looks to `localStorage` with celebratory confetti.
   - Computes personal Style Insights (Favorite Style, Favorite Color, Preferred Comfort, Top Occasion).
7. **RAG Explorer**:
   - 7-stage interactive developer pipeline inspector.
   - Shows user query, dense vector visualization, top 5 retrieved source chunks, and raw augmented prompts.
   - Live ChromaDB vector query search tester.
8. **🎤 Presentation Mode**:
   - Fullscreen college viva presenter mode with step-by-step next/prev slides and viva talking points.
9. **Ask Your Stylist AI Chat**:
   - Conversational fashion concierge citing real knowledge documents.

---

## ✦ Fundamentals of AI Concepts Breakdown

- **Artificial Intelligence (AI)**: Systems designed to perceive inputs, process information, reason over constraints, and generate human-level solutions.
- **Natural Language Processing (NLP)**: Techniques allowing computers to understand, parse, and formulate human text.
- **Vector Embeddings**: High-dimensional mathematical representations (384 floating-point coordinates) mapping semantic meaning into metric space.
- **Semantic Search**: Retrieval based on conceptual intent and context rather than literal keyword matching.
- **Vector Database (ChromaDB)**: A specialized data store engineered for indexing and fast Approximate Nearest Neighbor (ANN) search over dense vectors.
- **Cosine Similarity**: Mathematical measurement calculating the cosine of the angle between two vectors:
  $$\text{Cosine Similarity} = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$$
- **Retrieval-Augmented Generation (RAG)**: The process of retrieving external factual documents and feeding them into the context window of a generative model before synthesis.
- **Explainable AI (XAI)**: Architectures providing transparent reasons and source attributions for every output generated.

---

## ✦ FAI Viva Q&A Guide ("How I Can Explain This Project")

### 1. What is RAG and why did we use it in this project?
> **Answer**: *“RAG stands for Retrieval-Augmented Generation. Instead of relying solely on the pre-trained weights of a Language Model—which can hallucinate or generate impractical fashion advice—RAG first searches an external, verified knowledge base of 21 fashion guides in ChromaDB. It retrieves the top 5 most relevant excerpts (e.g. textile breathability, occasion dress codes) and augments the AI's prompt with these facts before generating the recommendation.”*

### 2. What is an embedding and how does ChromaDB use it?
> **Answer**: *“An embedding is a numerical vector that represents the meaning of text. We use the `all-MiniLM-L6-v2` embedding model to convert both the user query and our fashion knowledge chunks into 384-dimensional vectors. ChromaDB stores these vectors and uses Hierarchical Navigable Small World (HNSW) graph indexing with Cosine Distance to find the closest conceptual matches in milliseconds.”*

### 3. How does StyleMate formulate the search query?
> **Answer**: *“StyleMate combines the user's structured parameters (Occasion, Weather, Style, Color, Comfort) and natural language personal notes into a dense semantic query like `trendy comfortable western college outfit black hot weather breathable fabrics`. This bridges user intent with vector search.”*

### 4. What happens if no external LLM API key is available?
> **Answer**: *“The application implements a robust, transparent Local Demo Mode. The RAG pipeline still executes vector search and retrieves top-K chunks from ChromaDB. Our deterministic expert styling engine then synthesizes the outfit directly using the retrieved knowledge chunks without breaking or faking LLM responses.”*

### 5. Why is this considered an AI project rather than a traditional web application?
> **Answer**: *“A traditional web application uses static database lookup with rigid `IF/ELSE` or `SQL WHERE` statements. StyleMate AI utilizes Natural Language Processing, high-dimensional vector embeddings, semantic vector similarity in ChromaDB, context augmentation, and explainable AI reasoning.”*

---

*StyleMate AI was designed and built for the College Fundamentals of Artificial Intelligence (FAI) examination.*
