# Forestin · Dashboard de Incendios

**Versión:** v2.1

Proyecto consolidado con seis vistas:

1. Resumen Ejecutivo
2. Prioridad Territorial
3. Operación y Recursos
4. Impacto y Daño
5. Calidad y Confianza
6. Bitácora del Incendio

## Arquitectura

- Frontend: React + Vite
- Mapas territoriales: Leaflet / React Leaflet
- Vista operacional: MapLibre GL JS
- Backend: Node.js + Express
- Base objetivo: PostgreSQL
- Bitácora v1: motor narrativo determinístico basado en reglas
- Impresión/PDF: CSS `@media print`

## Ejecutar frontend

```bash
cd frontend
npm install
npm run dev
```

## Ejecutar backend

```bash
cd backend
npm install
npm run dev
```

Backend por defecto:

```text
http://localhost:3001
```

## GitHub Pages

El workflow `.github/workflows/deploy-pages.yml`:

- instala Node 22;
- usa caché npm con `frontend/package-lock.json`;
- instala solo el frontend;
- ejecuta `npm run build`;
- publica `frontend/dist`.

El backend **no** se despliega en GitHub Pages.

## Datos

La maqueta funciona con datos locales de ejemplo basados en los diagnósticos realizados.
La conexión real a PostgreSQL queda preparada para una siguiente iteración.
