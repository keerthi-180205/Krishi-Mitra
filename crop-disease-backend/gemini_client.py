# gemini_client.py

# --- SSL FIX (keep at very top) ---
import os
import certifi
os.environ["GRPC_DEFAULT_SSL_ROOTS_FILE_PATH"] = certifi.where()
# ----------------------------------

import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

# --- Load .env from project root and from this file's directory ---
project_root = Path(__file__).resolve().parent.parent  # adjust if needed
this_dir = Path(__file__).resolve().parent

# Try both locations: project root and current dir
load_dotenv(project_root / ".env")
load_dotenv(this_dir / ".env")

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        "❌ GEMINI_API_KEY not found in environment.\n"
        "Make sure you have a .env file with:\n"
        "GEMINI_API_KEY=your_key_here"
    )

print(f"🔑 GEMINI Key found: {api_key[:6]}******")

genai.configure(api_key=api_key)


def _select_model_name() -> str:
    """
    Auto-detect a usable model for this API key.
    Priority:
      1. gemini-1.5-flash
      2. gemini-1.5-pro
      3. gemini-pro
    Falls back to first model that supports 'generateContent'.
    """
    print("=== 🔍 Fetching available models for this API key ===")
    try:
        models = list(genai.list_models())
    except Exception as e:
        raise RuntimeError(f"❌ Failed to list models for this API key: {e!r}")

    if not models:
        raise RuntimeError(
            "❌ No models returned for this API key. "
            "This usually means the key is not a valid Gemini API key. "
            "Create a new key from Google AI Studio (NOT Vertex / old PaLM)."
        )

    # Log all models once
    for m in models:
        try:
            print(f" - {m.name} | methods: {getattr(m, 'supported_generation_methods', [])}")
        except Exception:
            # Just in case some model object is weird
            print(f" - {m}")

    # Filter only models that support generateContent
    gencontent_models = [
        m for m in models
        if "generateContent" in getattr(m, "supported_generation_methods", [])
    ]

    if not gencontent_models:
        raise RuntimeError(
            "❌ None of the available models support 'generateContent'.\n"
            "Your key might be an old PaLM key (text-bison/chat-bison only).\n"
            "Please generate a fresh Gemini API key from Google AI Studio."
        )

    # Preferred names (exact match)
    preferred_order = [
        "models/gemini-2.5-flash",
        "models/gemini-2.5-pro",
        "models/gemini-1.5-flash",
        "models/gemini-1.5-pro",
        "models/gemini-pro",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
    ]

    available_names = {m.name for m in gencontent_models}

    for pref in preferred_order:
        if pref in available_names:
            print(f"✅ Selected preferred model: {pref}")
            return pref

    # Otherwise take the first generateContent model
    chosen = gencontent_models[0].name
    print(f"ℹ️ No preferred Gemini model found, using first generateContent model: {chosen}")
    return chosen


# --- Select and create the model once ---
MODEL_NAME = _select_model_name()
model = genai.GenerativeModel(MODEL_NAME)
print(f"🤖 Using model: {MODEL_NAME}")


def _call_gemini(prompt: str) -> str:
    """
    Internal helper to call Gemini safely and extract text.
    Returns "" on failure so caller can decide fallback.
    """
    from textwrap import shorten

    try:
        print("✉️  [Gemini] Sending prompt...")
        resp = model.generate_content(prompt)

        # Newer SDKs: resp.text is set
        if hasattr(resp, "text") and resp.text:
            text = resp.text
            print("✅ [Gemini] Received text (len:", len(text), ")")
            return text

        # Fallback: build from candidates
        parts = []
        if hasattr(resp, "candidates"):
            for cand in resp.candidates:
                content = getattr(cand, "content", None)
                if content is None:
                    continue
                for part in getattr(content, "parts", []):
                    if hasattr(part, "text"):
                        parts.append(part.text)

        if parts:
            text = "\n".join(parts)
            print("✅ [Gemini] Built text from candidates (len:", len(text), ")")
            return text

        print("⚠️ [Gemini] Response had no text. Raw response (short):",
              shorten(str(resp), width=200, placeholder="..."))
        return ""

    except Exception as e:
        # Log error in backend and pass message up if you want
        print(f"🔴 GEMINI ERROR: {e!r}")
        return ""


def get_gemini_response(disease_name: str) -> str:
    """
    Function 1: Disease Advisory for detected crop disease.
    """
    prompt = f"""
    You are 'Krishi Mitra', an agricultural expert for Karnataka.
    A crop disease has been detected: {disease_name}.
    
    Please provide the following details in simple KANNADA:
    1. ವಿವರಣೆ: ಈ ರೋಗ ಏನು?
    2. ಚಿಕಿತ್ಸೆ: ನೈಸರ್ಗಿಕ ಹಾಗು ರಸಾಯನಿಕ ಪರಿಹಾರಗಳು (ಪ್ರಯೋಗಿಸಲು ಸುಲಭವಾಗಿರಲಿ).
    3. ತಡೆಗಟ್ಟುವಿಕೆ: ಮುಂದೆ ಈ ರೋಗ ಮತ್ತೆ ಬರದಂತೆ ಹೇಗೆ ನೋಡಿಕೊಳ್ಳಬೇಕು?

    Tone: Extremely simple, friendly and encouraging for small farmers.
    """
    text = _call_gemini(prompt)
    if not text or not text.strip():
        return "ಕ್ಷಮಿಸಿ (Sorry), advisory unavailable right now."
    return text.strip()


def get_assistant_response(question: str) -> str:
    """
    Function 2: General QA Assistant for farmers.
    """
    prompt = f"""
    You are 'Krishi Mitra', a helpful agricultural assistant for farmers in Karnataka.
    Answer the following question in VERY SIMPLE KANNADA, 
    using short sentences and practical examples.

    Farmer's question: {question}
    """
    text = _call_gemini(prompt)
    if not text or not text.strip():
        return "ಕ್ಷಮಿಸಿ (Sorry), I cannot answer right now."
    return text.strip()
