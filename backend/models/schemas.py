from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class UserPreferences(BaseModel):
    occasion: str = Field(..., description="College, Casual, Party, Wedding, Interview, Date, Festival, Travel")
    weather: str = Field(..., description="Hot, Warm, Cold, Rainy")
    style: str = Field(..., description="Minimal, Trendy, Elegant, Traditional, Casual, Sporty")
    color: str = Field(..., description="Black, White, Blue, Pink, Red, Green, Purple, Beige, Brown, Any")
    outfit_type: str = Field("Any", description="Western, Traditional, Indo-Western, Any")
    comfort: str = Field("Balanced", description="Maximum Comfort, Balanced, Fashion First")
    personal_note: Optional[str] = Field("", description="Optional custom notes or specific requests")

class RetrievedChunk(BaseModel):
    chunk_id: str
    source: str
    category: str
    text: str
    relevance_score: float
    distance: float

class MatchScoreBreakdown(BaseModel):
    occasion: int
    occasion_max: int = 30
    weather: int
    weather_max: int = 20
    style: int
    style_max: int = 20
    outfit_type: int
    outfit_type_max: int = 15
    color: int
    color_max: int = 10
    comfort: int
    comfort_max: int = 5
    total: int
    total_max: int = 100

class LookPieces(BaseModel):
    top: str
    bottom: str
    footwear: str
    bag: str
    accessories: str
    layer: Optional[str] = None

class AlternativeLook(BaseModel):
    id: str
    name: str
    match_score: int
    badge: str
    pieces: LookPieces
    short_desc: str

class OutfitRecommendation(BaseModel):
    title: str
    look_name: str
    match_score: int
    score_breakdown: MatchScoreBreakdown
    pieces: LookPieces
    why_stylemate_chose_this: List[Dict[str, str]]
    stylist_note: str
    tips: Dict[str, str]
    alternative_looks: List[AlternativeLook]
    image_query: str
    retrieved_chunks: List[RetrievedChunk]
    augmented_prompt: str
    embedding_sample: List[float]
    retrieval_query: str
    is_fallback: bool
    mode: str

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class SearchResponse(BaseModel):
    query: str
    top_k: int
    results: List[RetrievedChunk]

class ChatRequest(BaseModel):
    message: str
    preferences: Optional[UserPreferences] = None

class ChatResponse(BaseModel):
    answer: str
    retrieved_chunks: List[RetrievedChunk]
    mode: str
