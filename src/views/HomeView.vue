<template>
  <v-tabs v-model="tab">
    <v-tab value="pendientes">Pendientes ({{ pendientes.length }})</v-tab>
    <v-tab value="ingresados">Ingresados ({{ ingresados.length }})</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="pendientes">
      <TablaPendientes :items="pendientes" />
    </v-tabs-window-item>
    <v-tabs-window-item value="ingresados">
      <TablaIngresados :items="ingresados" />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '@/db.js'
import TablaPendientes from '@/components/TablaPendientes.vue'
import TablaIngresados from '@/components/TablaIngresados.vue'

const tab = ref('pendientes')
const personas = ref([])
const registros = ref([])

onMounted(async () => {
  personas.value = await db.personas.toArray()
  registros.value = await db.registros.toArray()
})

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
