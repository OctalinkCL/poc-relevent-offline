<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="20"
    style="cursor: pointer"
    @click:row="(_, { item }) => emit('select', item)"
  />
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select'])

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'RUT', key: 'rut' },
]
</script>
