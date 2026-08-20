# v2.7.3 · Capas naturales local-first

## Cambio de estrategia
Las capas naturales dejan de depender de WMS en tiempo de navegación.

El frontend busca primero archivos dentro de:

`frontend/public/data/capas/`

## Descarga
Ejecutar una vez:

Windows:
`descargar_capas.bat`

o:

`python scripts/descargar_capas_oficiales.py`

El script descarga y simplifica para web:

### Áreas protegidas
- Fuente: MMA / SIMBIO
- FeatureServer: `SIMBIO_AP/FeatureServer/0`
- Salida: `areas_protegidas.geojson`

### Bosques / vegetación natural
- Fuente: IDE Minagri · `RECURSOS_FORESTALES_DESCARGA`
- Cobertura inicial del cache:
  - Maule
  - Biobío
  - La Araucanía
- Salida combinada: `bosques.geojson`

### Otros usos de suelo
Permanece conscientemente `No disponible` hasta contar con una fuente
vectorial local validada. No se usa un WMS silencioso como fallback.

## Manifiesto
`frontend/public/data/capas/manifest.json`

Cada capa indica:
- available true/false;
- archivo;
- fuente;
- cobertura;
- cantidad de geometrías cuando se descarga.

## UX
Cuando el usuario activa una capa sin archivo disponible, el mapa muestra:

`<Nombre de capa>: No disponible`

Así nunca queda un checkbox marcado sin explicación.

## GitHub Pages
Una vez descargados los GeoJSON antes del build, pasan a formar parte de
`public/` y GitHub Pages los sirve como archivos estáticos del proyecto.
