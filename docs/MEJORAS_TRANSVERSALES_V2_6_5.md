# v2.6.5 · Mejoras transversales

## Filtros de período
Quedan habilitados:
- Hoy
- 7 días
- 30 días
- Temporada 2025/26
- Personalizado

Temporada conserva los datos demostrativos actuales.
Los demás períodos muestran un estado vacío deliberado:
- estructura visible;
- cartografía visible;
- KPI sin valor;
- incendios/series ocultos;
- aviso `Sin información para el período seleccionado`.

Personalizado abre selector Desde/Hasta con Aplicar y Limpiar.

## Estandarización de mapas
Todos los mapas principales utilizan selector Leaflet arriba a la derecha.

Mapa base:
- Claro
- Satélite
- Relieve

Capas disponibles según vista:
- Incendios
- IPT / Impacto
- Recursos
- Zonas urbanas
- Localidades rurales

## Vista 1
Se eliminan textos técnicos alrededor del mapa.
Se mantiene:
- IPT colorea el territorio completo
- leyenda por superficie con llamas crecientes:
  <10 ha / 10–400 / 400–1.000 / >1.000 ha

## Vista 3
Replay:
- 🚁 Helicóptero
- 🚙 Brigada
- 🛻 Recurso terrestre
- ✈️ Avión cuando corresponda
- 👥 Personal cuando corresponda

## Bitácora
Se elimina la frase:
`La reconstrucción narrativa utiliza únicamente hechos disponibles en SIDCO.`

Los mapas de Bitácora usan el mismo patrón de selector de capas en pantalla y lo ocultan al imprimir.
