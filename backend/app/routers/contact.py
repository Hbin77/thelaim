from fastapi import APIRouter, BackgroundTasks, Depends, Query, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlmodel import Session

from app.database import get_session
from app.schemas.contact import ContactCreate, ContactResponse, build_contact_response
from app.services.contact_service import create_inquiry
from app.services.email_service import send_notification_email

router = APIRouter(prefix="/contact", tags=["contact"])

limiter = Limiter(key_func=get_remote_address)


@router.post("", response_model=ContactResponse)
@limiter.limit("3/hour")
async def submit_contact(
    request: Request,
    data: ContactCreate,
    background_tasks: BackgroundTasks,
    lang: str = Query(default="ko", pattern="^(ko|en|zh)$"),
    session: Session = Depends(get_session),
):
    ip_address = request.client.host if request.client else ""
    inquiry = create_inquiry(session, data, ip_address=ip_address)
    background_tasks.add_task(send_notification_email, inquiry)
    return build_contact_response(inquiry.id, lang)
