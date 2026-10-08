import math
from typing import List
import chromadb.utils.embedding_functions as embedding_functions

_default_ef = None

def get_embedding_function():
    global _default_ef
    if _default_ef is None:
        try:
            _default_ef = embedding_functions.DefaultEmbeddingFunction()
        except Exception as e:
            print(f"Warning: DefaultEmbeddingFunction error: {e}. Using deterministic fallback.")
            _default_ef = None
    return _default_ef

def generate_embedding(text: str) -> List[float]:
    ef = get_embedding_function()
    if ef is not None:
        try:
            embs = ef([text])
            if embs and len(embs) > 0:
                return [round(float(x), 4) for x in embs[0]]
        except Exception as e:
            print(f"Error computing embedding with default EF: {e}")

    # Deterministic fallback embedding based on hashed token frequencies
    vector = [0.0] * 384
    words = text.lower().split()
    if not words:
        words = ["fashion"]
    for i, word in enumerate(words):
        h = hash(word)
        idx = abs(h) % 384
        vector[idx] += 1.0 / (1.0 + math.log(i + 2))
    # Normalize vector to unit length
    norm = math.sqrt(sum(x * x for x in vector)) or 1.0
    return [round(x / norm, 4) for x in vector]

def get_embedding_sample(text: str, n_dims: int = 8) -> List[float]:
    """Returns the first n_dims floats of the embedding vector for the RAG explorer visualization."""
    vec = generate_embedding(text)
    return [round(float(v), 3) for v in vec[:n_dims]]
