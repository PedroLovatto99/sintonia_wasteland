from sqlalchemy.orm import sessionmaker
from database.models import db

Session = sessionmaker(bind=db)


def pegar_sessao():
    session = Session()
    try:
        yield session
    finally:
        session.close()
