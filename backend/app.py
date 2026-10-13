from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.models import Base, db
from rag.dj_setup import iniciar_sistema
from controller.rotas import rota_radio


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(db)
    iniciar_sistema()
    yield


app = FastAPI(title="Sintonia Wasteland", lifespan=lifespan)

# Origens do React (Vite usa 5173; CRA usa 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(rota_radio)
