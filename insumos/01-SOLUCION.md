# Solucion, leida del codigo

El codigo es la solucion. Lo que sigue describe capacidades con la cita del
lugar donde estan implementadas. Hay una salvedad importante al final: en este
repositorio el analizador no logro enumerar las rutas del servicio, asi que la
mitad del sistema queda descrita con menos apoyo del deseable.

## Que hace el sistema

Permite mirar una temporada de incendios desde varios angulos: un resumen
general [frontend/src/views/Resumen.jsx], una priorizacion por territorio
[frontend/src/views/PrioridadTerritorial.jsx], la operacion y el uso de
recursos [frontend/src/views/OperacionRecursos.jsx], el impacto y el dano
[frontend/src/views/Impacto.jsx], una revision de la calidad de los datos
[frontend/src/views/Calidad.jsx], la exposicion de poblacion
[frontend/src/views/Exposicion.jsx] y una bitacora
[frontend/src/views/Bitacora.jsx]. Permite ademas abrir la ficha de un
incendio concreto [frontend/src/pages/FichaIncendio.jsx] y recorrer el
territorio bajando de nivel desde el mapa
[frontend/src/components/ExecutiveMap.jsx]. [INFERIDO]

Sobre el mapa permite superponer capas: los focos y su dano
[frontend/src/components/DamageImpactMap.jsx], las bases de recursos
[frontend/src/components/ResourceBasesLayer.jsx], contexto censal
[frontend/src/components/CensusContextLayers.jsx], contexto ambiental
[frontend/src/components/EnvironmentalContextLayers.jsx], exposicion de
poblacion [frontend/src/components/PopulationExposureMap.jsx] y una
reproduccion en el tiempo de la operacion
[frontend/src/components/OperationalReplayMap.jsx]. Cada indicador puede
explicarse en pantalla [frontend/src/components/KpiInfo.jsx],
[frontend/src/components/InfoPopover.jsx]. [INFERIDO]

## Roles: quien ve que

- No hay roles en el codigo. La enumeracion completa de variables de entorno
  no contiene ninguna de credencial ni de secreto de sesion: solo conexion a
  base [backend/src/db/postgres.js:6], [backend/src/db/postgres.js:7], puerto
  [backend/src/server.js:9], direccion del servicio
  [frontend/src/data/api.js:2] y base de rutas [frontend/src/App.jsx:69].
  [INFERIDO]
- Existe una parte publicable como sitio estatico
  [.github/workflows/deploy-pages.yml], [CONFIG_GITHUB_PAGES.md], lo que
  implica que en ese modo cualquiera con el enlace ve el contenido. Si eso es
  lo querido: [PENDIENTE]

## De donde salen los datos

- Una extraccion en archivos del sistema de origen de la temporada
  [data/source_sidco_2025_26/01_incendios_todos_2025_26.csv],
  [data/source_sidco_2025_26/02_dano_por_incendio_resumen.csv],
  [data/source_sidco_2025_26/03_movimientos_completos_2025_26.csv],
  [data/source_sidco_2025_26/05_bases_recursos_agrupadas.geojson], con su
  reporte de exportacion
  [data/source_sidco_2025_26/00_reporte_export_final.txt]. Quien es dueno de
  ese sistema de origen: [PENDIENTE] [INFERIDO]
- Capas geograficas descargadas de servicios externos por dos programas
  [scripts/descargar_capas_chile.py], [scripts/descargar_capas_oficiales.py], y
  publicadas localmente a traves de un catalogo
  [frontend/public/data/capas/manifest.json], que la interfaz lee antes de
  pedir cada capa [frontend/src/components/LazyLocalLayer.jsx:28],
  [frontend/src/components/LazyLocalLayer.jsx:48]. Quien es dueno de esas
  capas: [PENDIENTE] [INFERIDO]
- Una base de datos relacional, con la conexion configurada por variables de
  entorno [backend/src/db/postgres.js:6], [backend/src/db/postgres.js:7], que
  el servicio consulta para la bitacora
  [backend/src/services/bitacoraService.js]. Que tablas usa: [PENDIENTE]
- Un archivo declarado sintetico que la interfaz carga directamente
  [frontend/src/lib/data.js:6],
  [frontend/public/sidco_sintetico_sur_chile_1mes_yoy.json]. [INFERIDO]
- Conjuntos de datos escritos como codigo dentro de la interfaz, unos marcados
  como reales [frontend/src/data/damageByRegion.real.js],
  [frontend/src/data/exposure.real.js],
  [frontend/src/data/operationalFireLifecycle.real.js],
  [frontend/src/data/resourceBases.real.js],
  [frontend/src/data/seasonTrend.real.js], otros marcados como extendidos
  [frontend/src/data/operationalFireLifecycle.extended.js],
  [frontend/src/data/operationalReplay.extended.js] y uno como relleno
  [frontend/src/data/dummy.js]. Que parte del tablero muestra dato real y que
  parte no, en cada momento: [PENDIENTE] [INFERIDO]
