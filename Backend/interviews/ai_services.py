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
    resume_text
):

    prompt = f"""
You are a professional technical interviewer.

Candidate Role:
{role}

Candidate Resume:
{resume_text}

Generate exactly 3 interview questions based on:

- Projects
- Skills
- Technologies
- Experience

Rules:
- Ask personalized questions.
- Questions should be relevant to the role.
- Return ONLY the questions.
- One question per line.
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
                    temperature=0.7,
                    max_tokens=1000,
                )
                response_text = response.choices[0].message.content
                print("Generated Questions (Gemini) Response:", response_text)
            except Exception as e:
                print("Gemini Question Generation failed, trying OpenRouter. Error:", e)
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
                    temperature=0.7,
                    max_tokens=1000,
                )
                response_text = response.choices[0].message.content
                print("Generated Questions (OpenRouter) Response:", response_text)
            except Exception as e:
                print("OpenRouter Question Generation failed. Error:", e)
                last_exception = e

        if not response_text:
            if last_exception:
                raise last_exception
            raise Exception("No active AI service available.")

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
