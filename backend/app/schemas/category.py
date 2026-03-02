from pydantic import BaseModel

from app.models.category import Category


class CategoryResponse(BaseModel):
    id: int
    slug: str
    name: str
    description: str
    icon: str
    sort_order: int


def build_category_response(category: Category, lang: str = "ko") -> CategoryResponse:
    name = getattr(category, f"name_{lang}", category.name_ko)
    description = getattr(category, f"description_{lang}", category.description_ko)
    return CategoryResponse(
        id=category.id,
        slug=category.slug,
        name=name,
        description=description,
        icon=category.icon,
        sort_order=category.sort_order,
    )
