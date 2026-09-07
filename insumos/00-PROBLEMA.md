# Problema, reconstruido desde el codigo

Nadie del area usuaria participo. Se razona hacia atras, desde lo construido
hacia el problema que podria haberlo motivado, y cada paso de esa cadena va
marcado.

## Que se deduce que estaba roto

- El repositorio guarda una extraccion completa de una temporada: incendios,
  dano por incendio en detalle y resumido, movimientos y catalogos de recursos
  [data/source_sidco_2025_26/01_incendios_todos_2025_26.csv],
  [data/source_sidco_2025_26/02_dano_por_incendio_detalle.csv],
  [data/source_sidco_2025_26/03_movimientos_completos_2025_26.csv],
  [data/source_sidco_2025_26/04_catalogo_candidatos_tipos_recurso.csv], junto a
  un reporte de esa exportacion
  [data/source_sidco_2025_26/00_reporte_export_final.txt]. Que alguien haya
  tenido que exportar la temporada entera a archivos sugiere que los datos
  vivian en un sistema del que no se podia consultar directamente lo que se
  queria mirar. [INFERIDO]
- Lo construido encima son vistas de lectura: resumen, prioridad territorial,
  operacion y recursos, impacto y dano, calidad, bitacora y exposicion
  [frontend/src/views/Resumen.jsx],
  [frontend/src/views/PrioridadTerritorial.jsx],
  [frontend/src/views/OperacionRecursos.jsx],
  [frontend/src/views/Impacto.jsx], [frontend/src/views/Calidad.jsx],
  [frontend/src/views/Bitacora.jsx], [frontend/src/views/Exposicion.jsx].
  Luego probablemente habia un problema con mirar la temporada de forma
  agregada y por territorio. [INFERIDO]
- Existe una vista dedicada a calidad y confianza de los datos
  [frontend/src/views/Calidad.jsx] y una base de conocimiento escrita sobre
  como se codifica el dano [docs/BASE_CONOCIMIENTO_DANO_SIDCO_V2_6.md]. Luego
  probablemente los propios datos de origen eran discutibles y hubo que
  explicarlos. [INFERIDO]
- El problema de negocio concreto, con quien lo planteo y por que ahora:
  [PENDIENTE]

## Quien sufre el problema

- El codigo no impone ningun rol. La enumeracion de variables de entorno no
  contiene ninguna de credencial de aplicacion: las detectadas son las de
  conexion a la base [backend/src/db/postgres.js:6],
  [backend/src/db/postgres.js:7], el puerto [backend/src/server.js:9], la
  direccion del servicio [frontend/src/data/api.js:2] y la base de rutas
  [frontend/src/App.jsx:69]. Entre las senales de capacidad detectadas solo
  aparece cartografia [frontend/src/components/LazyLocalLayer.jsx:28].
  [INFERIDO]
- Hay una vista descrita como ejecutiva dentro del componente de mapa
  [frontend/src/components/ExecutiveMap.jsx] y un ranking con el mismo
  calificativo [frontend/src/components/TerritorialPriorityView.jsx]. De un
  nombre de componente no se sigue quien es el destinatario. Quien mira este
  tablero: [PENDIENTE]
- Cuantas personas: [PENDIENTE]
- Que unidad es dueno del contenido: [PENDIENTE]

## Como lo resolvian antes

- Los archivos de origen son planillas separadas por comas y volcados en
  formato de intercambio
  [data/source_sidco_2025_26/01_incendios_todos_2025_26.csv],
  [data/source_sidco_2025_26/01_incendios_todos_2025_26.json], acompanados de
  un resumen de la exportacion
  [data/source_sidco_2025_26/00_resumen_export_final.json]. Que exista una
  exportacion manual a planillas sugiere que el analisis previo se hacia sobre
  planillas. [INFERIDO]
- Existen dos programas para bajar capas geograficas oficiales desde servicios
  externos y guardarlas particionadas
  [scripts/descargar_capas_chile.py], [scripts/descargar_capas_oficiales.py], y
  un archivo por lotes que los invoca [descargar_capas.bat]. Que exista una
  descarga scriptada sugiere que antes las capas se buscaban y bajaban a mano.
  [INFERIDO]
- Quien hacia esa exportacion, con que periodicidad y cuanto tardaba:
  [PENDIENTE]

## Volumen

- Indicios, no cifras. Las capas locales se cargan de forma diferida a partir
  de un catalogo [frontend/src/components/LazyLocalLayer.jsx:28],
  [frontend/public/data/capas/manifest.json], y hay una decision escrita sobre
  ese esquema [docs/CAPAS_LOCAL_FIRST_V2_7_3.md]. Que se haya escrito carga
  diferida sugiere que las capas pesan lo suficiente como para no cargarlas
  todas juntas. Es un orden de magnitud, no una cifra. [INFERIDO]
- Los archivos de catalogo del origen se guardaron como muestras y no
  completos
  [data/source_sidco_2025_26/04_muestra_catalogo_recurso.csv],
  [data/source_sidco_2025_26/04_manifest_muestras_catalogo.json]. Que se
  tomaran muestras sugiere que las tablas de origen son grandes. [INFERIDO]
- Cuantos incendios, cuantos movimientos y cuantas temporadas hay que
  sostener: [PENDIENTE]

## Que pasa si no se hace nada

[PENDIENTE], sin excepcion. El codigo no lo responde y no se deduce de que el
sistema exista.

## Quien decide que esta terminado

[PENDIENTE], sin excepcion. Hay un archivo de version [VERSION.md] y una
plantilla de versionado [TEMPLATE_VERSION.md], y cada entrega quedo escrita en
un documento numerado [docs/VISTA_1_V2_3.md], pero ninguno nombra a la persona
o la instancia que acepta el trabajo. [INFERIDO]

## Datos de origen y su tratamiento

- El repositorio contiene una extraccion de un sistema de origen
  [data/source_sidco_2025_26/00_reporte_export_final.txt]. Si esa extraccion
  contiene datos de personas —denunciantes, brigadistas, propietarios— y con
  que autorizacion esta en un repositorio: [VERIFICAR]
- Hay un archivo cuyo nombre lo declara sintetico
  [sidco_sintetico_sur_chile_1mes_yoy.json], copiado tambien dentro del sitio
  publicado [frontend/public/sidco_sintetico_sur_chile_1mes_yoy.json] y leido
  por la interfaz [frontend/src/lib/data.js:6]. Que sea efectivamente
  sintetico es una afirmacion de su nombre, no una comprobacion:
  [VERIFICAR]
