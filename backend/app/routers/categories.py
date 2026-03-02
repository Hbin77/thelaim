from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.category import Category
from app.schemas.category import CategoryResponse, build_category_response

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryResponse])
def list_categories(
    lang: str = Query(default="ko", pattern="^(ko|en|zh)$"),
    session: Session = Depends(get_session),
):
    statement = select(Category).order_by(Category.sort_order)
    categories = session.exec(statement).all()
    return [build_category_response(c, lang) for c in categories]
