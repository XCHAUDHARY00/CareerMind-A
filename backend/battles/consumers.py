import json
from channels.generic.websocket import AsyncWebsocketConsumer

class BattleConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'battle_{self.room_code}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Send join confirmation
        await self.send(text_data=json.dumps({
            'type': 'system',
            'message': 'Connected to battle room.'
        }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        event_type = text_data_json.get('type')

        if event_type == 'player_join':
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'battle_message',
                    'action': 'player_join',
                    'player': text_data_json.get('player'),
                    'playerId': text_data_json.get('playerId')
                }
            )
        elif event_type == 'start_match':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'battle_message',
                    'action': 'start_match',
                    'mode': text_data_json.get('mode')
                }
            )
        elif event_type == 'submit_code':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'battle_message',
                    'action': 'match_finished',
                    'winner': text_data_json.get('player')
                }
            )
        elif event_type == 'sync_state':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'battle_message',
                    'action': 'sync_state',
                    'player': text_data_json.get('player'),
                    'playerId': text_data_json.get('playerId'),
                    'mode': text_data_json.get('mode'),
                    'difficulty': text_data_json.get('difficulty')
                }
            )

    # Receive message from room group
    async def battle_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event))
