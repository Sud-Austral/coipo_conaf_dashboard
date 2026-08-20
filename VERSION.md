# COIPO CONAF Dashboard — v1.1.0

Nueva iteración analítica basada en la estructura SIDCO aprendida y una fuente sintética local para pruebas.

## Fuente
- `frontend/public/sidco_sintetico_sur_chile_1mes_yoy.json`
- Julio 2026 vs julio 2025.
- Biobío, La Araucanía, Los Ríos, Los Lagos y Aysén.
- Datos completamente sintéticos; no representan incendios reales.

## Vistas
1. Situación actual
2. Territorio
3. Respuesta operacional
4. Crecimiento
5. Recursos
6. Daño
7. Ficha de incendio (detalle navegable)

## Principios
- KPI calculados desde la fuente JSON, no escritos a mano.
- Comparación interanual incorporada.
- Arquitectura React + Vite; backend Node/Express y PostgreSQL se mantienen como arquitectura objetivo.
