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

    room = BattleRoom.objects.create(
        room_code=room_code,
        host_player=host_player,
        host_player_id=host_player_id,
        game_mode=game_mode,
        difficulty=difficulty,
        status='waiting'
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
        "opponent": room.host_player
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
        "winner": room.winner
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_code(request):
    room_code = request.data.get('room_code')
    player = request.data.get('player')

    if not room_code or not player:
        return Response({"error": "Missing required fields"}, status=400)

    try:
        room = BattleRoom.objects.get(room_code=room_code)
    except BattleRoom.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)

    # First one to submit wins
    if room.status == 'playing':
        room.winner = player
        room.status = 'finished'
        room.save()

    return Response({"success": True, "winner": room.winner})
