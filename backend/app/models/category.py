from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.product import Product


class Category(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    name_ko: str
    name_en: str
    name_zh: str
    description_ko: str = ""
    description_en: str = ""
    description_zh: str = ""
    icon: str = ""
    sort_order: int = 0
    products: list["Product"] = Relationship(back_populates="category")
