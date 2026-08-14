# Backend — FW Coipo Inteligencia de Incendios

Node.js + Express + PostgreSQL (`pg`).

La maqueta devuelve datos dummy para revisar el frontend sin depender de la BD.

## PostgreSQL

Copiar `.env.example` a `.env` y completar:

```text
PGHOST=172.31.2.22
PGPORT=5432
PGDATABASE=sidco_produccion
PGUSER=
PGPASSWORD=
```

La conexión está preparada en `src/db/postgres.js`.

## Endpoints

- `GET /api/health`
- `GET /api/dashboard`

La siguiente integración puede reemplazar `src/data/dashboard.js` por consultas a PostgreSQL y conectar los 12 endpoints reales.
