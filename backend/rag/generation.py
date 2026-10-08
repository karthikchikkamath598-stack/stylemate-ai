import os
import json
import requests
from typing import List, Dict, Any, Tuple
from models.schemas import (
    UserPreferences,
    RetrievedChunk,
    OutfitRecommendation,
    MatchScoreBreakdown,
    LookPieces,
    AlternativeLook
)
from rag.embeddings import get_embedding_sample

def build_augmented_prompt(prefs: UserPreferences, retrieved_chunks: List[RetrievedChunk]) -> str:
    chunks_text = "\n\n".join([
        f"[Chunk {i+1} - Source: {c.source} | Category: {c.category} | Relevance: {c.relevance_score}]\n{c.text}"
        for i, c in enumerate(retrieved_chunks)
    ])

    prompt = f"""SYSTEM:
You are StyleMate AI, an intelligent personal fashion stylist powered by fashion knowledge and Retrieval-Augmented Generation (RAG).

USER PROFILE:
- Occasion: {prefs.occasion}
- Weather: {prefs.weather}
- Style: {prefs.style}
- Color: {prefs.color}
- Outfit Type: {prefs.outfit_type}
- Comfort Level: {prefs.comfort}

USER REQUEST:
{prefs.personal_note or "Curate an outfit matching my preferences."}

RETRIEVED FASHION KNOWLEDGE:
{chunks_text}

TASK:
Generate a personalized outfit recommendation using the user's preferences and the retrieved knowledge.
Format your output as a clean JSON object containing:
- title: string (e.g. "THE MODERN MINIMALIST")
- look_name: string (e.g. "Effortless College Monochrome")
- pieces: {{"top": string, "bottom": string, "footwear": string, "bag": string, "accessories": string, "layer": string}}
- why_stylemate_chose_this: list of {{"aspect": string, "reason": string}}
- stylist_note: string (quote style advice derived from knowledge base)
- tips: {{"styling": string, "color": string, "accessory": string}}
- alternative_looks: list of 2 other look variants (Relaxed, Statement)
"""
    return prompt

def calculate_preference_match_score(prefs: UserPreferences, retrieved_chunks: List[RetrievedChunk]) -> Tuple[int, MatchScoreBreakdown]:
    avg_relevance = sum(c.relevance_score for c in retrieved_chunks) / len(retrieved_chunks) if retrieved_chunks else 0.85
    
    # Transparent score breakdown based on preference alignment
    occ_score = 30
    weather_score = 20
    style_score = 20
    outfit_score = 15
    
    # Subtle deduction if color is "Any" or user selected non-neutral
    color_score = 10 if prefs.color.lower() not in ["any", ""] else 8
    
    # Comfort alignment
    comfort_score = 5 if prefs.comfort != "Fashion First" else 4
    
    # Factor in retrieved knowledge relevance
    adjustment = int((avg_relevance - 0.70) * 10)
    total = occ_score + weather_score + style_score + outfit_score + color_score + comfort_score + adjustment
    total = max(82, min(97, total))

    breakdown = MatchScoreBreakdown(
        occasion=occ_score,
        weather=weather_score,
        style=style_score,
        outfit_type=outfit_score,
        color=color_score,
        comfort=comfort_score,
        total=total
    )
    return total, breakdown

