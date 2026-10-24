# Forestin · SIDCO Dashboard (coipo_conaf_dashboard)

Tablero web de lectura sobre incendios forestales de CONAF para la temporada 2025/26: resumen ejecutivo, prioridad territorial,
operación y recursos (con replay en mapa), impacto y daño, bitácora imprimible a PDF, exposición de zonas pobladas y calidad de datos.
Versión de los `package.json`: **2.8.9** (VERIFICADO). Para quién es y la decisión que apoya: pendiente de confirmar por el
equipo (ver [`insumos/00-PROBLEMA.md`](insumos/00-PROBLEMA.md)).

## Vistas (VERIFICADO: `frontend/src/App.jsx`)

Navegación por estado interno (sin react-router): **Resumen**, **Prioridad Territorial**, **Operación y Recursos**, **Impacto y Daño**,
**Bitácora**, **Exposición Poblada**, y aparte (grupo «Datos») **Calidad y Confianza**. Filtros de período (Hoy, 7 días, 30 días,
Temporada, Personalizado), tema claro/oscuro y mapas Leaflet con drill-down Chile → Región → Provincia → Comuna → Incendio.

## Datos

- Los datos de las vistas vienen **embebidos en el frontend** como módulos JS (`frontend/src/data/dashboardData.js` ~1,9 MB,
  `operationalReplay.extended.js`, `resourceBases.real.js`, etc.). `App.jsx` no llama al backend (VERIFICADO: `api.js` y
  `lib/data.js` solo los importa `src/pages/`, código heredado que `App.jsx` no usa).
- Fuente: extracción SIDCO 2025/26 en `data/source_sidco_2025_26/` (CSV/JSON/GeoJSON; reporte en `00_reporte_export_final.txt`).
  Las cifras de cobertura de cada versión están en `frontend/VERSIONES.md`; no las recalculé.
- Capas cartográficas oficiales (áreas protegidas, bosques, urbano/rural INE) se descargan a `frontend/public/data/capas/`
  con `descargar_capas.bat` (usa `scripts/descargar_capas_chile.py`; requiere Python y `requests`). Si faltan, el mapa muestra «No disponible».
- `frontend/public/sidco_sintetico_sur_chile_1mes_yoy.json` es un dataset **sintético** de una iteración anterior (v1.1.0),
  usado solo por `frontend/src/pages/`.

## Estructura

```
frontend/   React 19 + Vite 7 + Leaflet/react-leaflet + maplibre-gl (views/, components/, data/, config/danoCatalogo.js)
backend/    Express 5 + pg: API mínima de maqueta (ver abajo)
data/       Extracción SIDCO 2025/26
scripts/    Descarga de capas territoriales
docs/       Notas por versión (V2_3 ... V2_8_5)
insumos/    Problema, solución y manifiesto
```

## Cómo ejecutarlo

```bash
cd frontend && npm install && npm run dev      # http://localhost:5173
npm run build                                   # frontend/dist
cd ../backend && npm install && npm run dev     # puerto PORT o 3001
```

Backend (VERIFICADO: `backend/src/server.js`): solo monta `GET /health` y `GET /api/bitacora/:id`, que devuelve un texto
armado con valores fijos de ejemplo. `routes/dashboard.js` y `db/postgres.js` existen pero **no están montados**. Variables
del backend (`backend/.env.example`): `PORT`, `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`. Hay un linter
configurado (`frontend/.oxlintrc.json`) pero sin script en `package.json`; no hay pruebas. No ejecuté estos comandos: no lo comprobé.

## Despliegue

Dos workflows publican `frontend/dist` en GitHub Pages: `deploy.yml` (push a `main` que toque `frontend/**`, `npm ci`) y
`deploy-pages.yml` (cualquier push a `main`, `npm install`). Ambos pueden correr a la vez; cuál es el oficial: pendiente de confirmar.
`vite.config.js` usa `base: "./"` (la nota `CONFIG_GITHUB_PAGES.md` menciona `VITE_BASE`, que ya no se lee).

## Documentos

[`CLAUDE.md`](CLAUDE.md) · [`insumos/00-PROBLEMA.md`](insumos/00-PROBLEMA.md) · [`insumos/01-SOLUCION.md`](insumos/01-SOLUCION.md) ·
[`frontend/VERSIONES.md`](frontend/VERSIONES.md) · [`docs/`](docs/)
