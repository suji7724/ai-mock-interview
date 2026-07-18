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
    # 1. Verbal Ability (5 Questions)
    {
        "question": "Choose the correct synonym for 'Meticulous'.",
        "options": ["Careless", "Thorough", "Lazy", "Rough"],
        "correct_answer": "Thorough",
        "category": "Verbal Ability",
        "difficulty": "Easy"
    },
    {
        "question": "Identify the correct antonym for 'Transparent'.",
        "options": ["Clear", "Opaque", "Lucid", "Bright"],
        "correct_answer": "Opaque",
        "category": "Verbal Ability",
        "difficulty": "Easy"
    },
    {
        "question": "Complete the sentence: Neither of the candidates _____ filled out the application form correctly.",
        "options": ["has", "have", "are", "were"],
        "correct_answer": "has",
        "category": "Verbal Ability",
        "difficulty": "Medium"
    },
    {
        "question": "Find the correctly spelled word.",
        "options": ["Accommodate", "Acommodate", "Accomodate", "Acomodate"],
        "correct_answer": "Accommodate",
        "category": "Verbal Ability",
        "difficulty": "Easy"
    },
    {
        "question": "Select the idiom that means 'to face a difficult situation with courage'.",
        "options": ["Bite the bullet", "Break the ice", "Spill the beans", "Burn the midnight oil"],
        "correct_answer": "Bite the bullet",
        "category": "Verbal Ability",
        "difficulty": "Medium"
    },

    # 2. Logical Reasoning (5 Questions)
    {
        "question": "If CAT is coded as 3120, how is DOG coded in the same language?",
        "options": ["4157", "41512", "4147", "41520"],
        "correct_answer": "4157",
        "category": "Logical Reasoning",
        "difficulty": "Medium"
    },
    {
        "question": "Pointing to a photograph, a man said 'I have no brother or sister, but that man's father is my father's son.' Whose photograph was it?",
        "options": ["His own", "His son's", "His father's", "His nephew's"],
        "correct_answer": "His son's",
        "category": "Logical Reasoning",
        "difficulty": "Medium"
    },
    {
        "question": "Which number completes the series: 2, 6, 12, 20, 30, ___?",
        "options": ["40", "42", "44", "46"],
        "correct_answer": "42",
        "category": "Logical Reasoning",
        "difficulty": "Medium"
    },
    {
        "question": "Look at the pattern: 80, 10, 70, 15, 60, ___ What number should come next?",
        "options": ["20", "25", "50", "30"],
        "correct_answer": "20",
        "category": "Logical Reasoning",
        "difficulty": "Easy"
    },
    {
        "question": "All apples are fruits. All fruits are healthy. Which conclusion follows logically?",
        "options": ["All apples are healthy", "All healthy items are apples", "Some fruits are not healthy", "No apples are healthy"],
        "correct_answer": "All apples are healthy",
        "category": "Logical Reasoning",
        "difficulty": "Easy"
    },

    # 3. Operating System (5 Questions)
    {
        "question": "What is process scheduling in an operating system?",
        "options": ["Allocating CPU execution time to active processes", "Saving files to disk", "Compiling source code", "Connecting to network"],
        "correct_answer": "Allocating CPU execution time to active processes",
        "category": "Operating System",
        "difficulty": "Easy"
    },
    {
        "question": "What is a deadlock in an operating system?",
        "options": [
            "A state where a set of processes are blocked waiting for resources held by each other",
            "A crash of the CPU kernel",
            "When RAM memory is completely full",
            "None of the above"
        ],
        "correct_answer": "A state where a set of processes are blocked waiting for resources held by each other",
        "category": "Operating System",
        "difficulty": "Medium"
    },
    {
        "question": "What is Virtual Memory?",
        "options": [
            "Memory management technique using secondary storage as an extension of RAM",
            "Physical RAM installed on virtual machines",
            "Cloud storage space",
            "ROM memory"
        ],
        "correct_answer": "Memory management technique using secondary storage as an extension of RAM",
        "category": "Operating System",
        "difficulty": "Medium"
    },
    {
        "question": "Which of the following is NOT a valid CPU scheduling algorithm?",
        "options": ["Round Robin", "First-Come, First-Served", "Shortest Job First", "Linear Regression"],
        "correct_answer": "Linear Regression",
        "category": "Operating System",
        "difficulty": "Easy"
    },
    {
        "question": "What is thrashing in an operating system?",
        "options": [
            "Excessive swapping of pages between RAM and disk leading to high CPU idle time",
            "Overclocking the main processor",
            "Hard drive failure",
            "Defragmenting memory"
        ],
        "correct_answer": "Excessive swapping of pages between RAM and disk leading to high CPU idle time",
        "category": "Operating System",
        "difficulty": "Hard"
    },

    # 4. Computer Network (5 Questions)
    {
        "question": "Which OSI model layer is responsible for routing packets across networks?",
        "options": ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
        "correct_answer": "Network Layer",
        "category": "Computer Network",
        "difficulty": "Easy"
    },
    {
        "question": "What is the primary difference between TCP and UDP?",
        "options": [
            "TCP is connection-oriented and reliable, while UDP is connectionless and faster",
            "UDP is connection-oriented",
            "TCP is faster than UDP",
            "There is no difference"
        ],
        "correct_answer": "TCP is connection-oriented and reliable, while UDP is connectionless and faster",
        "category": "Computer Network",
        "difficulty": "Medium"
    },
    {
        "question": "What is the function of the Domain Name System (DNS)?",
        "options": [
            "Translates human-readable domain names into IP addresses",
            "Allocates IP addresses dynamically",
            "Encrypts web traffic",
            "Filters spam emails"
        ],
        "correct_answer": "Translates human-readable domain names into IP addresses",
        "category": "Computer Network",
        "difficulty": "Easy"
    },
    {
        "question": "What port does HTTP default to?",
        "options": ["80", "443", "21", "22"],
        "correct_answer": "80",
        "category": "Computer Network",
        "difficulty": "Easy"
    },
    {
        "question": "What is the primary purpose of a Subnet Mask?",
        "options": [
            "Distinguishes the network portion of an IP address from the host portion",
            "Encrypts data packets",
            "Hides user IP address",
            "Speeds up internet connection"
        ],
        "correct_answer": "Distinguishes the network portion of an IP address from the host portion",
        "category": "Computer Network",
        "difficulty": "Medium"
    },

    # 5. DBMS (5 Questions)
    {
        "question": "What does ACID stand for in DBMS?",
        "options": [
            "Atomicity, Consistency, Isolation, Durability",
            "Access, Control, Information, Database",
            "Aggregation, Concurrency, Integrity, Distribution",
            "Authority, Complexity, Indexing, Delivery"
        ],
        "correct_answer": "Atomicity, Consistency, Isolation, Durability",
        "category": "DBMS",
        "difficulty": "Medium"
    },
    {
        "question": "Which SQL constraint uniquely identifies each record in a database table?",
        "options": ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "NOT NULL"],
        "correct_answer": "PRIMARY KEY",
        "category": "DBMS",
        "difficulty": "Easy"
    },
    {
        "question": "What is a Foreign Key in a relational database?",
        "options": [
            "A column that references the Primary Key of another table",
            "An encrypted key",
            "A primary key from a remote database",
            "None of the above"
        ],
        "correct_answer": "A column that references the Primary Key of another table",
        "category": "DBMS",
        "difficulty": "Easy"
    },
    {
        "question": "What is Database Normalization?",
        "options": [
            "Organizing data to minimize redundancy and dependency",
            "Backing up the database",
            "Converting tables to JSON",
            "Deleting unused tables"
        ],
        "correct_answer": "Organizing data to minimize redundancy and dependency",
        "category": "DBMS",
        "difficulty": "Medium"
    },
    {
        "question": "Which JOIN returns all rows from the left table and matched rows from the right table?",
        "options": ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"],
        "correct_answer": "LEFT JOIN",
        "category": "DBMS",
        "difficulty": "Easy"
    },

    # 6. OOPs (5 Questions)
    {
        "question": "Which OOP principle allows a subclass to provide a specific implementation of a method defined in its superclass?",
        "options": ["Polymorphism", "Encapsulation", "Abstraction", "Inheritance"],
        "correct_answer": "Polymorphism",
        "category": "OOPs",
        "difficulty": "Easy"
    },
    {
        "question": "What is Encapsulation in OOP?",
        "options": [
            "Bundling data and methods operating on that data within a single unit and restricting direct access",
            "Inheriting attributes from parent class",
            "Creating multiple instances of a class",
            "Writing functions without classes"
        ],
        "correct_answer": "Bundling data and methods operating on that data within a single unit and restricting direct access",
        "category": "OOPs",
        "difficulty": "Easy"
    },
    {
        "question": "What is an Abstract Class?",
        "options": [
            "A class that cannot be instantiated and is meant to be subclassed",
            "A class with only private variables",
            "A class that has no methods",
            "A class with no constructors"
        ],
        "correct_answer": "A class that cannot be instantiated and is meant to be subclassed",
        "category": "OOPs",
        "difficulty": "Medium"
    },
    {
        "question": "What is the key difference between Method Overloading and Method Overriding?",
        "options": [
            "Overloading happens in the same class with different parameters; Overriding happens in subclasses with the same signature",
            "Overriding happens in the same class",
            "Overloading requires inheritance",
            "There is no difference"
        ],
        "correct_answer": "Overloading happens in the same class with different parameters; Overriding happens in subclasses with the same signature",
        "category": "OOPs",
        "difficulty": "Medium"
    },
    {
        "question": "What is Inheritance in OOP?",
        "options": [
            "Mechanism where a new class inherits properties and behaviors from an existing class",
            "Hiding implementation details",
            "Defining multiple methods with same name",
            "Allocating dynamic memory"
        ],
        "correct_answer": "Inheritance",
        "category": "OOPs",
        "difficulty": "Easy"
    },

    # 7. Data Structures & Algorithms (5 Questions)
    {
        "question": "What is the worst-case time complexity of Quick Sort?",
        "options": ["O(n^2)", "O(n log n)", "O(n)", "O(1)"],
        "correct_answer": "O(n^2)",
        "category": "DSA",
        "difficulty": "Medium"
    },
    {
        "question": "Which data structure follows the Last In, First Out (LIFO) principle?",
        "options": ["Stack", "Queue", "Array", "Linked List"],
        "correct_answer": "Stack",
        "category": "DSA",
        "difficulty": "Easy"
    },
    {
        "question": "What is the time complexity to search an element in a balanced Binary Search Tree (BST)?",
        "options": ["O(log n)", "O(n)", "O(1)", "O(n log n)"],
        "correct_answer": "O(log n)",
        "category": "DSA",
        "difficulty": "Easy"
    },
    {
        "question": "Which data structure uses FIFO (First In, First Out) ordering?",
        "options": ["Queue", "Stack", "Tree", "Graph"],
        "correct_answer": "Queue",
        "category": "DSA",
        "difficulty": "Easy"
    },
    {
        "question": "What algorithm technique is used in Dijkstra's algorithm for finding the shortest path?",
        "options": ["Greedy approach", "Dynamic Programming", "Divide and Conquer", "Backtracking"],
        "correct_answer": "Greedy approach",
        "category": "DSA",
        "difficulty": "Medium"
    }
]