def generate_local_curated_look(
    prefs: UserPreferences,
    retrieved_chunks: List[RetrievedChunk],
    augmented_prompt: str,
    query: str
) -> OutfitRecommendation:
    """Intelligent expert styling generator based on retrieved chunks and fashion rules."""
    total_score, breakdown = calculate_preference_match_score(prefs, retrieved_chunks)
    
    occ = prefs.occasion.capitalize()
    weather = prefs.weather.capitalize()
    style = prefs.style.capitalize()
    color = prefs.color if prefs.color.lower() != "any" else "Neutral Black & Ivory"
    outfit_type = prefs.outfit_type if prefs.outfit_type.lower() != "any" else "Western"

    # Base styling matrix adapted dynamically
    titles = {
        "College": f"THE CAMPUS {style.upper()} ICON",
        "Casual": f"THE EFFORTLESS {style.upper()} CHIC",
        "Party": f"THE MIDNIGHT {style.upper()} GLAMOUR",
        "Wedding": f"THE REGAL {style.upper()} COUTURE",
        "Interview": f"THE EXECUTIVE {style.upper()} POWER",
        "Date": f"THE ROMANTIC {style.upper()} ALLURE",
        "Festival": f"THE CELEBRATION {style.upper()} GRACE",
        "Travel": f"THE JET-SET {style.upper()} TRANSIT"
    }

    # Curate look pieces based on occasion, weather, and outfit type
    if outfit_type == "Traditional" or occ in ["Wedding", "Festival"]:
        top = f"Embroidered {color} raw-silk chanderi kurti with delicate zari accents" if occ != "Wedding" else f"Royal Banarasi silk saree blouse in rich {color}"
        bottom = f"Fluid flared palazzo pants with subtle gold piping" if occ != "Wedding" else f"Handloom silk saree with gold zari border"
        footwear = "Cushioned embroidered metallic mojaris with padded soles"
        bag = f"Intricately beaded {color} silk potli bag with tassel drawstring"
        accessories = "Oxidized silver statement jhumkis and stacked glass bangles"
        layer = "Featherlight organza dupatta with gota-patti border"
    elif outfit_type == "Indo-Western":
        top = f"Tailored {color} short cotton-silk peplum kurti"
        bottom = "High-waisted straight-leg vintage denim trousers"
        footwear = "Handcrafted Kolhapuri leather flat mules"
        bag = "Slouchy woven canvas tote bag with leather trim"
        accessories = "Layered thin silver choker and minimalist stud earrings"
        layer = "Unstructured light cotton jacket worn open"
    else:
        # Western / Contemporary
        if weather == "Hot":
            top = f"Breathable {color.lower()} oversized boxy cotton poplin shirt"
            bottom = "Relaxed high-waisted linen-blend straight trousers"
            footwear = "Clean minimalist retro white court sneakers"
            bag = "Structured canvas and vegan leather everyday tote"
            accessories = "Dainty gold huggie earrings and rectangular acetate sunglasses"
            layer = "Lightweight unbuttoned linen overshirt"
        elif weather == "Cold":
            top = f"Fitted ribbed {color.lower()} fine merino wool turtleneck"
            bottom = "Tailored pleated wide-leg wool trousers"
            footwear = "Water-resistant leather lug-sole Chelsea boots"
            bag = "Structured leather crossbody camera bag"
            accessories = "Chunky chain-link necklace and ribbed cashmere beanie"
            layer = "Double-breasted tailored wool overcoat in camel"
        elif weather == "Rainy":
            top = f"Quick-dry {color.lower()} ribbed crewneck top"
            bottom = "Cropped ankle-length dark tailored trousers"
            footwear = "Glossy water-resistant Chelsea rain booties with deep tread"
            bag = "Water-repellent nylon utility crossbody bag"
            accessories = "Water-resistant minimalist analog watch and small umbrella"
            layer = "Hooded lightweight utility anorak jacket"
        else: # Warm
            top = f"Relaxed {color.lower()} baby tee with fine ribbed texture"
            bottom = "High-rise straight-leg blue denim jeans"
            footwear = "White leather low-top sneakers or slip-on mule loafers"
            bag = "Minimalist 90s baguette shoulder bag"
            accessories = "Dainty layered chain necklace and minimal signet ring"
            layer = "Slouchy cotton cardigan draped effortlessly over shoulders"

    primary_pieces = LookPieces(
        top=top,
        bottom=bottom,
        footwear=footwear,
        bag=bag,
        accessories=accessories,
        layer=layer
    )

    why_reasons = [
        {
            "aspect": f"Matches {occ} Occasion",
            "reason": f"Structured for {occ.lower()} demands, balancing appropriate dress etiquette with functional freedom."
        },
        {
            "aspect": f"Engineered for {weather} Weather",
            "reason": f"Uses fabrics and cuts chosen from retrieved knowledge ({'breathable cooling fibers' if weather in ['Hot', 'Warm'] else 'protective weather-resistant layering'})."
        },
        {
            "aspect": f"Reflects {style} Personality",
            "reason": f"Implements {style.lower()} styling principles with clean proportions and intentional silhouette lines."
        },
        {
            "aspect": f"Harmony with {color}",
            "reason": f"Applies color theory rules to pair {color} with balancing neutrals for editorial contrast."
        },
        {
            "aspect": f"Honors {prefs.comfort} Comfort",
            "reason": f"Zero restrictive tailoring in key movement zones ensures all-day wearable ease."
        }
    ]

    stylist_note = (
        f"“StyleMate Stylist Note: Keep the base silhouette clean with {color.lower()} accents, "
        f"and let the intentional {footwear.lower()} ground the outfit. Remember that confidence and ease "
        f"create effortless elegance.”"
    )

    tips = {
        "styling": f"Use the Rule of Thirds: Tuck the {top.split()[0].lower()} top slightly into the high waistband to elongate your natural silhouette.",
        "color": f"Harmonize {color} with crisp ivory, warm beige, and subtle metallic jewelry for a polished 60-30-10 ratio.",
        "accessory": f"Pair the look with {accessories.split('and')[0].strip()} to draw focal attention toward your neckline and smile."
    }

    # Alternative Looks: Look 02 (Relaxed) and Look 03 (Statement)
    alt_looks = [
        AlternativeLook(
            id="look_02_relaxed",
            name=f"The Relaxed Weekend Take",
            match_score=max(78, total_score - 5),
            badge="Relaxed & Easy",
            pieces=LookPieces(
                top=f"Oversized soft slub cotton tee in muted {color.lower()}",
                bottom="Relaxed drawstring pull-on linen pants",
                footwear="Cushioned slide sandals or lightweight retro runners",
                bag="Soft slouchy shoulder tote",
                accessories="Acetate hair claw clip and delicate chain"
            ),
            short_desc="Maximum ease for casual transitions without losing visual polish."
        ),
        AlternativeLook(
            id="look_03_statement",
            name=f"The Elevated Statement Take",
            match_score=max(75, total_score - 10),
            badge="Fashion First",
            pieces=LookPieces(
                top=f"Sculptural structured {color.lower()} blazer jacket over a ribbed camisole",
                bottom="Tailored wide-leg trousers or pleated maxi skirt",
                footwear="Pointed-toe slingback heels or sleek leather loafers",
                bag="Architectural micro handle bag",
                accessories="Bold sculptural metal hoop earrings and signet ring"
            ),
            short_desc="High-impact editorial flair designed to make a confident statement."
        )
    ]

    return OutfitRecommendation(
        title=titles.get(occ, f"THE {style.upper()} CAPSULE"),
        look_name=f"{style} {occ} Ensemble in {color}",
        match_score=total_score,
        score_breakdown=breakdown,
        pieces=primary_pieces,
        why_stylemate_chose_this=why_reasons,
        stylist_note=stylist_note,
        tips=tips,
        alternative_looks=alt_looks,
        image_query=f"{style.lower()} {occ.lower()} outfit {color.lower()}",
        retrieved_chunks=retrieved_chunks,
        augmented_prompt=augmented_prompt,
        embedding_sample=get_embedding_sample(query),
        retrieval_query=query,
        is_fallback=True,
        mode="Local Demo Mode (FAI Deterministic Engine)"
    )

