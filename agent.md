# Sistema de Control de Ingreso a Evento — Contexto del Proyecto

## Descripción

PWA offline para control de ingreso y asistencia a un evento con ~250 personas. Funciona **100% sin internet** en tablets/teléfonos provistos por el organizador. 2-3 dispositivos funcionando en paralelo de forma independiente.

---

## Stack tecnológico

- **Vue 3** + **Vite**
- **Vuetify 3** (componentes UI) — `vuetify.js` usa `import "vuetify/styles"` + `createVuetify()`, no tocar
- **vite-plugin-pwa** (Service Worker, offline)
- **Dexie.js** (wrapper IndexedDB, persistencia local)
- **html5-qrcode** (lectura de QR con cámara)
- **fuse.js** (búsqueda fuzzy por nombre)
- Sin vue-router ni Pinia — la app es simple y no los necesita

---

## Estructura del proyecto

```
src/
├── App.vue
├── main.js
├── db.js               # Configuración Dexie (tablas: personas, registros)
├── composables/
│   ├── usePersonas.js  # Carga, búsqueda, indexado en memoria
│   └── useRegistros.js # Registrar ingreso, exportar CSV/JSON
├── views/
│   ├── Scanner.vue     # Vista principal operador
│   └── Admin.vue       # Vista admin (importar lista, exportar, métricas)
└── components/
    ├── QrReader.vue
    ├── BuscadorManual.vue
    ├── ResultadoIngreso.vue
    └── DialogRegistro.vue
```

---

## Modelo de datos

### Tabla `personas` (precargada antes del evento)
```json
{ "rut": "12345678-9", "nombre": "Juan Pérez" }
```

### Tabla `registros` (generada durante el evento)
```json
{
  "id": "uuid-generado",
  "rut": "12345678-9",
  "nombre": "Juan Pérez",
  "timestamp": "2025-06-10T19:32:00.000Z",
  "kit": true,
  "dispositivo": "tablet-01"
}
```

---

## Vistas y flujo

### Scanner.vue (operador)

**Flujo feliz:**
1. Cámara activa escaneando con `html5-qrcode`
2. Al leer QR del carnet chileno → extraer RUT
3. Buscar RUT en Map en memoria → O(1)
4. Mostrar resultado:
   - **Verde** → encontrada, no registrada → nombre + botones de acción
   - **Amarillo** → ya registrada → mostrar hora de registro previo
   - **Rojo** → RUT no está en lista de invitados
5. Si verde: botones `Registrar ingreso` / `Registrar ingreso + Kit`
6. Tras registrar → volver al modo escaneo en 2 segundos

**Flujo alternativo:**
- Campo de búsqueda manual siempre visible debajo del escáner
- Búsqueda en tiempo real por RUT o nombre (fuzzy con fuse.js)
- Al seleccionar persona → mismo flujo de validación y registro

**Principios UI:**
- Pantalla dominada por el visor de cámara
- Resultado verde/rojo/amarillo muy grande y claro
- Máximo 2 botones de acción
- Optimizada para uso rápido bajo presión

---

### Admin.vue (protegida por PIN de 4 dígitos)

Accesible desde botón discreto en vista principal.

1. **Importar lista de personas** — JSON `[{ "rut", "nombre" }]` → reemplaza tabla `personas` + recarga índice
2. **Métricas en tiempo real** — total personas, total ingresos, total kits, últimos 5 ingresos
3. **Exportar registros** — CSV con columnas: RUT, Nombre, Fecha, Hora, Kit (Sí/No), Dispositivo
4. **Resetear datos** (doble confirmación) — borra `registros`, no toca `personas`

---

## Lógica de negocio

- **Una persona solo puede registrarse una vez** por dispositivo. Al escanear RUT ya registrado → advertencia amarilla con hora previa, pero NO bloquear completamente.
- **Lista en memoria** al iniciar: `Map<rut, persona>` para O(1).
- **Campo `dispositivo`** configurable en Admin (ej: "tablet-01"), guardado en localStorage.
- **`extraerRutDesdeQR(texto)`** — parsea string del QR del carnet chileno y retorna RUT normalizado (con guión, sin puntos).
- **Normalización RUT** — manejar con/sin puntos, con/sin guión → siempre `XXXXXXXX-X`.
- **Nombre del CSV exportado** — `registros-tablet-01-2025-06-10.csv`

---

## Configuración PWA

- `vite-plugin-pwa` con estrategia `generateSW`
- Cachear todos los assets estáticos
- Manifest: nombre "Control de Ingreso", display standalone

---

## Notas de implementación

- Si cámara no disponible o permiso denegado → mensaje claro + ir a modo búsqueda manual
- `vuetify.js` no modificar (el linter lo revierte al original)
- CSS reset global en `src/styles/overrides.scss` con `* { margin: 0; padding: 0 }`
- MDI font importado en `main.js` con `import "@mdi/font/css/materialdesignicons.css"`
