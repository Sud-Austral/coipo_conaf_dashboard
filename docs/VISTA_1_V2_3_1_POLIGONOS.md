# Vista 1 · v2.3.1 · IPT por límites regionales

## Cambio principal

La prioridad territorial nacional deja de representarse mediante círculos y se dibuja sobre el polígono completo de cada región.

## Interacción

- Hover: aumenta borde y relleno; muestra nombre, IPT, incendios y superficie.
- Clic: filtra la región.
- Zoom: `flyToBounds()` animado a los límites del polígono.
- Llama: sigue representando incendios individuales.
- Tamaño de llama: superficie registrada.
- Doble clic en llama: abre Bitácora.

## Escala IPT

- 0–39: baja.
- 40–59: media.
- 60–79: alta.
- 80–100: muy alta.

## Fuente cartográfica

La maqueta carga un GeoJSON de regiones chilenas desde una fuente cartográfica pública externa en el navegador. Si no está disponible, conserva un modo de respaldo.
