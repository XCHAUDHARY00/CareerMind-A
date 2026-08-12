import sys
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.conf import settings

# Global Developer Spotlight Table Block featuring Raj Chaudhary
CREATOR_SPOTLIGHT_HTML = """
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #1e113a, #110825); border: 2px solid #a855f7; border-radius: 20px; padding: 25px; margin-top: 40px; box-shadow: 0 4px 20px rgba(168, 85, 247, 0.2);">
    <tr>
        <td align="center" style="padding-bottom: 18px;">
            <span style="background: linear-gradient(90deg, #ff007f, #ff0000, #ff7f00, #ffff00, #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; display: inline-block;">
                🚀 Meet The Developer
            </span>
        </td>
    </tr>
    <tr>
        <td>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="60" valign="top" style="vertical-align: top;">
                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #ec4899, #ef4444, #f97316, #eab308, #3b82f6); border-radius: 25px; text-align: center; font-weight: 900; color: #ffffff; font-size: 20px; border: 2px solid #ffffff; box-shadow: 0 0 15px rgba(236, 72, 153, 0.4); overflow: hidden; line-height: 50px;">
                            RC
                        </div>
                    </td>
                    <td valign="middle" style="padding-left: 15px; vertical-align: middle;">
                        <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: 0.5px;">Raj Chaudhary</h3>
                        <p style="margin: 3px 0 0 0; color: #00f0ff; font-size: 12.5px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Lead Platform Developer & Systems Architect</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td style="padding-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.08); color: #d1d5db; font-size: 13.5px; line-height: 1.6; font-weight: 450;">
            Hey! I'm <strong>Raj Chaudhary</strong>, the creator and systems architect of <strong>SkillForge AI</strong>. I built this AI-driven career operating system to give developers the ultimate platform for technical preparation and skill scaling. If you have any suggestions, feedback, or just want to connect, feel free to drop me a line!
        </td>
    </tr>
</table>
"""

