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
    :items="items"
    :items-per-page="20"
    :search="busqueda"
    style="cursor: pointer"
    @click:row="(_, { item }) => emit('select', item)"
  />
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const busqueda = ref('')

const emit = defineEmits(['select'])

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'RUT', key: 'rut' },
]
</script>
