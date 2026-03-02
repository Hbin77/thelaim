from sqlmodel import Session, func, select

from app.models.category import Category
from app.models.product import Product
from app.schemas.product import (
    ProductListResponse,
    ProductResponse,
    build_product_response,
)


def get_products(
    session: Session,
    category: str | None = None,
    search: str | None = None,
    page: int = 1,
    limit: int = 12,
    lang: str = "ko",
) -> ProductListResponse:
    statement = select(Product).join(Category, isouter=True)
    count_statement = select(func.count()).select_from(Product).join(Category, isouter=True)

    if category:
        statement = statement.where(Category.slug == category)
        count_statement = count_statement.where(Category.slug == category)

    if search:
        search_filter = (
            Product.name_ko.contains(search)
            | Product.name_en.icontains(search)
            | Product.name_zh.contains(search)
            | Product.description_ko.contains(search)
            | Product.description_en.icontains(search)
        )
        statement = statement.where(search_filter)
        count_statement = count_statement.where(search_filter)

    total = session.exec(count_statement).one()

    offset = (page - 1) * limit
    statement = statement.offset(offset).limit(limit)
    products = session.exec(statement).all()

    items = [build_product_response(p, lang) for p in products]
    return ProductListResponse(items=items, total=total, page=page, limit=limit)


def get_featured_products(session: Session, lang: str = "ko") -> list[ProductResponse]:
    statement = select(Product).join(Category, isouter=True).where(Product.is_featured == True)
    products = session.exec(statement).all()
    return [build_product_response(p, lang) for p in products]


def get_product_by_slug(session: Session, slug: str, lang: str = "ko") -> ProductResponse | None:
    statement = select(Product).join(Category, isouter=True).where(Product.slug == slug)
    product = session.exec(statement).first()
    if not product:
        return None
    return build_product_response(product, lang)
