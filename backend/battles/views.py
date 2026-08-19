from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import BattleRoom
import json

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

    # Delete existing room with same code if any (for cleanup, though unique is enforced)
    BattleRoom.objects.filter(room_code=room_code).delete()

    quiz_data = None
    if game_mode == 'quiz':
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
            - "opts": A list of 4 string options
            - "ans": An integer index (0-3) of the correct option.
            Do not include any other text, just the JSON array.
            """
            response = model.generate_content(prompt)
            clean_text = clean_json_response(response.text)
            quiz_data = json.loads(clean_text)
        except Exception as e:
            print(f"Error generating AI quiz questions: {e}")
            quiz_data = None

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

    # Check if both have submitted (or if coding mode, just end it)
    if room.game_mode == 'coding':
        room.winner = player
        room.status = 'finished'
        room.save()
    elif room.game_mode == 'quiz':
        if room.host_submitted and room.join_submitted:
            # Evaluate winner
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
