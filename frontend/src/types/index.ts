export interface UserPreferences {
  occasion: string;
  weather: string;
  style: string;
  color: string;
  outfit_type: string;
  comfort: string;
  personal_note: string;
}

export interface RetrievedChunk {
  chunk_id: string;
  source: string;
  category: string;
  text: string;
  relevance_score: number;
  distance: number;
}

export interface MatchScoreBreakdown {
  occasion: number;
  occasion_max: number;
  weather: number;
  weather_max: number;
  style: number;
  style_max: number;
  outfit_type: number;
  outfit_type_max: number;
  color: number;
  color_max: number;
  comfort: number;
  comfort_max: number;
  total: number;
  total_max: number;
}

export interface LookPieces {
  top: string;
  bottom: string;
  footwear: string;
  bag: string;
  accessories: string;
  layer?: string;
}

export interface AlternativeLook {
  id: string;
  name: string;
  match_score: number;
  badge: string;
  pieces: LookPieces;
  short_desc: string;
}

export interface OutfitRecommendation {
  title: string;
  look_name: string;
  match_score: number;
  score_breakdown: MatchScoreBreakdown;
  pieces: LookPieces;
  why_stylemate_chose_this: Array<{ aspect: string; reason: string }>;
  stylist_note: string;
  tips: {
    styling: string;
    color: string;
    accessory: string;
  };
  alternative_looks: AlternativeLook[];
  image_query: string;
  retrieved_chunks: RetrievedChunk[];
  augmented_prompt: string;
  embedding_sample: number[];
  retrieval_query: string;
  is_fallback: boolean;
  mode: string;
}

export interface SavedLook {
  id: string;
  date: string;
  preferences: UserPreferences;
  recommendation: OutfitRecommendation;
}

export interface KnowledgeSource {
  filename: string;
  category: string;
  size_bytes: number;
}

export interface SystemStats {
  total_knowledge_files: number;
  total_indexed_chunks: number;
  embedding_dimensions: number;
  embedding_model: string;
  vector_database: string;
  similarity_metric: string;
}
