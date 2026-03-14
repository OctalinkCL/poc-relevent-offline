<template>
  <!-- KPI -->
  <div class="d-flex justify-center align-center py-3 bg-grey-lighten-3 gap-4">
    <v-chip color="deep-orange-darken-3" variant="flat" size="large">
      <strong>{{ registros.length }} ingresados</strong>
    </v-chip>
    <v-chip :color="online ? 'success' : 'error'" variant="tonal" size="small">
      <v-icon start :icon="online ? 'mdi-wifi' : 'mdi-wifi-off'" />
      {{ online ? 'En línea' : 'Sin conexión' }}
    </v-chip>
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
      <tr v-if="registros.length === 0">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { database } from '@/firebase.js'
import { ref as dbRef, onValue, off } from 'firebase/database'

const registros = ref([])
const online = ref(navigator.onLine)
const registrosRef = dbRef(database, 'registros')

onMounted(() => {
  window.addEventListener('online', () => { online.value = true })
  window.addEventListener('offline', () => { online.value = false })
  onValue(registrosRef, (snap) => {
    const data = snap.val() ?? {}
    registros.value = Object.entries(data)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.timestamp - a.timestamp)
  })
})

onUnmounted(() => {
  off(registrosRef)
})

function formatHora(ts) {
  return new Date(ts).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>
