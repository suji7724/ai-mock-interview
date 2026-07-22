import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Ensure env variables are loaded
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(dotenv_path)

gemini_key = os.getenv("GEMINI_API_KEY")
openrouter_key = os.getenv("OPENROUTER_API_KEY")

# Log keys loading state for debugging
with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ai_service_debug.log"), "a") as f:
    f.write(f"Init: gemini_key exists: {bool(gemini_key)}, openrouter_key exists: {bool(openrouter_key)}\n")

gemini_client = None
if gemini_key:
    gemini_client = OpenAI(
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
        api_key=gemini_key,
    )

openrouter_client = None
if openrouter_key:
    openrouter_client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=openrouter_key,
    )

def analyze_resume_with_ai(resume_text):
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) reviewer and hiring manager.
    Analyze the candidate's resume and provide an evaluation.

    Candidate Resume Text:
    {resume_text}

    Evaluate the resume and return ONLY a valid JSON object matching the following schema.
    Do not add any markup, tags, markdown formatting (like ```json), introduction or conversational text. Return only the raw JSON.

    Schema:
    {{
      "ats_score": number (0 to 100 representing ATS compatibility, keyword matching, and structure),
      "job_readiness": "Ready" or "Needs Improvement" or "Not Ready",
      "job_readiness_reason": "Explanation of their current job market readiness and where they stand.",
      "strengths": ["array of 3-5 core professional strengths or highlights found in the resume"],
      "improvements": ["array of 3-5 actionable improvement suggestions regarding formatting, details, or keywords"],
      "skills_identified": ["array of technical or soft skills successfully identified in the resume"]
    }}
    """

    openrouter_free_models = [
        "google/gemini-2.5-flash:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "deepseek/deepseek-r1:free",
        "qwen/qwen-2.5-coder-32b-instruct:free",
        "mistralai/mistral-7b-instruct:free",
    ]

    gemini_models = [
        "gemini-1.5-flash",
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash",
        "gemini-1.5-pro",
    ]

    try:
        response_text = None

        if gemini_client:
            for model_name in gemini_models:
                try:
                    response = gemini_client.chat.completions.create(
                        model=model_name,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.3,
                        max_tokens=1500,
                        timeout=7.0,
                    )
                    res_content = response.choices[0].message.content
                    if res_content and "{" in res_content and "}" in res_content:
                        response_text = res_content
                        print(f"Success analyzing resume with Gemini model {model_name}:", response_text)
                        break
                except Exception as e:
                    print(f"Gemini resume model {model_name} error:", e)

        if not response_text and openrouter_client:
            for model_name in openrouter_free_models:
                try:
                    response = openrouter_client.chat.completions.create(
                        model=model_name,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.3,
                        max_tokens=1500,
                        timeout=7.0,
                    )
                    res_content = response.choices[0].message.content
                    if res_content and "{" in res_content and "}" in res_content:
                        response_text = res_content
                        print(f"Success analyzing resume with OpenRouter model {model_name}:", response_text)
                        break
                except Exception as e:
                    print(f"OpenRouter resume model {model_name} error:", e)

        if not response_text:
            raise Exception("AI Resume Analysis service is temporarily rate-limited. Please try again in a few seconds.")

        # Parse JSON safely
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        clean_json = response_text[start:end]

        return json.loads(clean_json)

    except Exception as e:
        log_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ai_service_debug.log")
        with open(log_path, "a") as f:
            f.write(f"Outer Exception: {str(e)}\n")
        raise Exception("AI Resume Analysis service is temporarily rate-limited or unavailable. Please try again in a few seconds.")
