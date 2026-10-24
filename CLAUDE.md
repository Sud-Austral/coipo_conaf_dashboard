# coipo_conaf_dashboard — guía para agentes

## Resumen
Dashboard SIDCO de incendios (temporada 2025/26), v2.8.9. Frontend React 19 + Vite 7 + Leaflet que consume datos embebidos; backend
Express de maqueta casi sin funciones. Propósito de negocio y usuarios: pendiente de confirmar por el equipo.

## Estructura
- `frontend/src/App.jsx`: shell y navegación por estado. `views/` son las vistas vigentes; `components/` mapas y KPI; `data/` datos embebidos
  (`dashboardData.js` pesa ~1,9 MB); `config/danoCatalogo.js` diccionario de daño; `utils/` saneo de GeoJSON/coordenadas.
- `frontend/src/pages/`, `lib/data.js`, `data/dummy.js`, `data/api.js`: código heredado de v1.1.0 que `App.jsx` no importa.
- `backend/src/server.js`: `/health` y `/api/bitacora/:id` (valores fijos). `routes/dashboard.js` y `db/postgres.js` sin montar.
- `data/source_sidco_2025_26/`: extracción fuente. `scripts/` + `descargar_capas.bat`: capas oficiales locales. `docs/`: notas por versión.

## Comandos
- Frontend: `cd frontend && npm install && npm run dev | build | preview` (no hay `test` ni `lint` en scripts).
- Backend: `cd backend && npm install && npm run dev | start`.
- CI: `.github/workflows/deploy.yml` y `deploy-pages.yml` construyen `frontend/` y publican en Pages.
- Capas: `descargar_capas.bat` (Python + `requests`; descarga a `frontend/public/data/capas/`). No ejecuté nada de esto al documentar.

## Convenciones y reglas de datos (VERIFICADO en `frontend/VERSIONES.md`)
- Umbral de gran incendio: > 400 ha. No inventar valores: la serie mensual 2024/25 está explícitamente pendiente de extracción.
- Validar coordenadas rechazando `null`/`undefined`/cadena vacía **antes** de `Number()` (`Number(null)` es 0; causó un error de runtime en v2.8.4).
- Sanear GeoJSON antes de pasarlo a Leaflet; el replay no es tracking GPS, es interpolación visual entre puntos conocidos.
- Capas naturales: estrategia local-first; si falta una capa se muestra «No disponible», sin fallback silencioso a WMS.

## Trampas
- `vite.config.js` usa `base: "./"`; `CONFIG_GITHUB_PAGES.md` habla de `VITE_BASE` (desfasado).
- `backend/src/db/postgres.js` importa `dotenv`, que no está en `backend/package.json`.
- `README_V1.1.0.md`, `DASHBOARD_BI.md`, `VERSION.md`, `TEMPLATE_VERSION.md` son históricos de otras iteraciones.
- No commitear `.env` ni credenciales PG (`backend/README.md` muestra un host interno de ejemplo).
- No editar `data/source_sidco_2025_26/` ni los `*.real.js` a mano: son salida de extracción.
