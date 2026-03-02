from pydantic import BaseModel, EmailStr


class ContactCreate(BaseModel):
    company_name: str
    contact_person: str
    email: EmailStr
    phone: str = ""
    product_interest: str = ""
    message: str
    preferred_contact: str = "email"


class ContactResponse(BaseModel):
    id: int
    message: str


CONFIRMATION_MESSAGES = {
    "ko": "문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.",
    "en": "Your inquiry has been submitted. We will respond as soon as possible.",
    "zh": "您的咨询已提交。我们会尽快回复您。",
}


def build_contact_response(inquiry_id: int, lang: str = "ko") -> ContactResponse:
    msg = CONFIRMATION_MESSAGES.get(lang, CONFIRMATION_MESSAGES["ko"])
    return ContactResponse(id=inquiry_id, message=msg)
