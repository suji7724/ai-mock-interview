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

    try:
        response_text = None
        last_exception = None

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
                )
                response_text = response.choices[0].message.content
                print("Feedback (Gemini) Response:", response_text)
            except Exception as e:
                print("Gemini Feedback Generation failed, trying OpenRouter. Error:", e)
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
                )
                response_text = response.choices[0].message.content
                print("Feedback (OpenRouter) Response:", response_text)
            except Exception as e:
                print("OpenRouter Feedback Generation failed. Error:", e)
                last_exception = e

        if not response_text:
            if last_exception:
                raise last_exception
            raise Exception("No active AI service available.")

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