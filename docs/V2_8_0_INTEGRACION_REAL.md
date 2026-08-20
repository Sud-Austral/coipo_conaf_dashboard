# v2.8.0 · Integración real SIDCO

Periodo: 2025-07-01 a 2026-07-01 (fin exclusivo).

## Universo integrado

- Incendios: 9664
- Coordenadas válidas: 7344
- Registros de daño: 18255
- Incendios con daño: 5287
- Movimientos asociados a incendio: 62908
- Recursos distintos: 1751
- Bases agrupadas: 352

## Datos calculados

IPT e Índice de Exposición son indicadores experimentales construidos sobre
variables reales. No son campos nativos de SIDCO.

## Replay

La animación usa tiempos reales. Base → Incendio es una interpolación entre
puntos conocidos cuando existe `recu_lat_base/recu_lon_base` y coordenada del
incendio. No corresponde a una traza GPS histórica.

## Capas cartográficas

Ejecutar `descargar_capas.bat`.

El descargador crea un `manifest.json` y archivos GeoJSON particionados.
El frontend usa lazy loading según el viewport actual. Una capa no disponible
se informa explícitamente en el mapa.
