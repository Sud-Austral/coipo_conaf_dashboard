# Estándar base de proyectos web

Este proyecto demo es una plantilla de referencia visual, estructural y técnica.

## 1. Stack

- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- Lucide React para iconografía
- Recharts para gráficos
- Node.js 22 en CI/CD

## 2. Despliegue

- GitHub Pages mediante GitHub Actions.
- `vite.config.js` utiliza `base: './'`.
- El artefacto publicado es `frontend/dist`.
- No usar rutas absolutas para assets estáticos.
- El workflow instala dependencias con `npm ci` y construye con `npm run build`.

## 3. Estructura

```text
/
├── .github/workflows/deploy.yml
├── README.md
├── ESTANDAR_UI_Y_ARQUITECTURA.md
└── frontend/
    ├── index.html
    ├── favicon.svg
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── ejecutar.bat
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        ├── context/
        ├── fixtures/
        ├── lib/
        └── pages/
```

## 4. Sistema visual

### Colores principales

- Verde 50: `#eef7f0`
- Verde 100: `#d5ebda`
- Verde 200: `#aed7b8`
- Verde 300: `#7fbc90`
- Verde 400: `#4f9d67`
- Verde 500: `#2f7d4a`
- Verde 600: `#1f6b3b`
- Verde 700: `#185530`
- Verde 800: `#134326`
- Verde 900: `#0d2f1b`

### Colores neutros

- Arena 50: `#faf8f4`
- Arena 100: `#f2ede3`
- Arena 200: `#e4dac6`

### Tipografía

Familia principal:

`Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`

Se utiliza tipografía sans-serif, limpia, corporativa y orientada a aplicaciones de gestión.

### Bordes y superficies

- Cards: `rounded-2xl`
- Controles: `rounded-xl`
- Badges: `rounded-full`
- Bordes: tonos `slate` y `arena`
- Fondo general: `arena-50`
- Superficies: blanco
- Sombras: `shadow-sm`

### Cabecera

- Fondo: verde 700
- Texto: blanco
- Segunda línea de navegación con borde superior verde 600
- Navegación horizontal desplazable en pantallas pequeñas
- Selector de rol en la esquina superior derecha

### Layout

- Ancho máximo: `max-w-7xl`
- Padding principal: `px-4 py-6`
- Footer discreto con información contextual
- Diseño responsive con grids `sm`, `md` y `lg`

### Iconografía

Se utiliza **Lucide React**. No se recomienda introducir otra librería de iconos sin una razón concreta.

## 5. Patrones de interfaz

La plantilla incorpora como referencia:

1. Dashboard con KPIs.
2. Gráfico de distribución.
3. Tabla operativa.
4. Badges de estado.
5. Badges de prioridad.
6. Workflow visual.
7. Histórico.
8. Formulario de alta.
9. Vista por rol.
10. Navegación lateral/superior basada en `NavLink`.
11. Footer estándar.
12. Estados ficticios reutilizables.

## 6. Estados estándar

- Pendiente
- En proceso
- Bloqueado
- En revisión
- Aprobado / Conforme
- Archivado / Cerrado
- Anulado

## 7. Prioridades estándar

- Normal
- Media
- Urgente

## 8. Imágenes y recursos

La referencia actual utiliza un enfoque deliberadamente liviano:

- No depende de fotografías externas.
- El favicon es SVG.
- Los iconos funcionales provienen de Lucide React.
- Los gráficos son generados por Recharts.

Si un nuevo proyecto requiere imágenes, deben agregarse bajo `frontend/public/` o mediante imports controlados, manteniendo rutas compatibles con `base: './'`.

## 9. Regla para futuros proyectos

Cuando se cree un nuevo proyecto, se debe conservar:

- Stack técnico salvo necesidad justificada.
- `base: './'`.
- Workflow de GitHub Pages.
- Estructura de carpetas.
- Sistema de colores.
- Tipografía.
- Escala de bordes.
- Tratamiento de cards, tablas y formularios.
- Iconografía Lucide.
- Patrón de navegación.
- Responsive design.
- Foco accesible.
- Estilo de estados y prioridades.

Lo que cambia de proyecto a proyecto:

- Nombre visible.
- Logo/favicon específico.
- Dominios funcionales.
- Entidades y datos.
- Páginas.
- Reglas de negocio.
- Textos.
- Flujos.
- Componentes específicos.

## 10. Principio

**La plantilla define la identidad visual y la base técnica. El proyecto nuevo define la funcionalidad.**

No se debe copiar la lógica de negocio de este demo como si fuera parte del estándar.


## 11. Regla de despliegue Vite + GitHub Pages

La configuración oficial del template utiliza una base dinámica para que el mismo proyecto pueda copiarse a cualquier repositorio sin modificar manualmente Vite.

En local:

```text
base: ./
```

En GitHub Pages, el workflow define automáticamente:

```text
VITE_BASE=/<nombre-del-repositorio>/
```

Por lo tanto, **no se debe hardcodear el nombre del repositorio en `vite.config.js`**.

También se deben mantener las rutas relativas en `index.html`, por ejemplo:

```html
<script type="module" src="./src/main.jsx"></script>
```

El workflow debe ejecutar:

```text
npm ci
npm run build
```

y publicar:

```text
frontend/dist
```

### Objetivo

El template debe poder copiarse a un nuevo repositorio y funcionar en GitHub Pages sin volver a configurar manualmente las rutas de Vite.
