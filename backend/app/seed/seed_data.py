import json
import logging
from pathlib import Path

from sqlmodel import Session, select

from app.models.category import Category
from app.models.product import Product

logger = logging.getLogger(__name__)

SEED_DIR = Path(__file__).parent


def seed_categories(session: Session) -> dict[str, int]:
    existing = session.exec(select(Category)).first()
    if existing:
        logger.info("Categories already seeded, skipping")
        categories = session.exec(select(Category)).all()
        return {c.slug: c.id for c in categories}

    with open(SEED_DIR / "categories.json") as f:
        data = json.load(f)

    slug_to_id = {}
    for item in data:
        category = Category(**item)
        session.add(category)
        session.flush()
        slug_to_id[category.slug] = category.id

    session.commit()
    logger.info("Seeded %d categories", len(data))
    return slug_to_id


def seed_products(session: Session, category_slug_to_id: dict[str, int]) -> None:
    existing = session.exec(select(Product)).first()
    if existing:
        logger.info("Products already seeded, skipping")
        return

    with open(SEED_DIR / "products.json") as f:
        data = json.load(f)

    for item in data:
        category_slug = item.pop("category_slug", None)
        category_id = category_slug_to_id.get(category_slug) if category_slug else None
        product = Product(category_id=category_id, **item)
        session.add(product)

    session.commit()
    logger.info("Seeded %d products", len(data))


def run_seeder(session: Session) -> None:
    logger.info("Running database seeder...")
    slug_to_id = seed_categories(session)
    seed_products(session, slug_to_id)
    logger.info("Seeder complete")
