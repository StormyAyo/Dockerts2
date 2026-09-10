import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .db import get_session, init_db
from .models import Person
from .schemas import PersonCreate, PersonResponse


@asynccontextmanager
async def lifespan(_: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Fieldnotes Biodata API", version="1.0.0", lifespan=lifespan)
origins = os.getenv("CORS_ORIGINS", "http://localhost:8080,http://localhost:5500").split(",")
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False, allow_methods=["GET", "POST"], allow_headers=["*"])


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/people", response_model=PersonResponse, status_code=status.HTTP_201_CREATED)
async def create_person(payload: PersonCreate, session: AsyncSession = Depends(get_session)) -> Person:
    person = Person(**payload.model_dump())
    session.add(person)
    await session.commit()
    await session.refresh(person)
    return person


@app.get("/api/v1/people", response_model=list[PersonResponse])
async def list_people(session: AsyncSession = Depends(get_session)) -> list[Person]:
    result = await session.execute(select(Person).order_by(Person.created_at.desc()).limit(50))
    return list(result.scalars().all())
