# v2.7.0 · Vista 6 — Exposición a Zonas Pobladas

## Navegación
- Vista 6: Exposición a Zonas Pobladas
- Vista 7: Calidad y Confianza de Datos

## Vista 6
Mapa con:
- incendio;
- anillos de 1 km, 3 km y 5 km;
- línea a zona poblada más próxima;
- distancia;
- urbano/rural;
- selector de capas estándar;
- bosques/vegetación;
- áreas protegidas;
- otros usos de suelo.

KPI:
- incendios <1 km;
- 1–3 km;
- 3–5 km;
- Índice de Exposición Territorial experimental.

## Regla analítica
La expansión equivalente es geométrica y experimental.
No representa dirección del frente ni pronóstico de propagación.

## Bitácora
El mapa `Contexto urbano/rural` reutiliza el componente de exposición:
anillos + línea de distancia + zona más próxima.

## Capas naturales
La arquitectura queda preparada para servicios oficiales:
- Catastro Vegetacional CONAF / IDE Minagri;
- SNASPE / MMA / IDE Minagri;
- Catastro de uso de la tierra CONAF.

Las geometrías naturales incluidas en esta maqueta son demostrativas y están
identificadas en el código para ser reemplazadas por los servicios oficiales.
