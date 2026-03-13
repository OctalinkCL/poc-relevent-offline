# poc-relevent-offline

POC de sistema de control de acceso offline para eventos presenciales.
Permite registrar ingresos escaneando QR o buscando manualmente en lista.

## Stack
- **Vue 3** Composition API (`<script setup>`)
- **Vuetify 4** — tema deep-orange, MDI icons
- **Dexie** — IndexedDB wrapper (base de datos local offline)
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

## Estructura src/
```
views/
  HomeView.vue      # Vista principal: tabs pendientes/ingresados + QR FAB
  AdminView.vue     # Vista admin: inicializar BD, descargar CSV, resetear BD (sin auth)

components/
  EscanerQR.vue         # Wrapper de QrcodeStream — emite @scanned con rawValue
  TablaPendientes.vue   # Tabla buscable de personas pendientes — emite @select
  TablaIngresados.vue   # Tabla de personas ya ingresadas con timestamp/kit
  DialogIngreso.vue     # Diálogo de confirmación de ingreso (con/sin kit)
  InicializarBD.vue     # Carga personas desde src/data/personas-ejemplo.json → IndexedDB
  DescargarCSV.vue      # Exporta registros como CSV

db.js             # Schema Dexie (v2)
router/index.js   # Rutas: / → HomeView, /admin → AdminView
data/personas-ejemplo.json  # Dataset de ejemplo para inicializar
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
4. FAB abre diálogo con `EscanerQR`
5. `onQrScanned`: extrae RUT del QR (busca param `RUN` en URL, fallback al valor raw) → abre `DialogIngreso`
6. `onIngresado`: recarga registros tras confirmar ingreso

### Registro de ingreso (DialogIngreso)
- Inserta en `db.registros` con `dispositivo: 'manual'` y flag `kit: boolean`
- Dos botones: "Con kit" / "Sin kit"

### Admin (AdminView — sin autenticación)
- `InicializarBD`: hace `bulkPut` de personas-ejemplo.json en IndexedDB
- `DescargarCSV`: exporta registros
- Botón resetear: limpia `db.registros` y `db.personas` → recarga página

## Notas de plataforma
- **iOS standalone**: `App.vue` detecta iOS + modo PWA standalone → muestra app bar compacto adicional para compensar el notch/safe-area
- **QR**: cámara trasera (`facingMode: 'environment'`), altura fija 300px en el dialog
- **Datos de personas**: se cargan manualmente desde Admin con el botón "Inicializar BD"
