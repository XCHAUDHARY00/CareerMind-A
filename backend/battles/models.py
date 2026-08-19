from django.db import models
from django.utils import timezone
from datetime import timedelta

class BattleRoom(models.Model):
    STATUS_CHOICES = (
        ('waiting', 'Waiting'),
        ('playing', 'Playing'),
        ('analyzing', 'Analyzing'),
        ('finished', 'Finished'),
    )

    room_code = models.CharField(max_length=10, unique=True, db_index=True)
    host_player = models.CharField(max_length=100)
    host_player_id = models.CharField(max_length=50) # To identify the host uniquely
    join_player = models.CharField(max_length=100, null=True, blank=True)
    join_player_id = models.CharField(max_length=50, null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    game_mode = models.CharField(max_length=20, default='coding')
    difficulty = models.CharField(max_length=20, default='easy')
    
    winner = models.CharField(max_length=100, null=True, blank=True)
    winner_id = models.CharField(max_length=50, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(hours=2)

    def __str__(self):
        return f"{self.room_code} ({self.status})"
