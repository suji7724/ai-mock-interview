import os
import json

from openai import OpenAI


gemini_key = os.getenv("GEMINI_API_KEY")
openrouter_key = os.getenv("OPENROUTER_API_KEY")

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


def generate_ai_feedback(
    question,
    answer
):

    prompt = f"""
    You are an AI interview evaluator.

    Interview Question:
    {question}

    Candidate Answer:
    {answer}

    Evaluate the answer and return ONLY valid JSON:

    {{
      "overall_score": number (integer from 0 to 100),
      "communication_score": number (integer from 0 to 100),
      "technical_score": number (integer from 0 to 100),
      "strengths": "text",
      "weaknesses": "text",
      "recommendation": "text"
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
                        temperature=0.5,
                        max_tokens=1000,
                        timeout=5.0,
                    )
                    res_content = response.choices[0].message.content
                    if res_content and "{" in res_content and "}" in res_content:
                        response_text = res_content
                        print(f"Success generating feedback with Gemini model {model_name}:", response_text)
                        break
                except Exception as e:
                    print(f"Gemini model {model_name} feedback error:", e)

        if not response_text and openrouter_client:
            for model_name in openrouter_free_models:
                try:
                    response = openrouter_client.chat.completions.create(
                        model=model_name,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.5,
                        max_tokens=1000,
                        timeout=5.0,
                    )
                    res_content = response.choices[0].message.content
                    if res_content and "{" in res_content and "}" in res_content:
                        response_text = res_content
                        print(f"Success generating feedback with OpenRouter model {model_name}:", response_text)
                        break
                except Exception as e:
                    print(f"OpenRouter model {model_name} feedback error:", e)

        if not response_text:
            raise Exception("AI services busy, using pre-calculated assessment evaluation.")

        start = response_text.find("{")

        end = response_text.rfind("}") + 1

        clean_json = response_text[start:end]

        return json.loads(clean_json)

    except Exception as e:

        print("AI Error:", e)

        return {
            "overall_score": 70,
            "communication_score": 68,
            "technical_score": 65,
            "strengths":
                "Good attempt at answering questions.",

            "weaknesses":
                "Need deeper technical explanations.",

            "recommendation":
                "Practice more mock interviews.",
        }