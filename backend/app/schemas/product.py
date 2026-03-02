import json

from pydantic import BaseModel

from app.models.product import Product


class ProductResponse(BaseModel):
    id: int
    slug: str
    name: str
    description: str
    category_slug: str | None
    category_name: str | None
    image_url: str
    image_urls: list[str]
    specifications: dict
    is_featured: bool


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    limit: int


def build_product_response(product: Product, lang: str = "ko") -> ProductResponse:
    name = getattr(product, f"name_{lang}", product.name_ko)
    description = getattr(product, f"description_{lang}", product.description_ko)

    category_slug = None
    category_name = None
    if product.category:
        category_slug = product.category.slug
        category_name = getattr(product.category, f"name_{lang}", product.category.name_ko)

    try:
        image_urls = json.loads(product.image_urls)
    except (json.JSONDecodeError, TypeError):
        image_urls = []

    try:
        specifications = json.loads(product.specifications)
    except (json.JSONDecodeError, TypeError):
        specifications = {}

    return ProductResponse(
        id=product.id,
        slug=product.slug,
        name=name,
        description=description,
        category_slug=category_slug,
        category_name=category_name,
        image_url=product.image_url,
        image_urls=image_urls,
        specifications=specifications,
        is_featured=product.is_featured,
    )
