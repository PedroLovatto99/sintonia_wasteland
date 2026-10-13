from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db_sessao import pegar_sessao
from rag.dj_setup import obter_fala
from utils.utils_functions import sortear_assunto, proxima_musica

rota_radio = APIRouter(tags=["radio"])


@rota_radio.get("/chamar-dj")
def chamar_dj():
    assunto = sortear_assunto()
    fala = obter_fala(assunto)
    return {"fala": fala}


@rota_radio.get("/proxima-musica")
def chamar_proxima_musica(session: Session = Depends(pegar_sessao)):
    return proxima_musica(session)
