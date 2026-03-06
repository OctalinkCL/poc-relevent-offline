<template>
  <v-data-table
    :headers="headers"
    :items="itemsFormateados"
    :items-per-page="20"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'RUT', key: 'rut' },
  { title: 'Timestamp', key: 'timestampFormateado' },
  { title: 'Dispositivo', key: 'dispositivo' },
  { title: 'Kit', key: 'kitFormateado' },
]

const itemsFormateados = computed(() =>
  props.items.map((item) => ({
    ...item,
    timestampFormateado: item.timestamp
      ? new Date(item.timestamp).toLocaleString('es-CL')
      : '',
    kitFormateado: item.kit ? 'sí' : 'no',
  }))
)
</script>
