# Forestin · SIDCO Dashboard v2.3.1

Versión consolidada con seis vistas:

1. Resumen Ejecutivo
2. Prioridad Territorial
3. Operación y Recursos
4. Impacto y Daño
5. Calidad y Confianza
6. Bitácora

## Mejora principal v2.3

La Vista 1 incorpora:

- rediseño visual institucional;
- Light Mode limpio;
- Dark Mode neutro gris carbón/grafito;
- iconografía SVG profesional;
- filtros de período y territorio;
- breadcrumb territorial;
- sincronización mapa ↔ dashboard;
- drill-down Chile → Región → Provincia → Comuna → Incendio;
- ranking territorial dinámico;
- Leaflet con mapa claro + satélite;
- capas de Prioridad, Incendios, Superficie, Carga y Calidad;
- focos de incendio con llama SVG dimensionada por hectáreas;
- hover con información rápida;
- clic simple para seleccionar;
- doble clic para abrir Bitácora;
- flyTo/flyToBounds en navegación territorial.

## Ejecutar

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```


## v2.3.1
La capa IPT nacional ahora usa polígonos GeoJSON regionales completos. Hover resalta, clic filtra y `flyToBounds()` hace zoom animado al territorio.


## v2.4.0
- Banner institucional transversal.
- Umbral estándar de grandes incendios: >400 ha.
- KPI Vista 1: 48 (>400 ha), -45,45% vs temporada anterior.
- Vista 2 Prioridad Territorial incorporada.


## v2.5.0
- Ruteo corregido: Vistas 1, 2 y 3 completas y accesibles.
- Vista 3 Operación y Recursos implementada.
- Replay operacional jugable con Play/Pausa/Reinicio/slider.
- Replay usa datos demo hasta conectar `movimiento` real.


## v2.5.1
- Vista 2: corrección completa de layout, KPI y gráfico comparativo.
- Vista 3: duraciones entre hitos mostradas en minutos u horas/minutos.


## v2.6.0
- Vista 4 Impacto y Daño implementada con clasificación SIDCO validada.
- Diccionario central `src/config/danoCatalogo.js`.
- Vista 5 Bitácora ampliada con cronología y cuatro mapas para impresión/PDF.
- Vista 6 Calidad y Confianza separada visualmente del flujo principal.
- Navegación principal: Resumen → Prioridad → Operación → Impacto → Bitácora | Datos: Calidad.
- Mantiene umbral >400 ha.


## v2.6.1
- KPI limpios con icono de información transversal.
- Vista 1: Incendios >400 ha = 48.
- Vista 3: lectura operacional con escala tipográfica consistente.
- Vista 4: eliminado bloque de calidad; reemplazado por concentración del impacto.
- Calidad/cobertura técnica concentrada en tooltips y Vista 6.


## v2.6.2
- Bitácora PDF: Historia operacional vertical, sin barra de scroll ni elementos interactivos inútiles en impresión.
- Pantalla mantiene timeline horizontal.


## v2.6.3
- Capas urbano/rural reales conectadas dinámicamente a servicios de origen INE.
- Vista 2 reemplaza fallback visual por Leaflet/GeoJSON real.
- Vista 2 elimina gráfico de burbujas y agrega ranking ejecutivo explicativo.
- Capas censales disponibles en Vista 2, Vista 4 y Bitácora.


## v2.6.4
- Vista 4 sin códigos SIDCO visibles.
- Tooltips KPI controlados por clic y cerrados por defecto.


## v2.6.5
- Filtros Hoy/7 días/30 días/Temporada/Personalizado funcionales.
- Estado vacío demostrativo para períodos sin datos.
- Selector de capas Leaflet estandarizado en mapas.
- Vista 1: leyenda de incendios con llamas crecientes y menos ruido técnico.
- Vista 3: replay con emojis por tipo de recurso.
- Bitácora: limpieza narrativa y selector de capas estandarizado.


## v2.7.0
- Nueva Vista 6: Exposición a Zonas Pobladas.
- Calidad y Confianza pasa a Vista 7.
- Anillos 1/3/5 km y línea a zona poblada próxima.
- Bitácora reutiliza mapa de exposición en Contexto urbano/rural.
- Capas Bosques/vegetación, Áreas protegidas y Otros usos de suelo agregadas a selectores cartográficos.
