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

    try:
        response_text = None
        last_exception = None

        log_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ai_service_debug.log")

        if gemini_client:
            try:
                response = gemini_client.chat.completions.create(
                    model="gemini-2.0-flash",
                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.3,
                    max_tokens=1500,
                )
                response_text = response.choices[0].message.content
                with open(log_path, "a") as f:
                    f.write("Gemini call succeeded.\n")
            except Exception as e:
                with open(log_path, "a") as f:
                    f.write(f"Gemini call failed: {str(e)}\n")
                last_exception = e

        if not response_text and openrouter_client:
            try:
                response = openrouter_client.chat.completions.create(
                    model="openrouter/auto",
                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.3,
                    max_tokens=1500,
                )
                response_text = response.choices[0].message.content
                with open(log_path, "a") as f:
                    f.write("OpenRouter call succeeded.\n")
            except Exception as e:
                with open(log_path, "a") as f:
                    f.write(f"OpenRouter call failed: {str(e)}\n")
                last_exception = e

        if not response_text:
            if last_exception:
                raise last_exception
            raise Exception("No active AI service available.")

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
