# v2.6.3 · Capas urbano/rural reales

## Implementación
Las capas ya no son placeholders.

### Zonas urbanas
Servicio ArcGIS FeatureServer con Límite Urbano Censal INE.

### Contexto rural
Servicio ArcGIS FeatureServer de entidades/manzanas-entidades con fuente INE.

## Estrategia de rendimiento
No se descarga Chile completo al navegador.

Se consulta el viewport visible:
- urbano desde zoom 7;
- rural desde zoom 9.

Esto reduce geometrías y permite funcionar correctamente en GitHub Pages.

## Uso
Las capas se integran en:
- Vista 2 · Prioridad Territorial
- Vista 4 · Impacto y Daño
- Vista 5 · mapa urbano/rural de Bitácora

## Importante
La atribución del proveedor cartográfico se mantiene, pero se presenta discretamente.
