from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import BattleRoom
import json
import random


# ── Hardcoded fallback quiz banks (used when Gemini is unavailable) ─────────────
FALLBACK_QUIZ_EASY = [
    {"q": "What does HTML stand for?", "opts": ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Logic", "Hyperlink Text Markup Language"], "ans": 0},
    {"q": "Which symbol is used for single-line comments in Python?", "opts": ["//", "/*", "#", "--"], "ans": 2},
    {"q": "What is the output of: print(type(42))?", "opts": ["<class 'float'>", "<class 'int'>", "<class 'str'>", "<class 'number'>"], "ans": 1},
    {"q": "Which HTTP method is used to retrieve data?", "opts": ["POST", "PUT", "DELETE", "GET"], "ans": 3},
    {"q": "What does CSS stand for?", "opts": ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], "ans": 1},
    {"q": "Which data structure works on LIFO principle?", "opts": ["Queue", "Stack", "Array", "Linked List"], "ans": 1},
    {"q": "What does SQL stand for?", "opts": ["Structured Query Language", "Simple Query Logic", "Sequential Question Language", "Standard Query List"], "ans": 0},
    {"q": "Which is NOT a JavaScript data type?", "opts": ["String", "Boolean", "Float", "Undefined"], "ans": 2},
    {"q": "What does 'git push' do?", "opts": ["Downloads remote changes", "Uploads local commits to remote", "Creates a new branch", "Merges branches"], "ans": 1},
    {"q": "In Python, which is used to define a function?", "opts": ["function", "def", "fun", "define"], "ans": 1},
    {"q": "What is a REST API?", "opts": ["A database type", "An HTTP-based interface for communication", "A Python library", "A front-end framework"], "ans": 1},
    {"q": "Which HTML tag is used for the largest heading?", "opts": ["<h6>", "<heading>", "<h1>", "<head>"], "ans": 2},
    {"q": "What is a variable in programming?", "opts": ["A fixed value", "A named storage location", "A function", "A loop"], "ans": 1},
    {"q": "What does JSON stand for?", "opts": ["Java Syntax Object Notation", "JavaScript Object Notation", "Java Sequential Object Nodes", "Just Simple Object Names"], "ans": 1},
    {"q": "Which of these is a Python list?", "opts": ["{1, 2, 3}", "(1, 2, 3)", "[1, 2, 3]", "<1, 2, 3>"], "ans": 2},
]

FALLBACK_QUIZ_MEDIUM = [
    {"q": "What is the time complexity of binary search?", "opts": ["O(n)", "O(n²)", "O(log n)", "O(1)"], "ans": 2},
    {"q": "Which HTTP status code means 'Unauthorized'?", "opts": ["400", "403", "401", "404"], "ans": 2},
    {"q": "What is a foreign key in SQL?", "opts": ["A primary key of another table", "A key used for encryption", "A secondary index", "A unique key"], "ans": 0},
    {"q": "What does 'async/await' handle in JavaScript?", "opts": ["Synchronous code", "CSS animations", "Asynchronous operations", "DOM manipulation"], "ans": 2},
    {"q": "Which algorithm sorts by repeatedly finding the minimum?", "opts": ["Bubble Sort", "Merge Sort", "Selection Sort", "Quick Sort"], "ans": 2},
    {"q": "What does `docker-compose up` do?", "opts": ["Builds an image", "Starts containers defined in docker-compose.yml", "Pushes to registry", "Cleans volumes"], "ans": 1},
    {"q": "What is the purpose of an index in a database?", "opts": ["To enforce constraints", "To speed up data retrieval", "To create relationships", "To encrypt data"], "ans": 1},
    {"q": "What is the difference between == and === in JavaScript?", "opts": ["No difference", "=== compares type and value", "== compares type only", "=== is for assignment"], "ans": 1},
    {"q": "What is a Python decorator?", "opts": ["A class method", "A function that modifies another function", "A CSS property", "A data type"], "ans": 1},
    {"q": "What does JWT stand for?", "opts": ["Java Web Token", "JSON Web Token", "JavaScript Web Transfer", "JSON Website Tag"], "ans": 1},
    {"q": "Which SQL command removes rows from a table?", "opts": ["DROP", "REMOVE", "DELETE", "CLEAR"], "ans": 2},
    {"q": "What is Big O notation used for?", "opts": ["Database schemas", "Algorithm time/space complexity", "API design", "Git workflows"], "ans": 1},
    {"q": "What is the role of a load balancer?", "opts": ["Stores data", "Distributes traffic across servers", "Encrypts requests", "Manages databases"], "ans": 1},
    {"q": "What is React's virtual DOM?", "opts": ["A server-side rendering engine", "An in-memory representation of the real DOM", "A CSS library", "A state manager"], "ans": 1},
    {"q": "Which HTTP status code means 'Created'?", "opts": ["200", "204", "201", "202"], "ans": 2},
]

