from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

db_usuario = os.getenv("DB_USUARIO")
db_senha = os.getenv("DB_SENHA")
db_host = os.getenv("DB_HOST", "localhost")
db_port = os.getenv("DB_PORT", "3306")
db_nome = os.getenv("DB_NOME")

db = create_engine(
    f"mysql+mysqlconnector://{db_usuario}:{db_senha}@{db_host}:{db_port}/{db_nome}",
    pool_pre_ping=True,
)

Base = declarative_base()


class musicaHistorico(Base):

    __tablename__ = "historico_musica"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome_musica = Column(String(100), nullable=False)
    artista = Column(String(100), nullable=False)
    duracao = Column(Integer, nullable=False)
    url = Column(String(200), nullable=False)
