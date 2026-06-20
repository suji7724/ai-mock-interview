import os

from openai import OpenAI

from dotenv import load_dotenv


# Load .env variables
load_dotenv()


client = OpenAI(

    base_url="https://openrouter.ai/api/v1",

    api_key=os.getenv(
        "OPENROUTER_API_KEY"
    ),
)


try:

    response = client.chat.completions.create(

        model="openai/gpt-3.5-turbo",

        messages=[
            {
                "role": "user",

                "content":
                    "Explain React hooks in short."
            }
        ],
    )

    print(
        response
        .choices[0]
        .message
        .content
    )

except Exception as e:

    print("AI Error:", e)