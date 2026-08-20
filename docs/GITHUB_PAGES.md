# Publicación en GitHub Pages

## Requisito

La rama principal debe llamarse:

```text
main
```

## Flujo

Al hacer push a `main`, GitHub Actions:

1. descarga el repositorio;
2. configura Node 22;
3. encuentra `frontend/package-lock.json`;
4. restaura/cachea npm;
5. ejecuta `npm install` dentro de `frontend`;
6. ejecuta `npm run build`;
7. publica `frontend/dist`.

## Importante

En Settings → Pages, seleccionar:

**Source: GitHub Actions**

## Error corregido

La versión anterior podía fallar con:

```text
Some specified paths were not resolved, unable to cache dependencies.
```

porque el workflow intentaba utilizar una ruta de lockfile inexistente.

v2.1 incluye:

```text
frontend/package-lock.json
backend/package-lock.json
```

y el workflow de Pages solo referencia:

```text
frontend/package-lock.json
```