def generate_assessment_questions(role=None, resume_text=None):
    prompt = """
    You are an expert technical evaluator creating a standard, comprehensive Software Engineering Assessment Test.

    Generate EXACTLY 35 Multiple Choice Questions (MCQs), with EXACTLY 5 questions for each of the following 7 categories:
    1. Verbal Ability (5 questions)
    2. Logical Reasoning (5 questions)
    3. Operating System (5 questions)
    4. Computer Network (5 questions)
    5. DBMS (5 questions)
    6. OOPs (Object-Oriented Programming) (5 questions)
    7. Data Structures & Algorithms (DSA) (5 questions)

    Rules for each MCQ:
    1. Each question must have exactly 4 choices (options).
    2. Exactly one option must be the correct answer.
    3. Do NOT include resume-based, project-specific, or candidate-specific questions.
    4. Return ONLY a valid JSON array matching the schema below.
    5. Do not include markdown formatting (such as ```json), introduction, or conversational text. Return raw JSON array only.

    Schema:
    [
      {
        "question": "Question text...",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "Option A",
        "category": "Verbal Ability | Logical Reasoning | Operating System | Computer Network | DBMS | OOPs | DSA",
        "difficulty": "Easy" or "Medium" or "Hard"
      },
      ...
    ]
    """

    response_text = None

    # 1. Try Gemini
    if gemini_client:
        try:
            response = gemini_client.chat.completions.create(
                model="gemini-2.0-flash",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=3500,
                timeout=12.0,
            )
            response_text = response.choices[0].message.content
            print("MCQ Generator (Gemini) Raw Response length:", len(response_text) if response_text else 0)
        except Exception as e:
            print("Gemini MCQ Generation failed, trying OpenRouter. Error:", e)

    # 2. Try OpenRouter Fallback
    if not response_text and openrouter_client:
        try:
            response = openrouter_client.chat.completions.create(
                model="openrouter/auto",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=3500,
                timeout=12.0,
            )
            response_text = response.choices[0].message.content
            print("MCQ Generator (OpenRouter) Raw Response length:", len(response_text) if response_text else 0)
        except Exception as e:
            print("OpenRouter MCQ Generation failed. Error:", e)

    questions = []
    if response_text:
        try:
            start = response_text.find("[")
            end = response_text.rfind("]") + 1
            if start != -1 and end > start:
                clean_json = response_text[start:end]
                parsed = json.loads(clean_json)
                if isinstance(parsed, list):
                    questions = parsed
        except Exception as e:
            print("MCQ JSON Parse Error:", e)

    # Guarantee exactly 35 questions by merging with FALLBACK_MCQ_POOL if needed
    if len(questions) < 35:
        existing_q_texts = {q.get("question") for q in questions if isinstance(q, dict)}
        for fallback_item in FALLBACK_MCQ_POOL:
            if len(questions) >= 35:
                break
            if fallback_item.get("question") not in existing_q_texts:
                questions.append(fallback_item)
                existing_q_texts.add(fallback_item.get("question"))

    return questions[:35]
