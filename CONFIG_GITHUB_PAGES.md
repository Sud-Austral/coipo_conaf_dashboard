# Configuración GitHub Pages — estándar

## Vite

```js
base: process.env.VITE_BASE || './'
```

## Local

El proyecto funciona con rutas relativas:

```text
./
```

## GitHub Pages

GitHub Actions define automáticamente:

```text
VITE_BASE=/<nombre-del-repositorio>/
```

No se debe escribir manualmente el nombre del repositorio en Vite.

## index.html

Los entrypoints deben ser relativos:

```html
<script type="module" src="./src/main.jsx"></script>
```

## Workflow

El build debe:

1. Instalar dependencias con `npm ci`.
2. Definir `VITE_BASE`.
3. Ejecutar `npm run build`.
4. Publicar `frontend/dist`.

## Resultado

El template puede copiarse a cualquier repositorio GitHub Pages sin volver a resolver manualmente los 404 de los bundles JS/CSS provocados por rutas de Vite.
