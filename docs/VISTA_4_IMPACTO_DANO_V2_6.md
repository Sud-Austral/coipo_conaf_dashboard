# Vista 4 · Impacto y Daño · v2.6.0

## Pregunta rectora
¿Qué impacto están generando los incendios, qué componente territorial se está afectando y dónde se concentra el daño?

## Base SIDCO validada
- `public.dano`
- `dano_uso_suelo` 1–10
- `dano_tipo_uso_suelo` 1–3
- `dano_grado` 0/25/50/75/100
- `dano_superficie`

## Diccionario ejecutivo
- códigos 1–5 → Plantaciones
- 6 → Arbolado
- 7 → Matorral
- 8 → Pastizal
- 9 → Agrícola
- 10 → Desechos

Los códigos 1–5 permanecen sin traducción individual. No inventar subtipos.

## Cobertura 2025/26
- incendios: 9.664
- incendios con daño: 5.287
- cobertura: 54,71%
- registros de daño: 18.255
- superficie clasificada en `dano`: 79.596,4893 ha
- incendios >400 ha: 48

## Mapa
Capas UI:
- Claro
- Satélite
- Relieve
- Incendios
- Superficie
- >400 ha
- Zonas urbanas
- Localidades rurales

Las capas urbanas/rurales quedan preparadas para conexión a cartografía oficial INE/IDE Chile. No se dibujan polígonos ficticios.
