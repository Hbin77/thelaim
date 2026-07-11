import json
import logging
from datetime import datetime, timezone
from pathlib import Path

from sqlmodel import Session, select

from app.models.category import Category
from app.models.product import Product

logger = logging.getLogger(__name__)

SEED_DIR = Path(__file__).parent

CATEGORY_FIELDS = [
    "name_ko", "name_en", "name_zh", "name_ja",
    "description_ko", "description_en", "description_zh", "description_ja",
    "icon", "sort_order",
]
PRODUCT_FIELDS = [
    "name_ko", "name_en", "name_zh", "name_ja",
    "description_ko", "description_en", "description_zh", "description_ja",
    "image_url", "image_urls", "specifications", "is_featured",
]


def _apply_fields(row, item: dict, fields: list[str]) -> bool:
    changed = False
    for field in fields:
        if field in item and getattr(row, field) != item[field]:
            setattr(row, field, item[field])
            changed = True
    return changed


def sync_categories(session: Session) -> dict[str, int]:
    with open(SEED_DIR / "categories.json") as f:
        data = json.load(f)

    existing = {c.slug: c for c in session.exec(select(Category)).all()}

    created = updated = 0
    for item in data:
        row = existing.get(item["slug"])
        if row is None:
            row = Category(**item)
            session.add(row)
            created += 1
        elif _apply_fields(row, item, CATEGORY_FIELDS):
            updated += 1

    session.commit()
    logger.info("Categories synced: %d created, %d updated", created, updated)
    categories = session.exec(select(Category)).all()
    return {c.slug: c.id for c in categories}


def prune_categories(session: Session) -> None:
    # 상품 정리(sync_products) 후에 호출해야 구 카테고리가 같은 사이클에 제거된다.
    with open(SEED_DIR / "categories.json") as f:
        seed_slugs = {item["slug"] for item in json.load(f)}

    removed = 0
    for row in session.exec(select(Category)).all():
        if row.slug not in seed_slugs and not row.products:
            session.delete(row)
            removed += 1

    session.commit()
    if removed:
        logger.info("Categories pruned: %d removed", removed)


def sync_products(session: Session, category_slug_to_id: dict[str, int]) -> None:
    with open(SEED_DIR / "products.json") as f:
        data = json.load(f)

    existing = {p.slug: p for p in session.exec(select(Product)).all()}
    seed_slugs = {item["slug"] for item in data}

    created = updated = removed = 0
    for item in data:
        item = dict(item)
        category_slug = item.pop("category_slug", None)
        category_id = category_slug_to_id.get(category_slug) if category_slug else None

        row = existing.get(item["slug"])
        if row is None:
            session.add(Product(category_id=category_id, **item))
            created += 1
        else:
            changed = _apply_fields(row, item, PRODUCT_FIELDS)
            if row.category_id != category_id:
                row.category_id = category_id
                changed = True
            if changed:
                row.updated_at = datetime.now(timezone.utc)
                updated += 1

    for slug, row in existing.items():
        if slug not in seed_slugs:
            session.delete(row)
            removed += 1

    session.commit()
    logger.info("Products synced: %d created, %d updated, %d removed", created, updated, removed)


def run_seeder(session: Session) -> None:
    logger.info("Syncing database with seed data...")
    slug_to_id = sync_categories(session)
    sync_products(session, slug_to_id)
    prune_categories(session)
    logger.info("Seed sync complete")