BASE_HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050508; font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050508; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0d0d12; border: 1px solid #1a1a25; border-radius: 28px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);">
                    
                    <!-- Rainbow Neon Top Border -->
                    <tr>
                        <td style="height: 6px; background: linear-gradient(90deg, #ec4899 0%, #ef4444 20%, #f97316 40%, #eab308 60%, #10b981 80%, #3b82f6 100%);"></td>
                    </tr>
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 45px 20px 35px 20px; background: linear-gradient(180deg, #0d0d12 0%, #111118 100%); border-bottom: 1px solid #1a1a25;">
                            <div style="font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0; background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                SkillForge AI
                            </div>
                            <p style="margin: 6px 0 0 0; color: #00f0ff; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; font-weight: 800; text-shadow: 0 0 10px rgba(0,240,255,0.2);">AI Career Operating System</p>
                        </td>
                    </tr>
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 35px; background-color: #0d0d12;">
                            {content}
                            
                            <!-- Creator Spotlight -->
                            {creator_spotlight}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 30px 20px; background-color: #07070a; border-top: 1px solid #1a1a25;">
                            <p style="margin: 0; color: #9898b0; font-size: 11px; font-weight: 500;">&copy; 2026 SkillForge AI. Designed by Raj Chaudhary.</p>
                            <p style="margin: 6px 0 0 0; color: #55556a; font-size: 10.5px; line-height: 1.4;">This is an automated system notification regarding your account credentials or registration. Please do not reply directly to this mail.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""

def send_welcome_email(user):
    """Sends an extremely detailed and visually spectacular welcome email detailing all 7 key features."""
    if not user.email:
        return False
        
    title = "Welcome to SkillForge AI, {}! ⚡".format(user.username)
    
    content = """
    <h2 style="color: #ffffff; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 15px; text-align: left; background: linear-gradient(90deg, #ec4899, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        Let's Forge Your Career Path! 🚀
    </h2>
    <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6; margin-bottom: 25px; font-weight: 400;">
        Hi <strong>{username}</strong>, welcome to <strong>SkillForge AI</strong>! You have just unlocked the next-generation AI-powered career environment designed specifically for software engineers.
    </p>
    <p style="color: #a0aec0; font-size: 14.5px; line-height: 1.6; margin-bottom: 25px; border-bottom: 1px solid #1a1a25; padding-bottom: 15px;">
        Here is a breakdown of the powerful features at your disposal to scale your engineering career:
    </p>
    
    <!-- 7 FEATURES GRID TABLE -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- 1. Career DNA Engine -->
        <tr>
            <td style="padding: 16px; background-color: #1a0f24; border-left: 4px solid #d946ef; border-radius: 12px; display: block; box-shadow: 0 4px 12px rgba(217, 70, 239, 0.05);">
                <strong style="color: #f472b6; font-size: 15px; display: block; margin-bottom: 4px;">🧠 Career DNA Engine</strong>
                <span style="color: #d1d5db; font-size: 13px; line-height: 1.5; display: block;">
                    Evaluates your multidimensional tech capabilities, mapping your strengths against job roles using an interactive radar-like visualization.
                </span>
            </td>
        </tr>
        <tr><td style="height: 14px;"></td></tr>
        
        <!-- 2. Skill Gap Diagnostics -->
        <tr>
            <td style="padding: 16px; background-color: #24140f; border-left: 4px solid #f97316; border-radius: 12px; display: block; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.05);">
                <strong style="color: #fb923c; font-size: 15px; display: block; margin-bottom: 4px;">⚡ Skill Gap Diagnostics</strong>
                <span style="color: #d1d5db; font-size: 13px; line-height: 1.5; display: block;">
                    Analyzes missing market-demand skills in your portfolio and compiles a prioritized queue of learning targets.
                </span>
            </td>
        </tr>
        <tr><td style="height: 14px;"></td></tr>
        
        <!-- 3. GitHub Intelligence -->
        <tr>
            <td style="padding: 16px; background-color: #0f1d2a; border-left: 4px solid #3b82f6; border-radius: 12px; display: block; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05);">
                <strong style="color: #60a5fa; font-size: 15px; display: block; margin-bottom: 4px;">🐙 GitHub Intelligence</strong>
                <span style="color: #d1d5db; font-size: 13px; line-height: 1.5; display: block;">
                    Extracts repo statistics, commit histories, streaks, and language metrics to generate concrete proof-of-work evidence.
                </span>
            </td>
        </tr>
        <tr><td style="height: 14px;"></td></tr>
        
        <!-- 4. Resume ATS Engine -->
        <tr>
            <td style="padding: 16px; background-color: #0f241d; border-left: 4px solid #10b981; border-radius: 12px; display: block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.05);">
                <strong style="color: #34d399; font-size: 15px; display: block; margin-bottom: 4px;">📄 Resume ATS Engine</strong>
                <span style="color: #d1d5db; font-size: 13px; line-height: 1.5; display: block;">
                    Parses your PDF resume, outputs an ATS readiness score, and provides bullet-point improvements generated by Gemini AI.
                </span>
            </td>
        </tr>
        <tr><td style="height: 14px;"></td></tr>
        
        <!-- 5. Mock Interview AI -->
        <tr>
            <td style="padding: 16px; background-color: #270f17; border-left: 4px solid #ef4444; border-radius: 12px; display: block; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05);">
                <strong style="color: #f87171; font-size: 15px; display: block; margin-bottom: 4px;">🎤 Mock Interview AI</strong>
                <span style="color: #d1d5db; font-size: 13px; line-height: 1.5; display: block;">
                    Simulates real-world technical and soft-skill interviews, scoring your communication and correctness in real-time.
                </span>
            </td>
        </tr>
        <tr><td style="height: 14px;"></td></tr>
        
        <!-- 6. AI Derived Projects -->
        <tr>
            <td style="padding: 16px; background-color: #24220f; border-left: 4px solid #eab308; border-radius: 12px; display: block; box-shadow: 0 4px 12px rgba(234, 179, 8, 0.05);">
                <strong style="color: #facc15; font-size: 15px; display: block; margin-bottom: 4px;">🛠️ AI Derived Projects</strong>
                <span style="color: #d1d5db; font-size: 13px; line-height: 1.5; display: block;">
                    Automatically outlines project designs, blueprints, and building files structured specifically to resolve your skill gaps.
                </span>
            </td>
        </tr>
        <tr><td style="height: 14px;"></td></tr>
        
        <!-- 7. Learning Roadmap -->
        <tr>
            <td style="padding: 16px; background-color: #17112c; border-left: 4px solid #6366f1; border-radius: 12px; display: block; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.05);">
                <strong style="color: #818cf8; font-size: 15px; display: block; margin-bottom: 4px;">🗺️ Learning Roadmap</strong>
                <span style="color: #d1d5db; font-size: 13px; line-height: 1.5; display: block;">
                    Synthesizes a structured 4-week learning timeline, pairing tutorials, builds, and proof tasks to keep your progress focused.
                </span>
            </td>
        </tr>
    </table>
    
    <div style="text-align: center; margin-top: 40px; margin-bottom: 15px;">
        <a href="https://career-mind-a-ezi2.vercel.app/" style="background: linear-gradient(135deg, #a855f7, #ec4899, #3b82f6); color: #ffffff; text-decoration: none; padding: 15px 35px; font-size: 15px; font-weight: 800; border-radius: 14px; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.35); display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
            Go to Dashboard
        </a>
    </div>
    """.format(username=user.username)
    
    html_content = BASE_HTML_TEMPLATE.format(title=title, content=content, creator_spotlight=CREATOR_SPOTLIGHT_HTML)
    text_content = strip_tags(content)
    
    msg = EmailMultiAlternatives(
        subject=title,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email]
    )
    msg.attach_alternative(html_content, "text/html")
    
    try:
        msg.send()
        return True
    except Exception as e:
        print(f"Error sending welcome email: {e}", file=sys.stderr)
        return False

