# Arquitectura funcional · v2.1

## Vistas

1. Resumen Ejecutivo
2. Prioridad Territorial
3. Operación y Recursos
4. Impacto y Daño
5. Calidad y Confianza
6. Bitácora

## Mapas

- Leaflet / React Leaflet:
  - Resumen
  - Prioridad
  - Impacto
  - Calidad
- MapLibre GL JS:
  - Operación y Recursos

### Feature futura de Vista 3

Ubicación individual de:

- helicópteros;
- vehículos;
- bases;
- dotaciones;

solo después de validar cobertura y semántica de coordenadas, estados y catálogos de recursos.

## Bitácora

Primera versión sin Python ni IA generativa libre.

Flujo:

```text
PostgreSQL
→ Node/Express
→ hechos validados
→ motor narrativo por reglas
→ React
→ impresión / PDF
```

La narrativa no debe afirmar hechos no sustentados por SIDCO.

## GitHub Pages

GitHub Pages despliega únicamente el frontend.

El backend debe ejecutarse en un servicio separado/local y no forma parte del build de Pages.
