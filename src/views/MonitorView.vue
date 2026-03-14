<template>
  <!-- KPI + controles -->
  <div class="d-flex justify-center align-center py-3 bg-grey-lighten-3 gap-3 flex-wrap">
    <v-chip color="deep-orange-darken-3" variant="flat" size="large">
      <strong>{{ registros.length }} ingresados</strong>
    </v-chip>
    <v-chip :color="online ? 'success' : 'error'" variant="tonal" size="small">
      <v-icon start :icon="online ? 'mdi-wifi' : 'mdi-wifi-off'" />
      {{ online ? 'En línea' : 'Sin conexión' }}
    </v-chip>
    <v-btn
      size="small"
      variant="tonal"
      prepend-icon="mdi-refresh"
      :loading="cargando"
      @click="cargar"
    >
      Actualizar
    </v-btn>
    <span v-if="ultimaActualizacion" class="text-caption text-grey">
      {{ ultimaActualizacion }}
    </span>
  </div>

  <!-- Tabla -->
  <v-table density="compact">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>RUT</th>
        <th>Hora</th>
        <th>Kit</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="cargando && registros.length === 0">
        <td colspan="4" class="text-center py-6">
          <v-progress-circular indeterminate size="24" />
        </td>
      </tr>
      <tr v-else-if="registros.length === 0">
        <td colspan="4" class="text-center text-grey py-6">Sin registros aún</td>
      </tr>
      <tr v-for="r in registros" :key="r.id">
        <td>{{ r.nombre }}</td>
        <td>{{ r.rut }}</td>
        <td>{{ formatHora(r.timestamp) }}</td>
        <td>
          <v-icon :color="r.kit ? 'success' : 'grey'" :icon="r.kit ? 'mdi-check-circle' : 'mdi-minus-circle'" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { database } from '@/firebase.js'
import { ref as dbRef, get } from 'firebase/database'

const registros = ref([])
const online = ref(navigator.onLine)
const cargando = ref(false)
const ultimaActualizacion = ref('')

onMounted(() => {
  window.addEventListener('online', () => { online.value = true })
  window.addEventListener('offline', () => { online.value = false })
  cargar()
})

async function cargar() {
  cargando.value = true
  try {
    const snap = await get(dbRef(database, 'registros'))
    const data = snap.val() ?? {}
    registros.value = Object.entries(data)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.timestamp - a.timestamp)
    ultimaActualizacion.value = `Actualizado: ${new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
  } catch {
    ultimaActualizacion.value = 'Error al cargar'
  } finally {
    cargando.value = false
  }
}

function formatHora(ts) {
  return new Date(ts).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>
