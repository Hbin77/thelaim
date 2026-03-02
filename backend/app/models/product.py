from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

from app.models.category import Category


class Product(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    name_ko: str
    name_en: str
    name_zh: str
    description_ko: str = ""
    description_en: str = ""
    description_zh: str = ""
    category_id: int | None = Field(default=None, foreign_key="category.id")
    category: Category | None = Relationship(back_populates="products")
    image_url: str = ""
    image_urls: str = "[]"
    specifications: str = "{}"
    is_featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
