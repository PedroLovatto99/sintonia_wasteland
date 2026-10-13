# ☢️ Sintonia Wasteland ☢️

> *"Porque um post-apocalipse sem música é apenas... o apocalipse."*

## 📺 Sobre o Projeto

**Sintonia Wasteland** é uma rádio web imersiva baseada no universo de **Fallout**. O projeto simula a interface de um **Pip-Boy 3000** e traz a experiência das rádios do *Fallout 3*, *Fallout: New Vegas*, *Fallout 4* e *Fallout 76* para o navegador.

Entre as músicas, a IA assume o controle na pele do DJ **Three Dog**. Através do **Google Gemini** e contexto via **RAG** (*Retrieval-Augmented Generation*), o sistema gera roteiros de fala dinâmicos, cobrindo desde o Mojave até a Capital Wasteland, e utiliza síntese de voz para narrar esses textos, simulando uma transmissão ao vivo onde o apresentador reage ao conteúdo da rádio.

---

## 🛠️ Tecnologias Utilizadas

* **Back-end:** Python e FastAPI (Uvicorn)
* **Front-end:** React, TypeScript e Vite
* **IA:** Google Gemini, LangChain e ChromaDB
* **Banco de dados:** MySQL (SQLAlchemy)
* **Conteinerização:** Docker e Nginx

---

## 🚀 Instalação e Configuração

Siga os passos abaixo para colocar a rádio no ar.

### 1. Pré-requisitos
* [Docker](https://www.docker.com/) e Docker Compose instalados.
* Uma chave de API do [Google AI Studio (Gemini)](https://aistudio.google.com/).

### 2. Clonar o repositório

```bash
git clone <url-do-seu-repositorio>
cd sintonia-wasteland
```

### 3. Configurar Variáveis de Ambiente (.env)

Crie um arquivo chamado `.env` na raiz do projeto. Este arquivo guardará suas chaves secretas e as configurações do banco de dados.

Copie e cole o modelo abaixo (ou copie o `.env.example`), preenchendo com seus dados:

```ini
# Gere sua chave em: https://aistudio.google.com/
GOOGLE_API_KEY=sua_chave_do_google_aqui

# --- Configurações do Banco de Dados (MySQL) ---
# Defina o usuário e senha que o Docker vai criar
DB_USUARIO=root
DB_SENHA=sua_senha_mysql
DB_NOME=sintoniadb
```

### 4. Rodar com Docker (Recomendado)

O projeto já está containerizado. Para subir o MySQL, o back-end e o front-end simultaneamente, execute:

```bash
docker compose up --build
```
⚠️ IMPORTANTE: O processo irá demorar um pouco por conta da quantidade de bibliotecas e por conta da configuração do RAG. Na primeira execução, o modelo de embeddings é baixado e o PDF é indexado; enquanto isso, o DJ responde com avisos de "problemas técnicos".

### 5. Para acessar
Abra o seu navegador e acesse:
```bash
http://localhost:8080
```
Clique na tela ***"PLEASE STAND BY"*** para iniciar a rádio.

A documentação interativa da API (Swagger) fica em `http://localhost:8000/docs`.

---

## 💻 Rodando sem Docker (desenvolvimento)

Com o MySQL no ar (por exemplo `docker compose up -d db`, que o expõe na porta `3307`), adicione no `.env`:

```ini
DB_HOST=localhost
DB_PORT=3307
```

Em um terminal, suba o back-end:

```bash
cd backend
python -m venv env
env\Scripts\activate        # Linux/macOS: source env/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
```

Em outro terminal, suba o front-end:

```bash
cd frontend/dj-fallout
npm install
npm run dev
```

Acesse `http://localhost:5173`. O Vite repassa as chamadas de `/api` para o back-end em `localhost:8000`.
