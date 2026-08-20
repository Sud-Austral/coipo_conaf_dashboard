# v2.8.5 · Mapa nacional y replay

## Mapa de situación

### Chile
Una sola llama por región.
- tamaño: cantidad de incendios;
- badge: cantidad;
- clic: drill-down a región.

Esto evita crear miles de objetos Leaflet al abrir la vista nacional.

### Región / provincia / comuna
Se dibujan los incendios individuales pertenecientes al territorio filtrado.
El tamaño individual vuelve a representar superficie registrada.

## Replay

Secuencia visual:

1. Vista inicial amplia: incendio + todas las bases de recursos participantes.
2. Play: cámara se acerca al incendio.
3. Llegada: recursos avanzan desde bases conocidas hacia el incendio usando hitos temporales reales.
4. Operación: cámara mantiene el incendio como protagonista.
5. Retiro: al alcanzar el último tiempo real comienza un cierre visual.
6. Cierre: recursos regresan gráficamente hacia sus bases y la cámara recupera el encuadre inicial.

La interpolación espacial no representa tracking GPS histórico.
