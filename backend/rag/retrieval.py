import os
from typing import List, Dict, Any, Tuple
from rag.ingestion import get_collection
from models.schemas import UserPreferences, RetrievedChunk

def build_retrieval_query(prefs: UserPreferences) -> str:
    """Combines user selections into an optimal semantic query for vector search."""
    tokens = []
    if prefs.style and prefs.style.lower() != "any":
        tokens.append(prefs.style.lower())
    if prefs.comfort and prefs.comfort != "Balanced":
        tokens.append(prefs.comfort.lower())
    if prefs.outfit_type and prefs.outfit_type.lower() != "any":
        tokens.append(prefs.outfit_type.lower())
    if prefs.occasion:
        tokens.append(f"{prefs.occasion.lower()} outfit")
    if prefs.color and prefs.color.lower() != "any":
        tokens.append(f"{prefs.color.lower()} styling palette")
    if prefs.weather:
        tokens.append(f"{prefs.weather.lower()} weather breathable fabrics")
    if prefs.personal_note:
        tokens.append(prefs.personal_note)

    query = " ".join(tokens)
    return query if query else "casual comfortable modern fashion styling outfit"

def retrieve_knowledge(query: str, top_k: int = 5) -> List[RetrievedChunk]:
    """Searches ChromaDB vector collection and returns top-K relevant chunks with exact distance and similarity."""
    collection = get_collection()
    
    try:
        results = collection.query(
            query_texts=[query],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )
    except Exception as e:
        print(f"Error querying ChromaDB: {e}. Falling back to file search.")
        return fallback_file_retrieval(query, top_k)

    retrieved: List[RetrievedChunk] = []

    if results and "documents" in results and results["documents"]:
        docs = results["documents"][0]
        metas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
        distances = results["distances"][0] if "distances" in results else [0.2] * len(docs)
        ids = results["ids"][0] if "ids" in results else [f"chk_{i}" for i in range(len(docs))]

        for doc, meta, dist, cid in zip(docs, metas, distances, ids):
            # Cosine distance ranges from 0 (identical) to 2 (opposite).
            # True cosine similarity = 1 - distance
            cos_sim = max(0.0, min(1.0, 1.0 - float(dist)))
            retrieved.append(RetrievedChunk(
                chunk_id=meta.get("chunk_id", cid),
                source=meta.get("source", "knowledge_base.txt"),
                category=meta.get("category", "fashion"),
                text=doc,
                relevance_score=round(cos_sim, 4),
                distance=round(float(dist), 4)
            ))

    if not retrieved:
        return fallback_file_retrieval(query, top_k)

    return retrieved

def fallback_file_retrieval(query: str, top_k: int = 5) -> List[RetrievedChunk]:
    """Resilient fallback that scores knowledge base files using keyword match relevance."""
    kb_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "knowledge_base")
    q_words = set(query.lower().split())
    candidates = []

    if os.path.exists(kb_dir):
        for fname in os.listdir(kb_dir):
            if fname.endswith(".txt"):
                fpath = os.path.join(kb_dir, fname)
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        text = f.read()
                    paras = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 60]
                    for idx, p in enumerate(paras):
                        p_words = set(p.lower().split())
                        overlap = len(q_words.intersection(p_words))
                        score = min(0.95, 0.45 + (overlap * 0.08))
                        candidates.append((score, fname, idx, p))
                except Exception:
                    continue

    candidates.sort(key=lambda x: x[0], reverse=True)
    top_items = candidates[:top_k]

    return [
        RetrievedChunk(
            chunk_id=f"{item[1].replace('.txt','')}_{item[2]+1:03d}",
            source=item[1],
            category=item[1].replace(".txt",""),
            text=item[3],
            relevance_score=round(item[0], 4),
            distance=round(1.0 - item[0], 4)
        )
        for item in top_items
    ]
