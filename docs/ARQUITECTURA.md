# Arquitectura funcional

- Vista 1: Resumen Ejecutivo
- Vista 2: Prioridad Territorial
- Vista 3: Operación y Recursos
- Vista 4: Impacto y Daño
- Vista 5: Calidad y Confianza
- Vista 6: Bitácora

## Mapas
- Leaflet / React Leaflet: Resumen, Prioridad, Impacto, Calidad.
- MapLibre GL JS: Operación y Recursos.
- Feature futura: ubicación individual de helicópteros, vehículos, bases y dotaciones.

## Bitácora
PostgreSQL → Node/Express → hechos validados → motor narrativo por reglas → React → imprimir/PDF.

La narrativa no debe afirmar hechos no presentes en SIDCO.
