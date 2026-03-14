# poc-relevent-offline

POC de sistema de control de acceso offline para eventos presenciales.
Permite registrar ingresos escaneando QR o buscando manualmente en lista.

## Stack
- **Vue 3** Composition API (`<script setup>`)
- **Vuetify 4** — tema deep-orange, MDI icons
- **Dexie** — IndexedDB wrapper (base de datos local offline)
- **Firebase** — Realtime Database (sincronización en tiempo real) + Storage (lista de personas)
- **vue-qrcode-reader** — escaneo QR via cámara
- **vite-plugin-pwa** — PWA con workbox (soporte offline)
- **Pinia** — disponible pero no usado aún
- **pnpm** — gestor de paquetes

## Comandos
```bash
pnpm dev        # desarrollo
pnpm build      # build producción
pnpm lint       # lint (oxlint + eslint)
```

## Variables de entorno (`.env`)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_DATABASE_URL
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## Estructura src/
```
views/
  HomeView.vue      # Vista principal: tabs pendientes/ingresados, selección manual → DialogIngreso
  ScannerView.vue   # Vista de escaneo QR permanente con confirmación inline (sin dialog)
  MonitorView.vue   # Vista en tiempo real vía Firebase Realtime Database
  AdminView.vue     # Vista admin: inicializar BD, sincronizar personas, descargar CSV, resetear BD

components/
  EscanerQR.vue           # Wrapper de QrcodeStream — emite @scanned con rawValue
  TablaPendientes.vue     # Tabla buscable de personas pendientes — emite @select
  TablaIngresados.vue     # Tabla de personas ya ingresadas con timestamp/kit
  DialogIngreso.vue       # Diálogo de confirmación de ingreso (con/sin kit)
  InicializarBD.vue       # Carga personas desde src/data/personas-ejemplo.json → IndexedDB
  SincronizarPersonas.vue # Subir lista JSON a Firebase Storage / sincronizar a IndexedDB
  DescargarCSV.vue        # Exporta registros como CSV

composables/
  useRegistro.js    # Lógica de registro: escribe en IndexedDB + push a Firebase Realtime DB

firebase.js         # Inicialización Firebase (database + storage)
db.js               # Schema Dexie (v2)
router/index.js     # Rutas: / → HomeView, /scanner, /monitor, /admin
data/personas-ejemplo.json  # Dataset de ejemplo (fallback offline)
```

## Base de datos (Dexie — "control-ingreso")
```
personas:  rut (PK), nombre
registros: ++id, rut, timestamp, dispositivo, kit
```

## Lógica clave

### Flujo principal (HomeView)
1. `onMounted` carga `personas` y `registros` desde IndexedDB
2. `pendientes` computed = personas sin registro
3. `ingresados` computed = personas con registro (enriquecidas con datos del registro)
4. Selección manual en `TablaPendientes` → abre `DialogIngreso`
5. `onIngresado`: recarga registros tras confirmar ingreso

### Vista de escaneo (ScannerView)
- Cámara QR permanente (sin FAB, sin dialog)
- `onQrScanned`: extrae RUT del QR (busca param `RUN` en URL, fallback al valor raw)
- Panel inline: muestra nombre/RUT encontrado con botones "Con kit" / "Sin kit", o alerta de no encontrado
- Usa `useRegistro` con `dispositivo: 'scanner'`

### Registro de ingreso (useRegistro composable)
- Escribe el registro en `db.registros` (IndexedDB)
- Hace `push` a `firebase/registros` (Realtime Database) — falla silenciosa si offline
- Campos: `rut`, `nombre`, `timestamp`, `dispositivo`, `kit`

### Monitor en tiempo real (MonitorView)
- Se suscribe a `firebase/registros` con `onValue` (Firebase Realtime Database)
- Muestra tabla ordenada por timestamp desc con nombre, RUT, hora y kit
- Indica estado online/offline

### Sincronización de personas (SincronizarPersonas)
- **Subir lista**: carga un JSON local y lo sube a Firebase Storage (`personas/lista.json`)
- **Sincronizar en dispositivo**: descarga el JSON de Storage con `getBytes` → `db.personas.bulkPut`
- Fallback offline: si falla la descarga y hay personas locales, las mantiene; si no, carga `personas-ejemplo.json`

### Admin (AdminView — sin autenticación)
- `InicializarBD`: hace `bulkPut` de personas-ejemplo.json en IndexedDB
- `DescargarCSV`: exporta registros
- Botón resetear: limpia `db.registros` y `db.personas` → recarga página
- Muestra versión de la app (`v1.0.1`)

## Notas de plataforma
- **iOS standalone**: `App.vue` detecta iOS + modo PWA standalone → muestra app bar compacto adicional para compensar el notch/safe-area
- **QR**: cámara trasera (`facingMode: 'environment'`), altura fija 45vh en ScannerView
- **Datos de personas**: se sincronizan desde Firebase Storage vía `SincronizarPersonas`, con fallback a lista local
