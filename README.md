# Forestin · Dashboard de Incendios

Versión consolidada con 6 vistas:
1. Resumen Ejecutivo
2. Prioridad Territorial
3. Operación y Recursos
4. Impacto y Daño
5. Calidad y Confianza
6. Bitácora del Incendio

## Arquitectura
- Frontend: React + Vite
- Mapas territoriales: Leaflet / React Leaflet
- Mapa operacional: MapLibre GL JS
- Backend: Node.js + Express
- Base objetivo: PostgreSQL
- Bitácora v1: motor narrativo determinístico basado en reglas

## Ejecutar
### Frontend
```bash
cd frontend
npm install
npm run dev
```
### Backend
```bash
cd backend
npm install
npm run dev
```

La maqueta usa datos de ejemplo para abrir sin PostgreSQL. La conexión real queda preparada para una siguiente iteración.
