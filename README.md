# FW Coipo — Inteligencia de Incendios · Dashboard BI

Nueva maqueta construida **sobre el template React compartido**.

## Arquitectura

- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- Lucide React
- Recharts
- Node.js + Express
- PostgreSQL + `pg`

## Vistas

1. Inteligencia de Incendios
2. Incidencia del Territorio
3. Respuesta
4. Recursos
5. Impacto
6. Evolución

## Datos

La interfaz utiliza datos dummy alineados con los campos y tablas que ya levantamos:
`incendio`, `comuna`, `provincia`, `dano`, `aviso`, `movimiento`, `recurso`, `incendio_evolucion`, `boleta`, `boleta_detalle`, `recurso_empresa`.

El backend Node ya tiene la capa de conexión PostgreSQL preparada.

## Ejecución

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend consume:

`http://localhost:3001/api/dashboard`

Si el backend no está disponible, las vistas utilizan automáticamente el dummy local para permitir revisar la maqueta.

## Importante

Se conserva la identidad visual y estructura del template entregado: colores, Tailwind, cards, navegación, tipografía, Recharts, Lucide, responsive y patrón de layout.

No se copia la lógica del proyecto demo; solamente se reutiliza su estándar técnico/visual.