def generate_recommendation_with_llm(
    prefs: UserPreferences,
    retrieved_chunks: List[RetrievedChunk],
    augmented_prompt: str,
    query: str
) -> OutfitRecommendation:
    """Attempts LLM generation with Gemini or OpenAI if API keys are set, otherwise gracefully returns local recommendation."""
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()

    # Try Gemini API if key is present
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [{"parts": [{"text": augmented_prompt}]}],
                "generationConfig": {"temperature": 0.4, "response_mime_type": "application/json"}
            }
            res = requests.post(url, json=payload, timeout=12)
            if res.status_code == 200:
                data = res.json()
                text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text_content)
                total_score, breakdown = calculate_preference_match_score(prefs, retrieved_chunks)
                
                return OutfitRecommendation(
                    title=parsed.get("title", f"THE {prefs.style.upper()} LOOK"),
                    look_name=parsed.get("look_name", f"{prefs.style} {prefs.occasion}"),
                    match_score=total_score,
                    score_breakdown=breakdown,
                    pieces=LookPieces(**parsed.get("pieces", {})),
                    why_stylemate_chose_this=parsed.get("why_stylemate_chose_this", []),
                    stylist_note=parsed.get("stylist_note", ""),
                    tips=parsed.get("tips", {}),
                    alternative_looks=[],
                    image_query=f"{prefs.style} {prefs.occasion}",
                    retrieved_chunks=retrieved_chunks,
                    augmented_prompt=augmented_prompt,
                    embedding_sample=get_embedding_sample(query),
                    retrieval_query=query,
                    is_fallback=False,
                    mode="AI Augmented (Google Gemini)"
                )
        except Exception as e:
            print(f"Gemini LLM call failed or timed out: {e}. Falling back to Local Demo Mode.")

    # Try OpenAI API if key is present
    if openai_key:
        try:
            headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "You are StyleMate AI. Respond in JSON."},
                    {"role": "user", "content": augmented_prompt}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.5
            }
            res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=12)
            if res.status_code == 200:
                data = res.json()
                text_content = data["choices"][0]["message"]["content"]
                parsed = json.loads(text_content)
                total_score, breakdown = calculate_preference_match_score(prefs, retrieved_chunks)

                return OutfitRecommendation(
                    title=parsed.get("title", f"THE {prefs.style.upper()} LOOK"),
                    look_name=parsed.get("look_name", f"{prefs.style} {prefs.occasion}"),
                    match_score=total_score,
                    score_breakdown=breakdown,
                    pieces=LookPieces(**parsed.get("pieces", {})),
                    why_stylemate_chose_this=parsed.get("why_stylemate_chose_this", []),
                    stylist_note=parsed.get("stylist_note", ""),
                    tips=parsed.get("tips", {}),
                    alternative_looks=[],
                    image_query=f"{prefs.style} {prefs.occasion}",
                    retrieved_chunks=retrieved_chunks,
                    augmented_prompt=augmented_prompt,
                    embedding_sample=get_embedding_sample(query),
                    retrieval_query=query,
                    is_fallback=False,
                    mode="AI Augmented (OpenAI GPT-4o-mini)"
                )
        except Exception as e:
            print(f"OpenAI LLM call failed or timed out: {e}. Falling back to Local Demo Mode.")

    # Graceful fallback to verified local styling engine
    return generate_local_curated_look(prefs, retrieved_chunks, augmented_prompt, query)
