import os
import json
import random
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
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


FALLBACK_MCQ_POOL = [
    # 5 Resume/Role Fallbacks
    {
        "question": "Which of the following is a key feature of React?",
        "options": ["Virtual DOM", "Real DOM only", "Direct database connection", "None of the above"],
        "correct_answer": "Virtual DOM",
        "category": "React",
        "difficulty": "Easy"
    },
    {
        "question": "In Python, which of the following data structures is immutable?",
        "options": ["List", "Dictionary", "Tuple", "Set"],
        "correct_answer": "Tuple",
        "category": "Python",
        "difficulty": "Easy"
    },
    {
        "question": "Which HTTP method is typically used to update an existing resource on a server?",
        "options": ["GET", "POST", "DELETE", "PUT"],
        "correct_answer": "PUT",
        "category": "Web Development",
        "difficulty": "Medium"
    },
    {
        "question": "What is the primary role of Git in software development?",
        "options": ["Database storage", "Version control", "Code compilation", "Hosting web servers"],
        "correct_answer": "Version control",
        "category": "Git",
        "difficulty": "Easy"
    },
    {
        "question": "What is the main purpose of an Applicant Tracking System (ATS)?",
        "options": [
            "To filter resumes automatically based on keywords and formatting",
            "To generate interview feedback reports",
            "To conduct audio interviews",
            "To write unit tests for software applications"
        ],
        "correct_answer": "To filter resumes automatically based on keywords and formatting",
        "category": "General Tech",
        "difficulty": "Easy"
    },
    # 3 Computer Networks Fallbacks
    {
        "question": "Which layer of the OSI model is responsible for routing and forwarding packets?",
        "options": ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
        "correct_answer": "Network Layer",
        "category": "Computer Networks",
        "difficulty": "Easy"
    },
    {
        "question": "What is the primary difference between TCP and UDP?",
        "options": [
            "TCP is connection-oriented and reliable, while UDP is connectionless and faster",
            "UDP is reliable, while TCP is not",
            "TCP is only used for audio streaming",
            "There is no difference"
        ],
        "correct_answer": "TCP is connection-oriented and reliable, while UDP is connectionless and faster",
        "category": "Computer Networks",
        "difficulty": "Medium"
    },
    {
        "question": "What is the function of the Domain Name System (DNS)?",
        "options": [
            "Translates domain names to IP addresses",
            "Encrypts network traffic",
            "Allocates IP addresses dynamically",
            "Monitors network performance"
        ],
        "correct_answer": "Translates domain names to IP addresses",
        "category": "Computer Networks",
        "difficulty": "Easy"
    },
    # 3 Operating Systems Fallbacks
    {
        "question": "What is process scheduling in an operating system?",
        "options": [
            "Allocating CPU execution time to active processes",
            "Saving files to the disk",
            "Compiling source code",
            "Connecting to the internet"
        ],
        "correct_answer": "Allocating CPU execution time to active processes",
        "category": "Operating Systems",
        "difficulty": "Medium"
    },
    {
        "question": "What is a deadlock in an operating system?",
        "options": [
            "A state where a set of processes are blocked because each process holds a resource and waits for another",
            "A crash of the core kernel code",
            "When a CPU runs out of memory",
            "None of the above"
        ],
        "correct_answer": "A state where a set of processes are blocked because each process holds a resource and waits for another",
        "category": "Operating Systems",
        "difficulty": "Hard"
    },
    {
        "question": "What is virtual memory in an operating system?",
        "options": [
            "Memory management technique using secondary storage as an extension of RAM",
            "Physical memory installed on virtual machines only",
            "Cloud storage space",
            "ROM memory"
        ],
        "correct_answer": "Memory management technique using secondary storage as an extension of RAM",
        "category": "Operating Systems",
        "difficulty": "Medium"
    },
    # 4 DBMS Fallbacks
    {
        "question": "What does ACID stand for in DBMS transactions?",
        "options": [
            "Atomicity, Consistency, Isolation, Durability",
            "Authority, Complexity, Indexing, Delivery",
            "Aggregation, Concurrency, Integrity, Distribution",
            "Access, Control, Information, Database"
        ],
        "correct_answer": "Atomicity, Consistency, Isolation, Durability",
        "category": "DBMS",
        "difficulty": "Medium"
    },
    {
        "question": "Which SQL constraint uniquely identifies each record in a database table?",
        "options": ["FOREIGN KEY", "UNIQUE", "PRIMARY KEY", "NOT NULL"],
        "correct_answer": "PRIMARY KEY",
        "category": "DBMS",
        "difficulty": "Easy"
    },
    {
        "question": "What is a Foreign Key in a database relationship?",
        "options": [
            "A field in one table that refers to the Primary Key in another table",
            "A key that is encrypted",
            "A key that can only hold negative values",
            "None of the above"
        ],
        "correct_answer": "A field in one table that refers to the Primary Key in another table",
        "category": "DBMS",
        "difficulty": "Easy"
    },
    {
        "question": "What is database normalization?",
        "options": [
            "Organizing data to minimize redundancy and dependency",
            "Backing up the database structure",
            "Converting SQL queries to NoSQL format",
            "Restarting the database engine"
        ],
        "correct_answer": "Organizing data to minimize redundancy and dependency",
        "category": "DBMS",
        "difficulty": "Medium"
    }
]


