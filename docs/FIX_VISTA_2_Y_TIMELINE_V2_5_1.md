# v2.5.1 · Corrección Vista 2 + Historia Operacional

## Vista 2
Se reconstruyó la composición para evitar KPI fuera de contenedor y gráficos invisibles.

Cambios:
- Grid de KPI estable y responsivo.
- Variables CSS corregidas a `--panel` y `--line`.
- Ranking territorial con layout fijo.
- Panel “Por qué está arriba” estable.
- Gráfico de burbujas reimplementado como SVG real y responsivo.
- Ejes y grilla visibles.
- Click sobre burbuja actualiza el territorio seleccionado.
- Ordenamiento IPT / Incendios / Superficie / Variación.

## Vista 3
La línea “Historia Operacional” ahora muestra:
- hito;
- hora del hito;
- duración de cada tramo centrada bajo el segmento.

Regla de formato:
- <60 min → `38 min`;
- >=60 min → `2 h 21 min`.

La duración se calcula dinámicamente desde los tiempos del replay.
