# Forestin · SIDCO Dashboard v2.3

Versión consolidada con seis vistas:

1. Resumen Ejecutivo
2. Prioridad Territorial
3. Operación y Recursos
4. Impacto y Daño
5. Calidad y Confianza
6. Bitácora

## Mejora principal v2.3

La Vista 1 incorpora:

- rediseño visual institucional;
- Light Mode limpio;
- Dark Mode neutro gris carbón/grafito;
- iconografía SVG profesional;
- filtros de período y territorio;
- breadcrumb territorial;
- sincronización mapa ↔ dashboard;
- drill-down Chile → Región → Provincia → Comuna → Incendio;
- ranking territorial dinámico;
- Leaflet con mapa claro + satélite;
- capas de Prioridad, Incendios, Superficie, Carga y Calidad;
- focos de incendio con llama SVG dimensionada por hectáreas;
- hover con información rápida;
- clic simple para seleccionar;
- doble clic para abrir Bitácora;
- flyTo/flyToBounds en navegación territorial.

## Ejecutar

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```
