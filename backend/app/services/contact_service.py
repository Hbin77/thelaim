from sqlmodel import Session

from app.models.contact import ContactInquiry
from app.schemas.contact import ContactCreate


def create_inquiry(session: Session, data: ContactCreate, ip_address: str = "") -> ContactInquiry:
    inquiry = ContactInquiry(
        company_name=data.company_name,
        contact_person=data.contact_person,
        email=data.email,
        phone=data.phone,
        product_interest=data.product_interest,
        message=data.message,
        preferred_contact=data.preferred_contact,
        ip_address=ip_address,
    )
    session.add(inquiry)
    session.commit()
    session.refresh(inquiry)
    return inquiry