- La geometria de las regiones se resuelve contra una direccion y una tabla de
  equivalencias de nombres [frontend/src/data/regionGeoJson.js]. [INFERIDO]

## Reglas que el sistema impone por si mismo

- La codificacion del dano —uso de suelo, agrupaciones y grado— esta escrita
  en un catalogo unico [frontend/src/config/danoCatalogo.js], respaldado por un
  documento [docs/BASE_CONOCIMIENTO_DANO_SIDCO_V2_6.md]. Quien valido esa
  codificacion: [PENDIENTE]
- Hay un limite de error que evita que una falla de una vista derribe la
  aplicacion entera [frontend/src/components/AppErrorBoundary.jsx].
  [INFERIDO]
- Existe un estandar propio de interfaz y arquitectura escrito
  [ESTANDAR_UI_Y_ARQUITECTURA.md]. Su contenido no fue extraido:
  [PENDIENTE]

## Que NO hace

Solo ausencias que el analizador enumero de forma exhaustiva.

- No hay ninguna llamada de red desde la interfaz que no sea a un archivo
  local: las tres detectadas son al catalogo de capas
  [frontend/src/components/LazyLocalLayer.jsx:28], a cada capa del catalogo
  [frontend/src/components/LazyLocalLayer.jsx:48] y al archivo sintetico
  [frontend/src/lib/data.js:6]. La interfaz declara ademas una direccion de
  servicio [frontend/src/data/api.js:2], pero el analizador no detecto que se
  use. Si el tablero consulta o no el servicio propio hoy: [PENDIENTE]
  [INFERIDO]
- No hay tablas declaradas en el repositorio: el analizador no detecto ninguna
  definicion de esquema, aunque el servicio se conecta a una base
  [backend/src/db/postgres.js:7]. Es decir, la base existe fuera de este
  repositorio. [INFERIDO]

## Iteraciones

- El repositorio documenta su propia evolucion en documentos numerados por
  version: la primera vista [docs/VISTA_1_V2_3.md] y su ajuste de poligonos
  [docs/VISTA_1_V2_3_1_POLIGONOS.md], la prioridad territorial
  [docs/VISTA_2_PRIORIDAD_TERRITORIAL_V2_4.md] y su rediseno
  [docs/VISTA_2_REDISENO_V2_6_3.md], operacion y recursos
  [docs/VISTA_3_OPERACION_RECURSOS_V2_5.md], impacto y dano
  [docs/VISTA_4_IMPACTO_DANO_V2_6.md], exposicion
  [docs/VISTA_6_EXPOSICION_V2_7_0.md], las capas oficiales
  [docs/CAPAS_OFICIALES_REALES_V2_7_1.md], las bases de recursos
  [docs/BASES_RECURSOS_V2_7_4.md], la integracion real
  [docs/V2_8_0_INTEGRACION_REAL.md] y la reproduccion en el mapa
  [docs/V2_8_5_MAPA_REPLAY.md]. Ese orden es el orden en que crecio el
  tablero. [INFERIDO]
- Conviven dos generaciones de pantallas: una carpeta de paginas
  [frontend/src/pages/Situacion.jsx], [frontend/src/pages/Territorio.jsx] y
  otra de vistas [frontend/src/views/Resumen.jsx],
  [frontend/src/views/Prioridad.jsx], con nombres que se solapan
  [frontend/src/pages/Impacto.jsx], [frontend/src/views/Impacto.jsx]. Cual esta
  vigente: [PENDIENTE] [INFERIDO]
- Hay dos formas de publicar: una hacia paginas estaticas
  [.github/workflows/deploy-pages.yml] y otra distinta
  [.github/workflows/deploy.yml]. [INFERIDO]

## Donde el analizador no ve

Esta es la parte mas importante de este documento.

- El analizador no enumero ninguna ruta del servicio. Existen dos archivos de
  rutas [backend/src/routes/dashboard.js], [backend/src/routes/bitacora.js] y
  su punto de entrada [backend/src/server.js], pero que operaciones exponen no
  esta en la evidencia: [PENDIENTE]
- Tampoco se leyo que consultas hace el servicio contra la base
  [backend/src/services/bitacoraService.js],
  [backend/src/data/dashboard.js]. [PENDIENTE]
- La interfaz no declara rutas de navegacion detectables; la descripcion se
  armo desde los componentes [frontend/src/App.jsx]. Como se llega a cada
  pantalla: [PENDIENTE]
- El contenido de los documentos de version no fue extraido: se cita su
  existencia y su titulo, no lo que dicen [docs/MEJORAS_TRANSVERSALES_V2_6_5.md].
