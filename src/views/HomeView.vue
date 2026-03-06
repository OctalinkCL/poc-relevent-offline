<template>
  <v-tabs v-model="tab">
    <v-tab value="pendientes">Pendientes ({{ pendientes.length }})</v-tab>
    <v-tab value="ingresados">Ingresados ({{ ingresados.length }})</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="pendientes">
      <TablaPendientes :items="pendientes" @select="personaSeleccionada = $event" />
    </v-tabs-window-item>
    <v-tabs-window-item value="ingresados">
      <TablaIngresados :items="ingresados" />
    </v-tabs-window-item>
  </v-tabs-window>

  <DialogIngreso
    :persona="personaSeleccionada"
    :rut-no-encontrado="rutNoEncontrado"
    @close="personaSeleccionada = null; rutNoEncontrado = null"
    @ingresado="onIngresado"
  />

  <!-- FAB -->
  <v-btn
    icon="mdi-qrcode-scan"
    color="primary"
    style="position:fixed; bottom:24px; right:24px; z-index:100"
    @click="scannerAbierto = true"
  />

  <!-- Dialog con escáner -->
  <v-dialog v-model="scannerAbierto" max-width="400">
    <v-card>
      <EscanerQR @scanned="onQrScanned" />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '@/db.js'
import TablaPendientes from '@/components/TablaPendientes.vue'
import TablaIngresados from '@/components/TablaIngresados.vue'
import DialogIngreso from '@/components/DialogIngreso.vue'
import EscanerQR from '@/components/EscanerQR.vue'

const tab = ref('pendientes')
const scannerAbierto = ref(false)
const personas = ref([])
const registros = ref([])
const personaSeleccionada = ref(null)
const rutNoEncontrado = ref(null)

onMounted(async () => {
  personas.value = await db.personas.toArray()
  registros.value = await db.registros.toArray()
})

function onQrScanned(decodedText) {
  scannerAbierto.value = false
  let rut = null
  try {
    rut = new URL(decodedText).searchParams.get('RUN')
  } catch {
    rut = decodedText
  }
  const persona = personas.value.find((p) => p.rut === rut)
  if (persona) {
    personaSeleccionada.value = persona
  } else {
    rutNoEncontrado.value = rut ?? decodedText
  }
}

async function onIngresado() {
  registros.value = await db.registros.toArray()
  personaSeleccionada.value = null
}

const pendientes = computed(() => {
  const rutsIngresados = new Set(registros.value.map((r) => r.rut))
  return personas.value.filter((p) => !rutsIngresados.has(p.rut))
})

const ingresados = computed(() => {
  const rutsIngresados = new Set(registros.value.map((r) => r.rut))
  const registrosPorRut = Object.fromEntries(registros.value.map((r) => [r.rut, r]))
  return personas.value
    .filter((p) => rutsIngresados.has(p.rut))
    .map((p) => ({ ...p, ...registrosPorRut[p.rut] }))
})
</script>
