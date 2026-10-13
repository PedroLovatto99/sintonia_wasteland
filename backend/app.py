from contextlib import asynccontextmanager
from fastapi import FastAPI

from database.models import Base, db
from rag.dj_setup import iniciar_sistema
from controller.rotas import rota_radio


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(db)
    iniciar_sistema()
    yield


app = FastAPI(title="Sintonia Wasteland", lifespan=lifespan)

app.include_router(rota_radio)
