import logging
from email.message import EmailMessage

import aiosmtplib

from app.config import settings
from app.models.contact import ContactInquiry

logger = logging.getLogger(__name__)


async def send_notification_email(inquiry: ContactInquiry) -> None:
    if not settings.SMTP_HOST or not settings.NOTIFICATION_EMAIL:
        logger.info("SMTP not configured, skipping notification email for inquiry #%s", inquiry.id)
        return

    msg = EmailMessage()
    msg["Subject"] = f"[Thelaim] 새로운 문의 - {inquiry.company_name}"
    msg["From"] = settings.SMTP_USER
    msg["To"] = settings.NOTIFICATION_EMAIL
    msg.set_content(
        f"새로운 문의가 접수되었습니다.\n\n"
        f"회사명: {inquiry.company_name}\n"
        f"담당자: {inquiry.contact_person}\n"
        f"이메일: {inquiry.email}\n"
        f"전화: {inquiry.phone}\n"
        f"관심 제품: {inquiry.product_interest}\n"
        f"선호 연락 방법: {inquiry.preferred_contact}\n\n"
        f"메시지:\n{inquiry.message}\n"
    )

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
        )
        logger.info("Notification email sent for inquiry #%s", inquiry.id)
    except Exception:
        logger.exception("Failed to send notification email for inquiry #%s", inquiry.id)
