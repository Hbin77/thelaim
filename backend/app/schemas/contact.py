from pydantic import BaseModel, EmailStr, Field


class ContactCreate(BaseModel):
    company_name: str = Field(max_length=200)
    contact_person: str = Field(max_length=100)
    email: EmailStr
    phone: str = Field(default="", max_length=50)
    product_interest: str = Field(default="", max_length=200)
    message: str = Field(max_length=5000)
    preferred_contact: str = Field(default="email", max_length=20)


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
