# PWA Remates — Seguimiento

App móvil de consulta para la planilla de seguimiento de remates judiciales.

## ⚠️ Antes de usar: compartir la planilla

La app lee la planilla por el endpoint público `gviz/tq` de Google Sheets, así que necesita estar accesible:

1. Abre la planilla en Google Sheets.
2. Botón **"Compartir"** (arriba a la derecha).
3. En "Acceso general", selecciona **"Cualquiera con el enlace"** y rol **"Lector"**.
4. Listo. La app ya puede leerla.

> No expone permisos de escritura. Solo lee.

## 📱 Instalar como app

Sube los archivos a cualquier hosting estático (GitHub Pages, Netlify, Cloudflare Pages, Vercel, o tu propio dominio). Luego:

- **Android (Chrome):** abrir la URL → menú ⋮ → "Instalar aplicación".
- **iPhone (Safari):** abrir la URL → botón compartir → "Añadir a pantalla de inicio".

Una vez instalada, abre como app nativa, funciona sin barra del navegador y carga en caché para uso offline (muestra los últimos datos descargados).

## 🗂 Archivos

- `index.html` — la app completa (HTML + CSS + JS)
- `manifest.json` — metadata para que sea instalable
- `service-worker.js` — caché offline
- `icon-192.png`, `icon-512.png` — iconos de la app

## ⚙️ Configurar columnas

Si en algún momento cambia la estructura de la planilla, toca el ícono **⚙** arriba a la derecha y ajusta a qué letra de columna corresponde cada campo.

La configuración por defecto coincide con `SEGUIMIENTO_REMATES_2026-2.xlsx`:

| Letra | Campo |
|---|---|
| A | Fecha remate |
| B | Hora |
| C | Fecha publicación |
| D | Zoom (SI/NO) |
| E | Inmueble |
| F | Ubicación (link Maps) |
| G | Mínimo |
| H | Documentos (link) |
| I | Demandante |
| J | Juicio (rol) |
| K | Tribunal |
| L | Precio compra |
| M | Año compra |
| N | Superficie |
| O | Avalúo fiscal |
| P | Deuda contribuciones |
| Q | Forma consignación |
| R | Observaciones |
| S | Decisión |
| T | Monto adjudicación |
| U | Resultado |
| V | S3 |

## 🔍 Funciones

- **Buscador** por inmueble, rol, tribunal, demandante, observaciones.
- **Chips** rápidos: Próximos / Pasados / Zoom / Decisión SI / Por revisar.
- **Demandantes** y **Tribunales** con contadores dinámicos.
- **Tarjetas ordenadas** por fecha (próximos primero, después los más recientes pasados).
- **Badge** automático: HOY / EN Xd / PASÓ.
- **Detalle** con todos los campos + botones directos a Google Maps y Documentos.
- **Recargar** con el botón ↻ para refrescar desde la planilla.

## 🛠 SHEET_ID actual

Hardcoded en `index.html`:
```
1v4uEP4KTn7Iq7OvqRbrWtHr4BwgS-j3s
```

Si quieres cambiar a otra planilla en el futuro, edita esa constante en `index.html`.