def generate_assessment_questions(role, resume_text):
    prompt = f"""
    You are an expert technical interviewer and computer science evaluator.
    Candidate Role: {role}
    Candidate Resume Text:
    {resume_text}

    Generate exactly 10 multiple-choice questions (MCQs) to evaluate the candidate's technical skills.
    
    The questions must be structured as follows:
    - Questions 1 to 4: High-quality questions based on the candidate's resume projects, skills, and target role.
    - Questions 5 to 10: High-quality fundamental questions covering core computer science subjects:
      * Computer Networks (CN)
      * Operating Systems (OS)
      * Database Management Systems (DBMS)
      (Ensure a balanced spread across these three core subjects)

    Rules for each MCQ:
    1. Each question must have exactly 4 choices (options).
    2. One option must be correct.
    3. Return ONLY a valid JSON array matching the schema below.
    4. Do not include markdown formatting (like ```json), introduction, or conversational text. Return only the raw JSON.

    Schema:
    [
      {{
        "question": "Question text...",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "Option A",  // Must match one of the options EXACTLY
        "category": "Topic (e.g. React, Computer Networks, Operating Systems, DBMS)",
        "difficulty": "Easy" or "Medium" or "Hard"
      }},
      ...
    ]
    """

    response_text = None
    last_exception = None

    # 1. Try Gemini
    if gemini_client:
        try:
            response = gemini_client.chat.completions.create(
                model="gemini-2.0-flash",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=2000,
                timeout=7.0,
            )
            response_text = response.choices[0].message.content
            print("MCQ Generator (Gemini) Raw Response:", response_text)
        except Exception as e:
            print("Gemini MCQ Generation failed, trying OpenRouter. Error:", e)
            last_exception = e

    # 2. Try OpenRouter Fallback
    if not response_text and openrouter_client:
        try:
            response = openrouter_client.chat.completions.create(
                model="openrouter/auto",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=2000,
                timeout=7.0,
            )
            response_text = response.choices[0].message.content
            print("MCQ Generator (OpenRouter) Raw Response:", response_text)
        except Exception as e:
            print("OpenRouter MCQ Generation failed. Error:", e)
            last_exception = e

    # 3. Handle Parsing or Fallback to Pool
    try:
        if not response_text:
            if last_exception:
                raise last_exception
            raise Exception("No active AI service available.")

        # Parse JSON safely
        start = response_text.find("[")
        end = response_text.rfind("]") + 1
        clean_json = response_text[start:end]

        parsed = json.loads(clean_json)
        # Verify we got questions
        if isinstance(parsed, list) and len(parsed) > 0:
            return parsed
        raise ValueError("Invalid array format")

    except Exception as e:
        print("MCQ AI Error:", e)
        # Return a randomized sample from the fallback pool to avoid duplicate questions
        return random.sample(FALLBACK_MCQ_POOL, min(10, len(FALLBACK_MCQ_POOL)))