def send_password_reset_email(user, otp):
    """Sends a highly secure and colorful password reset email containing the 6-digit OTP code."""
    if not user.email:
        return False
        
    title = "Reset Your Password - SkillForge AI 🔒"
    
    content = """
    <h2 style="color: #ffffff; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 15px; text-align: left; background: linear-gradient(90deg, #ff007f, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        Password Recovery Request
    </h2>
    <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Hi <strong>{username}</strong>, we received a request to reset the password for your account on SkillForge AI.
    </p>
    <p style="color: #9898b0; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
        Use the 6-digit verification code below to authorize your password change. This code is highly confidential and is valid for exactly 15 minutes.
    </p>
    
    <div style="text-align: center; margin: 35px 0;">
        <div style="display: inline-block; background-color: #1e1135; border: 2px dashed #ec4899; border-radius: 20px; padding: 18px 45px; box-shadow: 0 0 20px rgba(236, 72, 153, 0.15);">
            <span style="font-family: 'Courier New', monospace, sans-serif; font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #ec4899; text-shadow: 0 0 10px rgba(236, 72, 153, 0.4);">
                {otp}
            </span>
        </div>
    </div>
    
    <p style="color: #55556a; font-size: 12.5px; line-height: 1.5; margin-top: 25px; margin-bottom: 0; border-top: 1px solid #1a1a25; padding-top: 15px;">
        ⚠️ <strong>Security Advisory:</strong> If you did not request this verification, please disregard this alert. Your credentials remain safe and secure.
    </p>
    """.format(username=user.username, otp=otp)
    
    html_content = BASE_HTML_TEMPLATE.format(title=title, content=content, creator_spotlight=CREATOR_SPOTLIGHT_HTML)
    text_content = strip_tags(content)
    
    msg = EmailMultiAlternatives(
        subject=title,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email]
    )
    msg.attach_alternative(html_content, "text/html")
    
    try:
        msg.send()
        return True
    except Exception as e:
        print(f"Error sending password reset email: {e}", file=sys.stderr)
        return False

def send_credential_update_email(user, change_type, old_value, new_value):
    """Sends a colorful security alert email when credentials change."""
    email_to_send = user.email
    recipients = [email_to_send]
    if change_type == 'email' and old_value:
        recipients.append(old_value)
        
    recipients = list(set(recipients))
    if not recipients:
        return False
        
    title = "Security Alert: Account Information Updated 🛡️"
    
    change_text = ""
    if change_type == 'username':
        change_text = """
        Your profile's <strong>Username</strong> has been successfully updated from <span style="color: #ef4444; text-decoration: line-through;">{old_val}</span> to <strong style="color: #10b981;">{new_val}</strong>.
        """.format(old_val=old_value, new_val=new_value)
    elif change_type == 'email':
        change_text = """
        Your profile's registered <strong>Email Address</strong> has been successfully updated from <span style="color: #ef4444; text-decoration: line-through;">{old_val}</span> to <strong style="color: #10b981;">{new_val}</strong>.
        """.format(old_val=old_value, new_val=new_value)
    
    content = """
    <h2 style="color: #ffffff; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 15px; text-align: left; background: linear-gradient(90deg, #fb923c, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        Account Information Updated
    </h2>
    <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Hi <strong>{username}</strong>, this is an automated security alert regarding your profile details.
    </p>
    
    <div style="background-color: #111118; border: 1px solid #1a1a25; border-radius: 16px; padding: 20px; margin-bottom: 25px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
        <p style="margin: 0; color: #e2e8f0; font-size: 14.5px; line-height: 1.6;">
            {change_text}
        </p>
    </div>
    
    <p style="color: #9898b0; font-size: 13.5px; line-height: 1.6; margin-bottom: 0;">
        If you initiated this change, you can safely ignore this notification.
        <br><br>
        <span style="color: #ef4444; font-weight: 700;">⚠️ Unrecognized Change?</span> 
        If you did not authorize this request, please change your password or contact our support team immediately.
    </p>
    """.format(username=user.username, change_text=change_text)
    
    html_content = BASE_HTML_TEMPLATE.format(title=title, content=content, creator_spotlight=CREATOR_SPOTLIGHT_HTML)
    text_content = strip_tags(content)
    
    msg = EmailMultiAlternatives(
        subject=title,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=recipients
    )
    msg.attach_alternative(html_content, "text/html")
    
    try:
        msg.send()
        return True
    except Exception as e:
        print(f"Error sending security update email: {e}", file=sys.stderr)
        return False
