from datetime import datetime

from sqlmodel import Field, SQLModel


class ContactInquiry(SQLModel, table=True):
    __tablename__ = "contact_inquiry"
    id: int | None = Field(default=None, primary_key=True)
    company_name: str
    contact_person: str
    email: str
    phone: str = ""
    product_interest: str = ""
    message: str
    preferred_contact: str = "email"
    status: str = "new"
    ip_address: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
