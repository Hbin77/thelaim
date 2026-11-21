from collections.abc import Generator

from sqlalchemy import inspect, text
from sqlmodel import Session, SQLModel, create_engine

from app.config import settings

engine = create_engine(settings.DATABASE_URL, echo=False)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)
    # create_all()은 이미 있는 테이블에 컬럼을 넣지 못한다. 시드가 채우는 product.sort_order(2026-11 추가)는 여기서 보충한다.
    # 확인 후 ALTER라 동시에 여러 프로세스가 시작하면 겹칠 수 있다 — 현재 백엔드는 uvicorn 워커 1개.
    if "sort_order" not in {c["name"] for c in inspect(engine).get_columns("product")}:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE product ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0"))


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
