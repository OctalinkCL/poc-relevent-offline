<template>
  <v-text-field
    v-model="busqueda"
    placeholder="Buscar por nombre o RUT..."
    prepend-inner-icon="mdi-magnify"
    clearable
    hide-details
    density="compact"
    class="ma-2"
  />
  <v-data-table
    :headers="headers"
    :items="itemsFormateados"
    :items-per-page="20"
    :search="busqueda"
  />
</template>

<script setup>
import { computed, ref } from 'vue'

const busqueda = ref('')

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
