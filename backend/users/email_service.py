import sys
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

# Global developer signature HTML block to be appended to all emails
DEVELOPER_SIGNATURE = """
<div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #2d3748; text-align: center;">
    <div style="display: inline-block; background: linear-gradient(135deg, #1e1b4b, #311042); border: 1px solid #4c1d95; border-radius: 16px; padding: 20px; min-width: 280px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); text-align: left;">
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #8b5cf6, #ec4899); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #ffffff; font-size: 18px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                RC
            </div>
            <div>
                <p style="margin: 0; color: #f3f4f6; font-size: 15px; font-weight: 700; letter-spacing: 0.5px;">Raj Chaudhary</p>
                <p style="margin: 2px 0 0 0; color: #a78bfa; font-size: 12px; font-weight: 600;">Lead AI Platform Developer</p>
            </div>
        </div>
        <p style="margin: 12px 0 0 0; color: #9ca3af; font-size: 11.5px; line-height: 1.4; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px;">
            Thank you for being part of SkillForge AI. If you have any feedback or feature requests, feel free to reach out directly!
        </p>
    </div>
</div>
"""

BASE_HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #f3f4f6;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0f19; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #111827; border: 1px solid #1f2937; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 20px; background: linear-gradient(135deg, #1e1b4b 0%, #111827 100%); border-bottom: 1px solid #1f2937;">
                            <div style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">
                                SkillForge AI
                            </div>
                            <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600;">Next-Gen Career OS</p>
                        </td>
                    </tr>
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 40px 35px; background-color: #111827;">
                            {content}
                            
                            <!-- Developer Signature -->
                            {signature}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 25px 20px; background-color: #0f172a; border-top: 1px solid #1f2937;">
                            <p style="margin: 0; color: #9ca3af; font-size: 11px;">&copy; 2026 SkillForge AI. All rights reserved.</p>
                            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 11px;">You are receiving this security notification because you registered an account on SkillForge AI.</p>
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
    """Sends a gorgeous welcome email when user registers."""
    if not user.email:
        return False
        
    title = "Welcome to SkillForge AI, {}! ⚡".format(user.username)
    
    content = """
    <h2 style="color: #ffffff; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 20px; text-align: left;">
        Your AI Career Journey Begins Here! 🚀
    </h2>
    <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Hi <strong>{username}</strong>, welcome to SkillForge AI! We are thrilled to have you join our next-generation career operating system built for software developers.
    </p>
    <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
        Here is what you can start exploring right now to supercharge your career:
    </p>
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
        <tr>
            <td style="padding: 15px; background-color: #1e1b4b; border-left: 4px solid #8b5cf6; border-radius: 8px; margin-bottom: 12px; display: block;">
                <strong style="color: #ffffff; font-size: 14.5px;">🧠 Career DNA Engine</strong>
                <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 13px; line-height: 1.4;">Map your multidimensional tech skills and see how you match against industry standards.</p>
            </td>
        </tr>
        <tr><td style="height: 12px;"></td></tr>
        <tr>
            <td style="padding: 15px; background-color: #0f172a; border-left: 4px solid #3b82f6; border-radius: 8px; margin-bottom: 12px; display: block;">
                <strong style="color: #ffffff; font-size: 14.5px;">📄 Resume ATS Diagnostics</strong>
                <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 13px; line-height: 1.4;">Upload your PDF resume to scan for ATS compliance and get instant Gemini-backed tips.</p>
            </td>
        </tr>
        <tr><td style="height: 12px;"></td></tr>
        <tr>
            <td style="padding: 15px; background-color: #172554; border-left: 4px solid #ec4899; border-radius: 8px; display: block;">
                <strong style="color: #ffffff; font-size: 14.5px;">🎤 Mock Interview AI</strong>
                <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 13px; line-height: 1.4;">Practice speaking or typing answers in real-time and get precise technical feedback scores.</p>
            </td>
        </tr>
    </table>
    
    <div style="text-align: center; margin-top: 30px; margin-bottom: 10px;">
        <a href="https://career-mind-a-ezi2.vercel.app/" style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: #ffffff; text-decoration: none; padding: 14px 30px; font-size: 15px; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); display: inline-block;">
            Launch Dashboard
        </a>
    </div>
    """.format(username=user.username)
    
    html_content = BASE_HTML_TEMPLATE.format(title=title, content=content, signature=DEVELOPER_SIGNATURE)
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
    """Sends a highly secure and stylized password reset email containing a 6-digit OTP code."""
    if not user.email:
        return False
        
    title = "Reset Your Password - SkillForge AI 🔒"
    
    content = """
    <h2 style="color: #ffffff; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 20px; text-align: left;">
        Password Reset Request
    </h2>
    <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Hi <strong>{username}</strong>, we received a request to reset the password for your account on SkillForge AI.
    </p>
    <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
        Please use the following 6-digit verification code (OTP) to complete the reset. This code is confidential and will expire in 15 minutes.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background-color: #1e1b4b; border: 2px dashed #8b5cf6; border-radius: 16px; padding: 15px 40px;">
            <span style="font-family: 'Courier New', monospace, sans-serif; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #8b5cf6; text-shadow: 0 0 10px rgba(139, 92, 246, 0.4);">
                {otp}
            </span>
        </div>
    </div>
    
    <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin-top: 25px; margin-bottom: 0; border-top: 1px solid #1f2937; padding-top: 15px;">
        ⚠️ <strong>Security Notice:</strong> If you did not request this change, please ignore this email or secure your account. Your password will remain unchanged.
    </p>
    """.format(username=user.username, otp=otp)
    
    html_content = BASE_HTML_TEMPLATE.format(title=title, content=content, signature=DEVELOPER_SIGNATURE)
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
    """Sends a security alert email when username or email changes."""
    email_to_send = user.email
    # If the email itself was updated, send the alert to both old and new email addresses to prevent hijacking
    recipients = [email_to_send]
    if change_type == 'email' and old_value:
        recipients.append(old_value)
        
    recipients = list(set(recipients)) # Remove duplicates
    if not recipients:
        return False
        
    title = "Security Alert: Profile Information Updated 🛡️"
    
    change_text = ""
    if change_type == 'username':
        change_text = """
        Your <strong>Username</strong> has been changed from <span style="color: #ef4444; text-decoration: line-through;">{old_val}</span> to <strong style="color: #10b981;">{new_val}</strong>.
        """.format(old_val=old_value, new_val=new_value)
    elif change_type == 'email':
        change_text = """
        Your account's <strong>Email Address</strong> has been changed from <span style="color: #ef4444; text-decoration: line-through;">{old_val}</span> to <strong style="color: #10b981;">{new_val}</strong>.
        """.format(old_val=old_value, new_val=new_value)
    
    content = """
    <h2 style="color: #ffffff; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 20px; text-align: left;">
        Profile Change Notification
    </h2>
    <p style="color: #d1d5db; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Hi <strong>{username}</strong>, this is an automated security notification regarding your SkillForge AI account.
    </p>
    
    <div style="background-color: #0f172a; border: 1px solid #1f2937; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
        <p style="margin: 0; color: #e5e7eb; font-size: 14.5px; line-height: 1.6;">
            {change_text}
        </p>
    </div>
    
    <p style="color: #d1d5db; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
        If you performed this action, no further steps are required. 
        <br><br>
        <span style="color: #ef4444; font-weight: bold;">⚠️ Didn't recognize this change?</span> 
        If you did not authorize this modification, please contact support or reset your password immediately to protect your account.
    </p>
    """.format(username=user.username, change_text=change_text)
    
    html_content = BASE_HTML_TEMPLATE.format(title=title, content=content, signature=DEVELOPER_SIGNATURE)
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