FALLBACK_QUIZ_HARD = [
    {"q": "Which design pattern ensures only one instance of a class exists?", "opts": ["Factory", "Observer", "Singleton", "Decorator"], "ans": 2},
    {"q": "What does CAP theorem state about distributed systems?", "opts": ["Cannot have all 3 of Consistency, Availability, Partition Tolerance", "Can achieve all 3 simultaneously", "Only applies to SQL databases", "Consistency is always guaranteed"], "ans": 0},
    {"q": "What is the time complexity of heapsort?", "opts": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], "ans": 1},
    {"q": "What is eventual consistency in distributed systems?", "opts": ["All nodes update instantly", "Nodes will converge to same state over time", "Only one node is writable", "Data is always consistent"], "ans": 1},
    {"q": "What is the purpose of a database transaction's ACID properties?", "opts": ["Speed up queries", "Ensure data integrity and reliability", "Create indexes", "Handle network failures"], "ans": 1},
    {"q": "In Kubernetes, what is a Pod?", "opts": ["A container registry", "A cluster of nodes", "The smallest deployable unit with one or more containers", "A storage volume"], "ans": 2},
    {"q": "What is the difference between horizontal and vertical scaling?", "opts": ["Vertical adds more machines; Horizontal upgrades existing", "Horizontal adds more machines; Vertical upgrades existing", "They are the same", "Horizontal only applies to databases"], "ans": 1},
    {"q": "What is a race condition in concurrent programming?", "opts": ["A speed test between threads", "Unintended behavior due to unpredictable execution order of threads", "A deadlock scenario", "A memory overflow"], "ans": 1},
    {"q": "What is the purpose of Redis in a web application?", "opts": ["Primary database", "In-memory caching and fast data access", "Load balancer", "Message encryption"], "ans": 1},
    {"q": "What is the N+1 query problem in ORM?", "opts": ["Using N databases", "Fetching related data with N extra queries per row", "Having N+1 tables", "Running parallel transactions"], "ans": 1},
    {"q": "What is a binary heap used for?", "opts": ["Hash tables", "Priority queues", "Linked lists", "Graph traversal"], "ans": 1},
    {"q": "What does the Liskov Substitution Principle state?", "opts": ["Classes should be open for extension", "Subtypes must be substitutable for base types", "Depend on abstractions, not concretions", "Single responsibility"], "ans": 1},
    {"q": "What is sharding in databases?", "opts": ["Encrypting data", "Splitting data across multiple database instances", "Indexing strategy", "Backup method"], "ans": 1},
    {"q": "What is a deadlock in database systems?", "opts": ["A slow query", "Two or more transactions blocking each other indefinitely", "A missing index", "A corrupted table"], "ans": 1},
    {"q": "What is the purpose of a circuit breaker pattern in microservices?", "opts": ["To manage API keys", "To prevent cascading failures by stopping calls to failing services", "To balance load", "To encrypt communication"], "ans": 1},
]


def get_fallback_quiz(difficulty):
    """Returns 10 randomly shuffled fallback questions based on difficulty."""
    bank = {
        'easy': FALLBACK_QUIZ_EASY,
        'medium': FALLBACK_QUIZ_MEDIUM,
        'hard': FALLBACK_QUIZ_HARD,
    }.get(difficulty.lower(), FALLBACK_QUIZ_MEDIUM)
    return random.sample(bank, min(10, len(bank)))


