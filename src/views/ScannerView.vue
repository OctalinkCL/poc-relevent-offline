<template>
  <!-- Cámara QR permanente -->
  <EscanerQR @scanned="onQrScanned" style="width: 100%; height: 45vh;" />

  <!-- KPI -->
  <div class="d-flex justify-center align-center py-3 bg-grey-lighten-3">
    <v-chip color="deep-orange-darken-3" variant="flat" size="large">
      <strong>{{ ingresados }} de {{ personas.length }} registrados</strong>
    </v-chip>
  </div>

  <!-- Panel de resultado -->
  <div class="pa-4" style="min-height: 200px;">
    <!-- Estado vacío -->
    <div v-if="!personaEncontrada && !rutNoEncontrado" class="d-flex flex-column align-center justify-center" style="min-height: 160px;">
      <v-icon size="48" color="grey-lighten-1">mdi-qrcode-scan</v-icon>
      <p class="text-grey-lighten-1 mt-2">Escanea un QR para comenzar</p>
    </div>

    <!-- Persona encontrada -->
    <div v-else-if="personaEncontrada">
      <p class="text-subtitle-2 text-grey mb-1">Registrar ingreso</p>
      <p class="text-h6 font-weight-bold">{{ personaEncontrada.nombre }}</p>
      <p class="text-body-2 text-grey mb-4">RUT: {{ personaEncontrada.rut }}</p>
      <div class="d-flex gap-3">
        <v-btn color="primary" variant="elevated" :loading="loading" @click="registrar(true)" block>
          Con kit
        </v-btn>
        <v-btn color="secondary" variant="elevated" :loading="loading" @click="registrar(false)" block>
          Sin kit
        </v-btn>
      </div>
    </div>

    <!-- No encontrado -->
    <v-alert v-else-if="rutNoEncontrado" type="error" variant="tonal" prominent>
      <div class="font-weight-bold">Persona no encontrada</div>
      <div>El RUT <strong>{{ rutNoEncontrado }}</strong> no existe en la lista.</div>
      <template #append>
        <v-btn variant="text" icon="mdi-close" @click="rutNoEncontrado = null" />
      </template>
    </v-alert>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '@/db.js'
import EscanerQR from '@/components/EscanerQR.vue'

const personas = ref([])
const registros = ref([])
const personaEncontrada = ref(null)
const rutNoEncontrado = ref(null)
const loading = ref(false)

const ingresados = computed(() => {
  const rutsIngresados = new Set(registros.value.map((r) => r.rut))
  return personas.value.filter((p) => rutsIngresados.has(p.rut)).length
})

onMounted(async () => {
  personas.value = await db.personas.toArray()
  registros.value = await db.registros.toArray()
})

function onQrScanned(rawValue) {
  personaEncontrada.value = null
  rutNoEncontrado.value = null
  let rut = null
  try {
    rut = new URL(rawValue).searchParams.get('RUN')
  } catch {
    rut = rawValue
  }
  const persona = personas.value.find((p) => p.rut === rut)
  if (persona) {
    personaEncontrada.value = persona
  } else {
    rutNoEncontrado.value = rut ?? rawValue
  }
}

async function registrar(conKit) {
  loading.value = true
  await db.registros.add({
    rut: personaEncontrada.value.rut,
    timestamp: Date.now(),
    dispositivo: 'scanner',
    kit: conKit,
  })
  registros.value = await db.registros.toArray()
  personaEncontrada.value = null
  loading.value = false
}
</script>
