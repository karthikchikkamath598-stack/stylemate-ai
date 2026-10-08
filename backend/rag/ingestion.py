import os
import re
from typing import List, Dict, Any
import chromadb
from rag.embeddings import get_embedding_function

COLLECTION_NAME = "stylemate_knowledge"
CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "chroma_db")

_chroma_client = None
_collection = None

def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        os.makedirs(CHROMA_PERSIST_DIR, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    return _chroma_client

def get_collection():
    global _collection
    if _collection is None:
        client = get_chroma_client()
        ef = get_embedding_function()
        _collection = client.get_or_create_collection(
            name=COLLECTION_NAME,
            embedding_function=ef,
            metadata={"hnsw:space": "cosine"}
        )
    return _collection

def chunk_text(text: str, filename: str, max_chunk_size: int = 420, overlap: int = 60) -> List[Dict[str, Any]]:
    category = filename.replace(".txt", "").replace("_style", "").replace("_weather", "")
    
    # Split text into meaningful sections or paragraphs
    sections = re.split(r'\n(?=##|\d+\.|\n)', text)
    chunks = []
    chunk_index = 1

    current_chunk = ""
    for sec in sections:
        clean_sec = sec.strip()
        if not clean_sec:
            continue
        
        if len(current_chunk) + len(clean_sec) < max_chunk_size:
            current_chunk = f"{current_chunk}\n\n{clean_sec}" if current_chunk else clean_sec
        else:
            if current_chunk:
                chunks.append({
                    "chunk_id": f"{category}_{chunk_index:03d}",
                    "source": filename,
                    "category": category,
                    "text": current_chunk.strip()
                })
                chunk_index += 1
                # apply overlap
                overlap_text = current_chunk[-overlap:] if len(current_chunk) > overlap else ""
                current_chunk = f"{overlap_text}\n\n{clean_sec}" if overlap_text else clean_sec
            else:
                chunks.append({
                    "chunk_id": f"{category}_{chunk_index:03d}",
                    "source": filename,
                    "category": category,
                    "text": clean_sec
                })
                chunk_index += 1
                current_chunk = ""

    if current_chunk.strip():
        chunks.append({
            "chunk_id": f"{category}_{chunk_index:03d}",
            "source": filename,
            "category": category,
            "text": current_chunk.strip()
        })

    return chunks

def ingest_knowledge_base(force_reload: bool = False) -> Dict[str, Any]:
    collection = get_collection()
    current_count = collection.count()
    
    if current_count > 0 and not force_reload:
        return {
            "status": "already_ingested",
            "total_chunks": current_count,
            "collection_name": COLLECTION_NAME
        }

    kb_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "knowledge_base")
    if not os.path.exists(kb_dir):
        return {"error": f"Directory not found: {kb_dir}", "total_chunks": 0}

    all_chunks = []
    files_processed = []

    for fname in sorted(os.listdir(kb_dir)):
        if fname.endswith(".txt"):
            fpath = os.path.join(kb_dir, fname)
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
            chunks = chunk_text(content, fname)
            all_chunks.extend(chunks)
            files_processed.append(fname)

    if not all_chunks:
        return {"error": "No chunks generated", "total_chunks": 0}

    # Reset collection if forcing reload
    if force_reload and current_count > 0:
        client = get_chroma_client()
        client.delete_collection(COLLECTION_NAME)
        global _collection
        _collection = None
        collection = get_collection()

    ids = [c["chunk_id"] for c in all_chunks]
    documents = [c["text"] for c in all_chunks]
    metadatas = [{"source": c["source"], "category": c["category"], "chunk_id": c["chunk_id"]} for c in all_chunks]

    # Ingest in batches of 40 to avoid memory spikes
    batch_size = 40
    for i in range(0, len(all_chunks), batch_size):
        b_ids = ids[i:i + batch_size]
        b_docs = documents[i:i + batch_size]
        b_metas = metadatas[i:i + batch_size]
        collection.upsert(ids=b_ids, documents=b_docs, metadatas=b_metas)

    return {
        "status": "success",
        "files_processed": len(files_processed),
        "total_chunks": len(all_chunks),
        "collection_name": COLLECTION_NAME,
        "sample_ids": ids[:5]
    }
