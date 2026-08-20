# v2.7.1 · Capas territoriales oficiales reales

## Áreas protegidas
Fuente:
MMA · SIMBIO

Servicio:
`SIMBIO/SIMBIO_AP/FeatureServer/0`

La capa entrega polígonos reales y atributos como nombre y designación.

## Bosques / recursos forestales
Fuente:
IDE Minagri / CONAF

Servicio WMS:
`IDEMINAGRI/RECURSOS_FORESTALES/MapServer/WMSServer`

Se renderiza directamente desde el servicio oficial.

## Otros usos de la tierra
Fuente:
IDE Minagri / CONAF

Servicio WMS:
`USOS_DE_LA_TIERRA__CONAF/MapServer/WMSServer`

## Cambio respecto a v2.7.0
Se eliminan completamente los polígonos rectangulares demostrativos.
Ninguna capa natural dibuja ahora geometrías artificiales.

## Rendimiento
- Áreas protegidas: consulta GeoJSON por viewport.
- Recursos forestales/uso de la tierra: WMS por tiles.
- La cartografía no se almacena dentro del ZIP.

## Consideración operacional
La disponibilidad de las capas depende de la disponibilidad y política CORS
de los servicios oficiales externos. Para producción institucional se recomienda
un proxy/cache cartográfico propio si se requiere alta disponibilidad.
