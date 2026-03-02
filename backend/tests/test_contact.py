def test_submit_contact(client):
    data = {
        "company_name": "테스트 회사",
        "contact_person": "홍길동",
        "email": "test@example.com",
        "phone": "010-1234-5678",
        "product_interest": "겨울의류",
        "message": "제품에 대해 문의드립니다.",
        "preferred_contact": "email",
    }
    response = client.post("/api/v1/contact", json=data)
    assert response.status_code == 200
    result = response.json()
    assert result["id"] == 1
    assert "문의가 접수되었습니다" in result["message"]


def test_submit_contact_english(client):
    data = {
        "company_name": "Test Corp",
        "contact_person": "John Doe",
        "email": "john@example.com",
        "message": "I would like to inquire about your products.",
    }
    response = client.post("/api/v1/contact?lang=en", json=data)
    assert response.status_code == 200
    result = response.json()
    assert "submitted" in result["message"].lower()


def test_submit_contact_invalid_email(client):
    data = {
        "company_name": "Test",
        "contact_person": "Test",
        "email": "not-an-email",
        "message": "Test message",
    }
    response = client.post("/api/v1/contact", json=data)
    assert response.status_code == 422


def test_submit_contact_missing_required(client):
    data = {
        "company_name": "Test",
        "email": "test@example.com",
    }
    response = client.post("/api/v1/contact", json=data)
    assert response.status_code == 422