@api_view(['POST'])
@permission_classes([AllowAny])
def create_room(request):
    room_code = request.data.get('room_code')
    host_player = request.data.get('player')
    host_player_id = request.data.get('playerId')
    game_mode = request.data.get('mode', 'coding')
    difficulty = request.data.get('difficulty', 'easy')

    if not room_code or not host_player or not host_player_id:
        return Response({"error": "Missing required fields"}, status=400)

    # Delete existing room with same code if any (cleanup)
    BattleRoom.objects.filter(room_code=room_code).delete()

    quiz_data = None
    if game_mode == 'quiz':
        # Try AI first, fall back to local bank if Gemini is unavailable
        try:
            from users.interview_service import get_gemini_model, clean_json_response
            model = get_gemini_model()
            import uuid
            prompt = f"""
            Generate exactly 10 UNIQUE multiple choice questions about computer science and programming for difficulty '{difficulty}'.
            Seed: {uuid.uuid4()} (Ensure questions are completely different from previous requests)
            Provide output ONLY in JSON format as a list of objects.
            Each object must have exactly these keys:
            - "q": The question string
            - "opts": A list of exactly 4 string options
            - "ans": An integer index (0-3) of the correct option.
            Do not include any other text, just the JSON array.
            """
            response = model.generate_content(prompt)
            clean_text = clean_json_response(response.text)
            quiz_data = json.loads(clean_text)
            # Validate the structure
            if not isinstance(quiz_data, list) or len(quiz_data) < 5:
                raise ValueError("Invalid quiz data from AI")
        except Exception as e:
            print(f"AI quiz generation failed, using fallback: {e}")
            quiz_data = get_fallback_quiz(difficulty)

    room = BattleRoom.objects.create(
        room_code=room_code,
        host_player=host_player,
        host_player_id=host_player_id,
        game_mode=game_mode,
        difficulty=difficulty,
        status='waiting',
        quiz_data=quiz_data
    )
    
    return Response({"success": True, "room_code": room.room_code})

@api_view(['POST'])
@permission_classes([AllowAny])
def join_room(request):
    room_code = request.data.get('room_code')
    join_player = request.data.get('player')
    join_player_id = request.data.get('playerId')

    if not room_code or not join_player or not join_player_id:
        return Response({"error": "Missing required fields"}, status=400)

    try:
        room = BattleRoom.objects.get(room_code=room_code)
    except BattleRoom.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)

    if room.status != 'waiting' and room.join_player_id != join_player_id:
        return Response({"error": "Room is full or already playing"}, status=400)

    if room.host_player_id == join_player_id:
        return Response({"success": True}) # Re-joining host

    room.join_player = join_player
    room.join_player_id = join_player_id
    room.status = 'playing'
    room.save()

    return Response({
        "success": True, 
        "mode": room.game_mode, 
        "difficulty": room.difficulty,
        "opponent": room.host_player,
        "quiz_data": room.quiz_data
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def sync_room(request, room_code):
    try:
        room = BattleRoom.objects.get(room_code=room_code)
    except BattleRoom.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)

    return Response({
        "status": room.status,
        "host_player": room.host_player,
        "host_player_id": room.host_player_id,
        "join_player": room.join_player,
        "join_player_id": room.join_player_id,
        "game_mode": room.game_mode,
        "difficulty": room.difficulty,
        "winner": room.winner,
        "quiz_data": room.quiz_data,
        "host_score": room.host_score,
        "host_time": room.host_time,
        "host_submitted": room.host_submitted,
        "join_score": room.join_score,
        "join_time": room.join_time,
        "join_submitted": room.join_submitted
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_code(request):
    room_code = request.data.get('room_code')
    player = request.data.get('player')
    score = request.data.get('score', 0)
    time_taken = request.data.get('time_taken', 0)

    if not room_code or not player:
        return Response({"error": "Missing required fields"}, status=400)

    try:
        room = BattleRoom.objects.get(room_code=room_code)
    except BattleRoom.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)

    if room.status != 'playing':
        return Response({"success": False, "message": "Game not active"})

    if player == room.host_player:
        room.host_score = score
        room.host_time = time_taken
        room.host_submitted = True
    elif player == room.join_player:
        room.join_score = score
        room.join_time = time_taken
        room.join_submitted = True
        
    room.save()

    if room.game_mode == 'coding':
        # Coding mode: first to submit wins (speed-based)
        if not room.winner:
            room.winner = player
            room.status = 'finished'
            room.save()
    elif room.game_mode == 'quiz':
        if room.host_submitted and room.join_submitted:
            # Quiz: higher score wins, time as tiebreaker
            if room.host_score > room.join_score:
                room.winner = room.host_player
            elif room.join_score > room.host_score:
                room.winner = room.join_player
            else:
                # Tie breaker: lowest time wins
                if room.host_time < room.join_time:
                    room.winner = room.host_player
                elif room.join_time < room.host_time:
                    room.winner = room.join_player
                else:
                    room.winner = "Draw"
            room.status = 'finished'
            room.save()

    return Response({"success": True, "winner": room.winner})
