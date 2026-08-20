# Base de conocimiento · Daño SIDCO

## Estado
Validación empírica para uso ejecutivo del Dashboard.

## Mapeo
| Código | Consolidación |
|---:|---|
| 1–5 | Plantaciones |
| 6 | Arbolado |
| 7 | Matorral |
| 8 | Pastizal |
| 9 | Agrícola |
| 10 | Desechos |

La consolidación fue contrastada con publicaciones CONAF cuya fuente declarada es SIDCO. Los subtipos 1–5 no están identificados individualmente.

## Implementación
El diccionario está centralizado en:
`frontend/src/config/danoCatalogo.js`

A futuro, reemplazar el origen estático por catálogo BD/API sin modificar la interfaz consumidora.
