<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="20"
  />
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'RUT', key: 'rut' },
]
</script>
