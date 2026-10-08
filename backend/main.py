import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from models.schemas import (
    UserPreferences,
    OutfitRecommendation,
    SearchRequest,
    SearchResponse,
    ChatRequest,
    ChatResponse
)
from rag.ingestion import ingest_knowledge_base, get_collection
from rag.retrieval import build_retrieval_query, retrieve_knowledge
from rag.generation import (
    build_augmented_prompt,
    generate_recommendation_with_llm
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Automatically ingest fashion knowledge on startup
    print("[*] StyleMate AI Backend starting up...")
    print("[*] Ingesting fashion knowledge base into ChromaDB...")
    try:
        stats = ingest_knowledge_base()
        print(f"[*] Ingestion complete: {stats}")
    except Exception as e:
        print(f"[*] Warning during initial ingestion: {e}")
    yield
    print("[*] StyleMate AI Backend shutting down...")

app = FastAPI(
    title="StyleMate AI Backend",
    description="Intelligent RAG-powered personal fashion stylist API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    coll = get_collection()
    count = coll.count() if coll else 0
    return {
        "status": "healthy",
        "service": "StyleMate AI",
        "rag_ready": count > 0,
        "total_chunks": count
    }

@app.get("/api/stats")
async def get_stats():
    coll = get_collection()
    count = coll.count() if coll else 0
    kb_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "knowledge_base")
    total_files = len([f for f in os.listdir(kb_dir) if f.endswith(".txt")]) if os.path.exists(kb_dir) else 0

    return {
        "total_knowledge_files": total_files,
        "total_indexed_chunks": count,
        "embedding_dimensions": 384,
        "embedding_model": "all-MiniLM-L6-v2 (ONNX)",
        "vector_database": "ChromaDB Persistent",
        "similarity_metric": "Cosine Similarity"
    }

@app.get("/api/sources")
async def get_sources():
    kb_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "knowledge_base")
    if not os.path.exists(kb_dir):
        return {"sources": []}
    files = sorted([f for f in os.listdir(kb_dir) if f.endswith(".txt")])
    return {
        "sources": [
            {
                "filename": f,
                "category": f.replace(".txt", "").replace("_style", "").replace("_weather", ""),
                "size_bytes": os.path.getsize(os.path.join(kb_dir, f))
            }
            for f in files
        ]
    }

@app.post("/api/ingest")
async def trigger_ingest(force: bool = False):
    result = ingest_knowledge_base(force_reload=force)
    return result

@app.post("/api/search", response_model=SearchResponse)
async def search_endpoint(req: SearchRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    chunks = retrieve_knowledge(req.query, top_k=req.top_k or 5)
    return SearchResponse(query=req.query, top_k=req.top_k or 5, results=chunks)

@app.post("/api/recommend", response_model=OutfitRecommendation)
async def recommend_endpoint(prefs: UserPreferences):
    # 1. Build optimal natural language query from user preferences
    retrieval_query = build_retrieval_query(prefs)

    # 2. Vector Search & Semantic Retrieval from ChromaDB
    retrieved_chunks = retrieve_knowledge(retrieval_query, top_k=5)

    # 3. Context Augmentation (construct augmented prompt)
    augmented_prompt = build_augmented_prompt(prefs, retrieved_chunks)

    # 4. LLM Generation or transparent verified local fallback engine
    recommendation = generate_recommendation_with_llm(
        prefs=prefs,
        retrieved_chunks=retrieved_chunks,
        augmented_prompt=augmented_prompt,
        query=retrieval_query
    )

    return recommendation

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    # Retrieve top 3 relevant chunks from fashion knowledge
    chunks = retrieve_knowledge(req.message, top_k=3)
    
    # Generate response referencing retrieved knowledge
    context_bullet_points = "\n".join([f"• From {c.source}: {c.text[:140]}..." for c in chunks])
    
    answer = (
        f"Based on StyleMate's retrieved fashion principles:\n\n"
        f"For your question, the key rule is balance and intentional proportions. "
        f"Pair complementary neutrals, ensure comfortable footwear, and introduce one statement accessory. "
        f"Here are the specific principles retrieved from our knowledge base:\n\n"
        f"{context_bullet_points}\n\n"
        f"Would you like me to curate a full personalized look for this in the Style Studio?"
    )

    return ChatResponse(
        answer=answer,
        retrieved_chunks=chunks,
        mode="RAG Contextual Fashion Assistant"
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
