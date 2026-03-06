<template>
  <v-dialog :model-value="persona !== null" max-width="400" @update:model-value="!$event && emit('close')">
    <v-card v-if="persona">
      <v-card-title class="d-flex justify-space-between align-center">
        Registrar ingreso
        <v-btn icon="mdi-close" variant="text" @click="emit('close')" />
      </v-card-title>
      <v-card-text>
        <div><strong>Nombre:</strong> {{ persona.nombre }}</div>
        <div><strong>RUT:</strong> {{ persona.rut }}</div>
      </v-card-text>
      <v-card-actions class="justify-center gap-2 pb-4">
        <v-btn color="primary" variant="elevated" :loading="loading" @click="registrar(true)">Con kit</v-btn>
        <v-btn color="secondary" variant="elevated" :loading="loading" @click="registrar(false)">Sin kit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '@/db.js'

const props = defineProps({
  persona: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'ingresado'])

const loading = ref(false)

async function registrar(conKit) {
  loading.value = true
  await db.registros.add({
    rut: props.persona.rut,
    timestamp: Date.now(),
    dispositivo: 'manual',
    kit: conKit,
  })
  loading.value = false
  emit('ingresado')
}
</script>
