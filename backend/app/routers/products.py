from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app.database import get_session
from app.schemas.product import ProductListResponse, ProductResponse
from app.services.product_service import (
    get_featured_products,
    get_product_by_slug,
    get_products,
)

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=ProductListResponse)
def list_products(
    category: str | None = None,
    search: str | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=100),
    lang: str = Query(default="ko", pattern="^(ko|en|zh)$"),
    session: Session = Depends(get_session),
):
    return get_products(session, category=category, search=search, page=page, limit=limit, lang=lang)


@router.get("/featured", response_model=list[ProductResponse])
def list_featured_products(
    lang: str = Query(default="ko", pattern="^(ko|en|zh)$"),
    session: Session = Depends(get_session),
):
    return get_featured_products(session, lang=lang)


@router.get("/{slug}", response_model=ProductResponse)
def get_product(
    slug: str,
    lang: str = Query(default="ko", pattern="^(ko|en|zh)$"),
    session: Session = Depends(get_session),
):
    product = get_product_by_slug(session, slug, lang=lang)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
