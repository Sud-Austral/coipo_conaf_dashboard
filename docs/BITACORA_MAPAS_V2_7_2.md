# v2.7.2 · Ajustes cartográficos Bitácora / Exposición

## Incendio
La llama ya no usa una etiqueta permanente `Incendio`.
El foco se identifica visualmente sólo con 🔥.

## Recursos
Los recursos del mapa de Bitácora se distribuyen alrededor del foco:
- 🚁 helicóptero
- 🚙 brigada
- 🛻 recurso terrestre
- ✈️ avión
- 👥 personal

Se conectan visualmente al incendio mediante líneas discretas.
Esto representa `recursos asignados al evento`, no posición GPS exacta.

En el replay operacional, cuando varios recursos están en operación,
se aplica un pequeño desplazamiento radial para evitar solapamiento.

## Anillos de exposición
- 1 km: rojo
- 3 km: naranjo
- 5 km: amarillo

La línea hacia la zona poblada más próxima usa el mismo color
según la banda de distancia.

Los anillos se reutilizan en Vista 6 y en Bitácora · Contexto urbano/rural.
