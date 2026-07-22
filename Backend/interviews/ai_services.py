import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

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


def generate_resume_questions(
    role,
    resume_text,
    count=7
):

    prompt = f"""
You are a professional technical interviewer.

Candidate Role:
{role}

Candidate Resume:
{resume_text}

Generate exactly {count} high-quality, customized interview questions based on:

- Projects
- Skills
- Technologies
- Experience

Rules:
- Ask personalized questions.
- Questions should be relevant to the role.
- Return ONLY the questions.
- One question per line (do not prefix with numbers or bullet points).
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
                        temperature=0.7,
                        max_tokens=1000,
                        timeout=5.0,
                    )
                    res_content = response.choices[0].message.content
                    if res_content and len(res_content.strip()) > 10:
                        response_text = res_content
                        print(f"Success with Gemini model {model_name}:", response_text)
                        break
                except Exception as e:
                    print(f"Gemini model {model_name} failed. Error:", e)

        if not response_text and openrouter_client:
            for model_name in openrouter_free_models:
                try:
                    response = openrouter_client.chat.completions.create(
                        model=model_name,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.7,
                        max_tokens=1000,
                        timeout=5.0,
                    )
                    res_content = response.choices[0].message.content
                    if res_content and len(res_content.strip()) > 10:
                        response_text = res_content
                        print(f"Success with OpenRouter model {model_name}:", response_text)
                        break
                except Exception as e:
                    print(f"OpenRouter model {model_name} failed. Error:", e)

        if not response_text:
            raise Exception("AI services currently busy, using preset question fallback.")

        return response_text

    except Exception as e:

        print(
            "Resume Question Error:",
            str(e)
        )

        return """
Tell me about your most significant project.
What technologies are you most comfortable with?
Describe a challenge you solved recently.
"""
