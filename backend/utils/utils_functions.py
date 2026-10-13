import random
import json
from sqlalchemy import select, func
from database.models import musicaHistorico

TAMANHO_HISTORICO = 10


def sortear_assunto():
    topico = random.choice(["Notícia", "Sobrevivência", "Fofoca", "Propaganda"])
    return topico


def carregar_musicas():
    with open("dados.json", "r", encoding="utf-8") as arquivo:
        return json.load(arquivo)


def proxima_musica(session):
    musicas = carregar_musicas()

    tocadas = set(session.scalars(select(musicaHistorico.nome_musica)))
    disponiveis = [m for m in musicas if m["nome_musica"] not in tocadas]
    musica = random.choice(disponiveis or musicas)

    total_musicas = session.scalar(select(func.count(musicaHistorico.id)))

    if total_musicas >= TAMANHO_HISTORICO:
        primeiro_lista = session.scalars(
            select(musicaHistorico).order_by(musicaHistorico.id.asc()).limit(1)
        ).first()
        if primeiro_lista:
            session.delete(primeiro_lista)

    session.add(musicaHistorico(
        nome_musica=musica["nome_musica"],
        artista=musica["artista"],
        duracao=musica["duracao"],
        url=musica["url"],
    ))
    session.commit()

    return musica
