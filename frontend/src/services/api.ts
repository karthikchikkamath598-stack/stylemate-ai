import type {
  UserPreferences,
  OutfitRecommendation,
  RetrievedChunk,
  KnowledgeSource,
  SystemStats
} from '../types';

// Support both Vite reverse proxy and direct backend URL fallback
const PRIMARY_API = import.meta.env.VITE_API_URL || '/api';
const FALLBACK_API = 'http://127.0.0.1:8000/api';

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${PRIMARY_API}${endpoint}`, options);
    if (res.ok) {
      return await res.json();
    }
    // If not OK with 404/502 on proxy, attempt direct backend fallback
    throw new Error(`Status ${res.status}`);
  } catch (primaryErr) {
    // If relative fetch failed, try direct connection to backend
    if (PRIMARY_API !== FALLBACK_API) {
      try {
        const fallbackRes = await fetch(`${FALLBACK_API}${endpoint}`, options);
        if (fallbackRes.ok) {
          return await fallbackRes.json();
        }
        const errorData = await fallbackRes.json().catch(() => ({}));
        throw new Error(errorData.detail || `Backend error: ${fallbackRes.status}`);
      } catch (fallbackErr) {
        throw primaryErr;
      }
    }
    throw primaryErr;
  }
}

export async function fetchHealth(): Promise<{ status: string; rag_ready: boolean; total_chunks: number; latency_ms?: number }> {
  const start = performance.now();
  try {
    const data = await apiRequest<{ status: string; rag_ready: boolean; total_chunks: number }>('/health');
    const latency = Math.round(performance.now() - start);
    return { ...data, latency_ms: latency };
  } catch (err) {
    console.warn('Backend connection error:', err);
    return { status: 'offline', rag_ready: false, total_chunks: 0 };
  }
}

export async function fetchStats(): Promise<SystemStats> {
  return await apiRequest<SystemStats>('/stats');
}

export async function fetchSources(): Promise<{ sources: KnowledgeSource[] }> {
  return await apiRequest<{ sources: KnowledgeSource[] }>('/sources');
}

export async function requestRecommendation(preferences: UserPreferences): Promise<OutfitRecommendation> {
  return await apiRequest<OutfitRecommendation>('/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });
}

export async function searchKnowledge(query: string, top_k = 5): Promise<{ query: string; results: RetrievedChunk[] }> {
  return await apiRequest<{ query: string; results: RetrievedChunk[] }>('/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k }),
  });
}

export async function sendChatMessage(message: string, preferences?: UserPreferences): Promise<{ answer: string; retrieved_chunks: RetrievedChunk[]; mode: string }> {
  return await apiRequest<{ answer: string; retrieved_chunks: RetrievedChunk[]; mode: string }>('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, preferences }),
  });
}

export async function reingestKnowledge(): Promise<any> {
  return await apiRequest<any>('/ingest?force=true', { method: 'POST' });
}
