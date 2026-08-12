from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .serializers import UserProfileSerializer,UserRegistrationSerializer,SkillSerializer,EducationSerializer,CareerGoalSerializer,ChatMessageSerializer
from .models import UserProfile,Skill,Education,CareerGoal,ChatMessage
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .service import analyze_career_dna,analyze_skill_gaps
import requests
import json
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profiles(request):
    profiles = UserProfile.objects.all() # Database se saare profiles nikale
    serializer = UserProfileSerializer(profiles, many=True) # JSON mein translate kiya
    return Response(serializer.data) # Postman ko bhej diya

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    try:
        profile = request.user.profile
        serializer = UserProfileSerializer(profile)
        return Response({
            "status": "success",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({
            "status": "error",
            "message": "Profile not found"
        }, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_profile(request):
    serializer=UserProfileSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "status":"success",
            "message":"profile created successfully",
            "data":serializer.data
        },status=status.HTTP_201_CREATED)
    else:
        return Response({
            "status":"error",
            "message":"profile creation failed",
            "data":serializer.errors
        },status=status.HTTP_400_BAD_REQUEST)
@api_view(['PUT','PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request,pk):
    try:
        profile=UserProfile.objects.get(pk=pk)
        serializer=UserProfileSerializer(profile,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status":"success",
                "message":"profile updated successfully",
                "data":serializer.data
            },status=status.HTTP_200_OK)
        else:
            return Response({
                "status":"error",
                "message":"profile update failed",
                "data":serializer.errors
            },status=status.HTTP_400_BAD_REQUEST)
    except UserProfile.DoesNotExist:
        return Response({
            "status":"error",
            "message":"profile not found",
            "data":{
                "error":"profile with this id does not exist"
            }
        },status=status.HTTP_404_NOT_FOUND)
        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile(request,pk):
    try:
        profile=UserProfile.objects.get(pk=pk)
        profile.delete()
        return Response({
            "status":"success",
            "message":"profile deleted successfully",
        },status=status.HTTP_204_NO_CONTENT)
    except UserProfile.DoesNotExist:
        return Response({
            "status":"error",
            "message":"profile not found",
            "data":{
                "error":"profile with this id does not exist"
            }
        },status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
def register(request):
    serializer=UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "status":"success",
            "message":"user created successfully",
            "data":serializer.data
        },status=status.HTTP_201_CREATED)
    else:
        return Response({
            "status":"error",
            "message":"user creation failed",
            "data":serializer.errors
        },status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_skills(request):
    serializer=SkillSerializer(data=request.data)
    if serializer.is_valid():
        skill, created = Skill.objects.get_or_create(name=serializer.validated_data['name'])
        request.user.profile.skills.add(skill)
        return Response({
            "status":"success",
            "message":"skills added successfully",
            "data":SkillSerializer(skill).data
        },status=status.HTTP_201_CREATED)
    else:
        return Response({
            "status":"error",
            "message":"skills addition failed",
            "data":serializer.errors
        },status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_education(request):
    data = request.data.copy()
    serializer=EducationSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user_profile=request.user.profile)
        return Response({
            "status":"success",
            "message":"education added successfully",
            "data":serializer.data
        },status=status.HTTP_201_CREATED)
    else:
        return Response({
            "status":"error",
            "message":"education addition failed",
            "data":serializer.errors
        },status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_carrer_goal(request):
    data = request.data.copy()
    serializer=CareerGoalSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user_profile=request.user.profile)
        return Response({
            "status":"success",
            "message":"carrer goal added successfully",
            "data":serializer.data
        },status=status.HTTP_201_CREATED)
    else:
        return Response({
            "status":"error",
            "message":"carrer goal addition failed",
            "data":serializer.errors
        },status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_roadmap(request):
    try:
        from .service import generate_career_roadmap
        profile = request.user.profile
        
        force_refresh = request.query_params.get('force') == 'true'
        
        if profile.roadmap_data and not force_refresh:
            roadmap_data = profile.roadmap_data
        else:
            roadmap_data = generate_career_roadmap(profile)
            if "error" not in roadmap_data:
                profile.roadmap_data = roadmap_data
                profile.save(update_fields=['roadmap_data'])
                
        if "error" in roadmap_data:
            return Response({"status": "error", "message": roadmap_data["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            "status": "success",
            "message": "Roadmap retrieved successfully",
            "data": roadmap_data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_skill(request, pk):
    try:
        skill = Skill.objects.get(pk=pk)
        request.user.profile.skills.remove(skill)
        return Response({"status": "success", "message": "Skill removed"}, status=status.HTTP_200_OK)
    except Skill.DoesNotExist:
        return Response({"status": "error", "message": "Skill not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_education(request, pk):
    try:
        edu = Education.objects.get(pk=pk, user_profile=request.user.profile)
    except Education.DoesNotExist:
        return Response({"status": "error", "message": "Education not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        edu.delete()
        return Response({"status": "success", "message": "Education deleted"}, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = EducationSerializer(edu, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_career_goal(request, pk):
    try:
        goal = CareerGoal.objects.get(pk=pk, user_profile=request.user.profile)
    except CareerGoal.DoesNotExist:
        return Response({"status": "error", "message": "Career Goal not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        goal.delete()
        return Response({"status": "success", "message": "Career Goal deleted"}, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = CareerGoalSerializer(goal, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"status": "error", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_chat_message(request):
    """
    User naya message bhejega, hum AI se reply mangwayenge aur response denge.
    """
    message = request.data.get("message")
    if not message:
        return Response({"status": "error", "message": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        from .service import interact_with_career_coach
        profile = request.user.profile
        ai_data = interact_with_career_coach(profile, message)
        
        if "error" in ai_data:
            return Response({"status": "error", "message": ai_data["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response({
            "status": "success",
            "message": "Response received",
            "data": {
                "response": ai_data["response"]
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request):
    """
    User ki purani chat history return karega.
    """
    try:
        profile = request.user.profile
        messages = ChatMessage.objects.filter(user_profile=profile).order_by('timestamp')
        serializer = ChatMessageSerializer(messages, many=True)
        return Response({
            "status": "success",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def carrer_dna(request):
    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        return Response({"status": "error", "message": "Profile not found"}, status=404)
        
    force_refresh = request.query_params.get('force') == 'true'
    
    if profile.career_dna_data and not force_refresh:
        result = profile.career_dna_data
    else:
        result = analyze_career_dna(profile)
        if "error" not in result:
            profile.career_dna_data = result
            profile.save(update_fields=['career_dna_data'])
            
    if "error" in result:
        return Response({"status": "error", "message": result["error"]}, status=500)  

    return Response({"status": "success", "data": result}, status=200)    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def skill_gaps(request):
    """
    User ki skill gaps return karta hai.
    GET /skill-gaps/               → Profile ke career goal se role auto-pick
    GET /skill-gaps/?role=AI+Engineer → Manually override karo
    """
    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        return Response({"status": "error", "message": "Profile not found"}, status=404)

    # Smart role selection — 3 level priority
    if request.query_params.get('role'):
        target_role = request.query_params.get('role')
    elif profile.user_career_goals.exists():
        target_role = profile.user_career_goals.last().title
    else:
        target_role = "Software Developer"

    force_refresh = request.query_params.get('force') == 'true'
    
    # Initialize dict if None
    if profile.skill_gaps_data is None:
        profile.skill_gaps_data = {}
        
    if target_role in profile.skill_gaps_data and not force_refresh:
        result = profile.skill_gaps_data[target_role]
    else:
        result = analyze_skill_gaps(profile, target_role)
        if "error" not in result:
            profile.skill_gaps_data[target_role] = result
            profile.save(update_fields=['skill_gaps_data'])

    if "error" in result:
        return Response({"status": "error", "message": result["error"]}, status=500)

    return Response({
        "status": "success",
        "data": result,
        "used_role": target_role
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_interview(request):
    try:
        from .models import InterviewSession, InterviewQuestion
        from .interview_service import start_gemini_interview
        
        profile = request.user.profile
        target_role = request.data.get("target_role", "Backend Developer")
        difficulty = request.data.get("difficulty", "Medium")
        interview_type = request.data.get("interview_type", "Technical")
        
        # Terminate any existing ongoing sessions for this user profile to keep DB clean
        InterviewSession.objects.filter(user_profile=profile, status='ongoing').update(status='terminated')
        
        # Create a new session
        session = InterviewSession.objects.create(
            user_profile=profile,
            target_role=target_role,
            difficulty=difficulty,
            interview_type=interview_type,
            status='ongoing'
        )
        
        # Generate the first question
        first_q_text = start_gemini_interview(profile, target_role, difficulty, interview_type)
        
        # Save it
        InterviewQuestion.objects.create(
            session=session,
            question_text=first_q_text,
            is_coding=False
        )
        
        return Response({
            "status": "success",
            "session_id": session.id,
            "first_question": first_q_text,
            "is_coding": False,
            "question_number": 1
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("Start Interview Error:", str(e))
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request):
    try:
        from .models import InterviewSession, InterviewQuestion
        from .interview_service import evaluate_and_generate_next, finalize_interview_scores
        
        session_id = request.data.get("session_id")
        answer_text = request.data.get("answer_text", "").strip()
        
        if not session_id:
            return Response({"status": "error", "message": "session_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        session = InterviewSession.objects.get(id=session_id, user_profile=request.user.profile)
        if session.status != 'ongoing':
            return Response({"status": "error", "message": "Interview session is not active"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Get the current question (the last created question)
        current_q = session.questions.all().order_by('timestamp').last()
        if not current_q:
            return Response({"status": "error", "message": "No question found for this session"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Save user's answer
        current_q.user_answer = answer_text
        current_q.save()
        
        # Check current question number
        q_count = session.questions.all().count()
        
        if q_count >= 5:
            # Evaluate the final 5th question answer
            evaluation_res = evaluate_and_generate_next(session, current_q, answer_text, next_question_number=6)
            current_q.ai_feedback = evaluation_res.get("evaluation", "")
            current_q.score = evaluation_res.get("score", 5)
            current_q.save()
            
            # Finalize the interview (generate overall evaluation and scores)
            finalize_interview_scores(session)
            
            return Response({
                "status": "success",
                "completed": True,
                "session_id": session.id
            }, status=status.HTTP_200_OK)
            
        else:
            next_q_num = q_count + 1
            # Evaluate current answer and generate next question
            result = evaluate_and_generate_next(session, current_q, answer_text, next_q_num)
            
            # Save evaluation to current question
            current_q.ai_feedback = result.get("evaluation", "")
            current_q.score = result.get("score", 5)
            current_q.save()
            
            # Create next question
            next_question = InterviewQuestion.objects.create(
                session=session,
                question_text=result.get("next_question", ""),
                is_coding=result.get("is_coding", False)
            )
            
            return Response({
                "status": "success",
                "completed": False,
                "next_question": next_question.question_text,
                "is_coding": next_question.is_coding,
                "question_number": next_q_num
            }, status=status.HTTP_200_OK)
            
    except InterviewSession.DoesNotExist:
        return Response({"status": "error", "message": "Interview session not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Submit Answer Error:", str(e))
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def end_interview(request):
    try:
        from .models import InterviewSession
        from .interview_service import finalize_interview_scores
        
        session_id = request.data.get("session_id")
        if not session_id:
            return Response({"status": "error", "message": "session_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        session = InterviewSession.objects.get(id=session_id, user_profile=request.user.profile)
        
        # If the session is ongoing, let's make sure the last question is evaluated if answered
        if session.status == 'ongoing':
            # Run final evaluation
            finalize_interview_scores(session)
            
        return Response({
            "status": "success",
            "session_id": session.id,
            "target_role": session.target_role,
            "difficulty": session.difficulty,
            "interview_type": session.interview_type,
            "status_state": session.status,
            "scores": {
                "technical": session.technical_score,
                "communication": session.communication_score,
                "problemSolving": session.problem_solving_score,
                "clarity": session.clarity_score,
                "confidence": session.confidence_score,
                "overall": session.overall_score
            },
            "summary": session.summary,
            "strengths": session.strengths,
            "areas_to_improve": session.areas_to_improve
        }, status=status.HTTP_200_OK)
        
    except InterviewSession.DoesNotExist:
        return Response({"status": "error", "message": "Interview session not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("End Interview Error:", str(e))
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_last_interview(request):
    try:
        from .models import InterviewSession
        
        profile = request.user.profile
        # Fetch the latest completed session
        session = InterviewSession.objects.filter(user_profile=profile, status='completed').order_by('-end_time').first()
        if not session:
            return Response({
                "status": "success",
                "data": None
            }, status=status.HTTP_200_OK)
            
        return Response({
            "status": "success",
            "data": {
                "session_id": session.id,
                "target_role": session.target_role,
                "difficulty": session.difficulty,
                "interview_type": session.interview_type,
                "score": session.overall_score,
                "technical": session.technical_score,
                "communication": session.communication_score,
                "problemSolving": session.problem_solving_score,
                "clarity": session.clarity_score,
                "confidence": session.confidence_score,
                "summary": session.summary,
                "strengths": session.strengths,
                "areas_to_improve": session.areas_to_improve,
                "date": session.end_time.strftime("%d %b %Y")
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print("Get Last Interview Error:", str(e))
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─── GitHub Endpoints ─────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def link_github(request):
    """Save GitHub username to user profile."""
    username = request.data.get('username', '').strip()
    if not username:
        return Response({"status": "error", "message": "Username required"}, status=status.HTTP_400_BAD_REQUEST)
    profile = request.user.profile
    profile.github_username = username
    # Clear old cache when username changes
    profile.github_data = None
    profile.github_data_updated = None
    profile.save(update_fields=['github_username', 'github_data', 'github_data_updated'])
    return Response({"status": "success", "message": "GitHub linked", "username": username})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unlink_github(request):
    """Remove GitHub username from user profile."""
    profile = request.user.profile
    profile.github_username = None
    profile.github_data = None
    profile.github_data_updated = None
    profile.save(update_fields=['github_username', 'github_data', 'github_data_updated'])
    return Response({"status": "success", "message": "GitHub unlinked"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analyze_github(request):
    """Fetch GitHub public API data + Gemini AI analysis. Cached for 24 hours."""
    from django.utils import timezone
    from datetime import timedelta
    
    profile = request.user.profile
    if not profile.github_username:
        return Response({"status": "error", "message": "GitHub not linked"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check 24h cache
    force = request.query_params.get('force') == 'true'
    if (not force and profile.github_data and profile.github_data_updated and
            timezone.now() - profile.github_data_updated < timedelta(hours=24)):
        return Response({"status": "success", "data": profile.github_data, "cached": True})
    
    username = profile.github_username
    headers = {'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'CareerMindAI'}
    
    try:
        # Fetch user info
        user_resp = requests.get(f'https://api.github.com/users/{username}', headers=headers, timeout=10)
        if user_resp.status_code == 404:
            return Response({"status": "error", "message": "GitHub user not found"}, status=status.HTTP_404_NOT_FOUND)
        user_data = user_resp.json()
        
        # Fetch repos (top 30 by stars)
        repos_resp = requests.get(
            f'https://api.github.com/users/{username}/repos?sort=stars&per_page=30&type=owner',
            headers=headers, timeout=10
        )
        repos = repos_resp.json() if repos_resp.status_code == 200 else []
        
        # Aggregate language stats from repos
        lang_counts = {}
        total_stars = 0
        top_repos = []
        for repo in repos:
            if isinstance(repo, dict) and not repo.get('fork', False):
                lang = repo.get('language')
                if lang:
                    lang_counts[lang] = lang_counts.get(lang, 0) + 1
                total_stars += repo.get('stargazers_count', 0)
                if len(top_repos) < 5:
                    top_repos.append({
                        'name': repo.get('name', ''),
                        'description': repo.get('description', '') or 'No description',
                        'stars': repo.get('stargazers_count', 0),
                        'language': repo.get('language', 'Unknown'),
                        'updated': repo.get('updated_at', '')[:10],
                        'url': repo.get('html_url', ''),
                    })
        
        # Build language percentage list
        total_lang = sum(lang_counts.values()) or 1
        lang_colors = {
            'Python': '#3572A5', 'JavaScript': '#f1e05a', 'TypeScript': '#2b7489',
            'Java': '#b07219', 'C++': '#f34b7d', 'Go': '#00ADD8',
            'Rust': '#dea584', 'HTML': '#e34c26', 'CSS': '#563d7c',
            'Shell': '#89e051', 'Ruby': '#701516', 'Swift': '#ffac45',
        }
        languages = sorted(
            [{'name': k, 'percentage': round(v/total_lang*100), 'color': lang_colors.get(k, '#6366f1')}
             for k, v in lang_counts.items()],
            key=lambda x: -x['percentage']
        )[:6]
        
        # Gemini AI analysis of GitHub strength
        try:
            from .interview_service import get_gemini_model
            model = get_gemini_model()
            skill_names = [s.name for s in profile.skills.all()]
            prompt = f"""A software developer named {username} has these GitHub stats:
- Public repos: {user_data.get('public_repos', 0)}
- Followers: {user_data.get('followers', 0)}
- Total stars: {total_stars}
- Languages used: {list(lang_counts.keys())}
- Bio: {user_data.get('bio', 'N/A')}
- Their listed skills: {skill_names}

Analyze their GitHub profile and return ONLY valid JSON:
{{
  "strength_score": <number 0-100>,
  "consistency": <number 0-100>,
  "collaboration": <number 0-100>,
  "code_quality": <number 0-100>,
  "documentation": <number 0-100>,
  "impact": <number 0-100>,
  "ai_summary": "<2-3 sentence AI insight about their GitHub profile and career impact>",
  "resume_consistency": <number 0-100>,
  "consistency_points": ["<point 1>", "<point 2>", "<point 3>"]
}}"""
            ai_resp = model.generate_content(prompt)
            ai_text = ai_resp.text.strip()
            if '```' in ai_text:
                ai_text = ai_text.split('```')[1].replace('json','').strip()
            ai_analysis = json.loads(ai_text)
        except Exception as ai_err:
            print('GitHub Gemini error:', ai_err)
            ai_analysis = {
                "strength_score": min(70, user_data.get('public_repos', 0) * 3 + total_stars * 2),
                "consistency": 65, "collaboration": 55, "code_quality": 70,
                "documentation": 50, "impact": 60,
                "ai_summary": f"{username} has an active GitHub presence with {user_data.get('public_repos', 0)} repositories. Keep building real projects to boost your career evidence score.",
                "resume_consistency": 72,
                "consistency_points": [
                    f"{list(lang_counts.keys())[0] if lang_counts else 'Code'} activity visible in repositories",
                    "Project portfolio growing steadily",
                    "Commit history demonstrates active learning"
                ]
            }
        
        result = {
            "username": username,
            "name": user_data.get('name', username),
            "bio": user_data.get('bio', ''),
            "avatar_url": user_data.get('avatar_url', ''),
            "repos": user_data.get('public_repos', 0),
            "followers": user_data.get('followers', 0),
            "following": user_data.get('following', 0),
            "stars": total_stars,
            "github_url": user_data.get('html_url', ''),
            "languages": languages,
            "repos_list": top_repos,
            "strength": ai_analysis.get('strength_score', 65),
            "metrics": [
                {"label": "Consistency", "score": ai_analysis.get('consistency', 65), "description": "Regular commit activity over time"},
                {"label": "Collaboration", "score": ai_analysis.get('collaboration', 55), "description": "Forks, PRs and community contributions"},
                {"label": "Code Quality", "score": ai_analysis.get('code_quality', 70), "description": "Language diversity and structure"},
                {"label": "Documentation", "score": ai_analysis.get('documentation', 50), "description": "README quality and repo descriptions"},
                {"label": "Impact", "score": ai_analysis.get('impact', 60), "description": "Stars, watchers and project visibility"},
                {"label": "Resume Match", "score": ai_analysis.get('resume_consistency', 72), "description": "Skills from resume visible in GitHub"},
            ],
            "ai_summary": ai_analysis.get('ai_summary', ''),
            "resume_consistency": ai_analysis.get('resume_consistency', 72),
            "consistency_points": ai_analysis.get('consistency_points', []),
        }
        
        # Cache result
        profile.github_data = result
        profile.github_data_updated = timezone.now()
        profile.save(update_fields=['github_data', 'github_data_updated'])
        
        return Response({"status": "success", "data": result, "cached": False})
        
    except requests.exceptions.Timeout:
        return Response({"status": "error", "message": "GitHub API timeout. Try again."}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except Exception as e:
        print('GitHub analyze error:', e)
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─── Resume Endpoints ─────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):
    """Accept PDF, extract text, run Gemini analysis, cache in profile."""
    import PyPDF2
    import io
    
    file = request.FILES.get('resume')
    if not file:
        return Response({"status": "error", "message": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not file.name.lower().endswith('.pdf'):
        return Response({"status": "error", "message": "Only PDF files are supported"}, status=status.HTTP_400_BAD_REQUEST)
    
    if file.size > 10 * 1024 * 1024:  # 10MB limit
        return Response({"status": "error", "message": "File too large. Max 10MB."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Extract text from PDF
        pdf_bytes = file.read()
        reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        text_parts = []
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text_parts.append(extracted)
        resume_text = '\n'.join(text_parts).strip()
        
        if not resume_text or len(resume_text) < 50:
            return Response({"status": "error", "message": "Could not extract text from PDF. Try a text-based PDF."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Limit text for Gemini (first 3000 chars is plenty)
        resume_text_trimmed = resume_text[:3000]
        
        # Gemini analysis
        try:
            from .interview_service import get_gemini_model
            model = get_gemini_model()
            profile = request.user.profile
            skill_names = [s.name for s in profile.skills.all()]
            github_langs = []
            if profile.github_data and 'languages' in profile.github_data:
                github_langs = [l['name'] for l in profile.github_data['languages']]
            
            prompt = f"""Analyze this resume text and return ONLY valid JSON (no markdown, no backticks):

RESUME TEXT:
{resume_text_trimmed}

User's registered skills: {skill_names}
User's GitHub languages: {github_langs}

Return this exact JSON structure:
{{
  "score": <overall score 0-100>,
  "ats": <ATS readiness 0-100>,
  "skill_relevance": <skill relevance to market 0-100>,
  "project_strength": <project section quality 0-100>,
  "impact_statements": <use of quantified results 0-100>,
  "role_alignment": <alignment to a senior dev role 0-100>,
  "evidence_consistency": <resume claims vs github evidence 0-100>,
  "skills_found": ["<skill1>", "<skill2>"],
  "ai_tips": ["<tip1>", "<tip2>", "<tip3>", "<tip4>"],
  "consistency_points": [
    {{"text": "<observation 1>", "ok": true}},
    {{"text": "<observation 2>", "ok": true}},
    {{"text": "<observation 3>", "ok": false}}
  ],
  "summary": "<2-3 sentence overall assessment>"
}}"""
            ai_resp = model.generate_content(prompt)
            ai_text = ai_resp.text.strip()
            # Remove markdown code fences if present
            if '```' in ai_text:
                parts = ai_text.split('```')
                for part in parts:
                    part = part.replace('json', '').strip()
                    if part.startswith('{'):
                        ai_text = part
                        break
            analysis = json.loads(ai_text)
        except Exception as ai_err:
            print('Resume Gemini error:', ai_err)
            # Fallback analysis
            analysis = {
                "score": 68, "ats": 72, "skill_relevance": 70, "project_strength": 65,
                "impact_statements": 55, "role_alignment": 68, "evidence_consistency": 70,
                "skills_found": skill_names[:5] if skill_names else [],
                "ai_tips": [
                    'Add quantified impact statements — e.g. "Reduced API response time by 40%"',
                    'Include Docker and cloud technologies to match current job market requirements',
                    'Add a GitHub profile link for direct evidence of your coding activity',
                    'Expand Projects section with metrics and technologies used',
                ],
                "consistency_points": [
                    {"text": "Technical skills section present", "ok": True},
                    {"text": "Project experience documented", "ok": True},
                    {"text": "Quantified achievements can be improved", "ok": False},
                ],
                "summary": "Your resume shows solid foundational skills. Adding quantified impact and aligning with current job market requirements will significantly increase your ATS score."
            }
        
        # Save to profile
        profile.resume_text = resume_text
        profile.resume_filename = file.name
        profile.resume_analysis = analysis
        profile.save(update_fields=['resume_text', 'resume_filename', 'resume_analysis'])
        
        return Response({
            "status": "success",
            "message": "Resume analyzed successfully",
            "data": analysis,
            "filename": file.name
        })
    except Exception as e:
        print('Resume upload error:', e)
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_resume_analysis(request):
    """Return cached resume analysis from profile."""
    profile = request.user.profile
    if not profile.resume_analysis:
        return Response({"status": "not_found", "message": "No resume uploaded yet"}, status=status.HTTP_404_NOT_FOUND)
    return Response({
        "status": "success",
        "data": profile.resume_analysis,
        "filename": profile.resume_filename or 'resume.pdf'
    })


# ─── LinkedIn Endpoint ────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def link_linkedin(request):
    """Save LinkedIn URL to user profile."""
    url = request.data.get('url', '').strip()
    if not url:
        profile = request.user.profile
        profile.linkedin_url = None
        profile.save(update_fields=['linkedin_url'])
        return Response({"status": "success", "message": "LinkedIn unlinked"})
    if 'linkedin.com' not in url:
        return Response({"status": "error", "message": "Please provide a valid LinkedIn URL"}, status=status.HTTP_400_BAD_REQUEST)
    profile = request.user.profile
    profile.linkedin_url = url
    profile.save(update_fields=['linkedin_url'])
    return Response({"status": "success", "message": "LinkedIn linked", "url": url})


# ─── Profile Update Endpoint ──────────────────────────────────────────────────

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_my_profile(request):
    """Update bio, experience of current user profile."""
    profile = request.user.profile
    allowed_fields = ['bio', 'experience']
    update_fields = []
    for field in allowed_fields:
        if field in request.data:
            setattr(profile, field, request.data[field])
            update_fields.append(field)
    
    # Update username if provided
    if 'username' in request.data:
        new_username = request.data['username'].strip()
        if new_username and new_username != request.user.username:
            from django.contrib.auth.models import User
            if not User.objects.filter(username=new_username).exclude(pk=request.user.pk).exists():
                request.user.username = new_username
                request.user.save(update_fields=['username'])
    
    if update_fields:
        profile.save(update_fields=update_fields)
    
    serializer = UserProfileSerializer(profile)
    return Response({"status": "success", "message": "Profile updated", "data": serializer.data})
