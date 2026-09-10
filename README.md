# Fieldnotes Biodata Registry

A small full-stack biodata intake app: static browser frontend, FastAPI API, and PostgreSQL storage.

## Run with Docker

```bash
docker compose up --build
```

Open http://localhost:8080. The API is available at http://localhost:8000/docs and its health check is http://localhost:8000/health.

The default development database values are `biodata` for database, user, and password. Override them with environment variables such as `POSTGRES_PASSWORD` before starting Compose.

## Run the API locally

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Set `DATABASE_URL` to a reachable PostgreSQL instance when running outside Compose. The frontend defaults to `http://localhost:8000`; set `window.API_BASE_URL` before loading it to use another API host.

## Test

```bash
cd backend
pytest -q
```
# Dockerts2
