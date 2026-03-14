<template>
  <!-- Estado local -->
  <v-alert v-if="estadoLocal" :type="estadoLocal.tipo" variant="tonal" class="mb-3">
    {{ estadoLocal.mensaje }}
  </v-alert>

  <!-- Sección: Subir lista a Firebase -->
  <div class="mb-4">
    <p class="text-subtitle-2 text-grey mb-2">Subir lista actualizada a Firebase</p>
    <v-file-input
      v-model="archivo"
      accept=".json"
      label="Selecciona un archivo JSON"
      prepend-icon="mdi-upload"
      variant="outlined"
      density="compact"
      hide-details
      class="mb-2"
    />
    <v-btn
      color="primary"
      :loading="subiendo"
      :disabled="!archivo || subiendo"
      prepend-icon="mdi-cloud-upload"
      @click="subirLista"
    >
      Subir lista
    </v-btn>
    <v-alert v-if="mensajeSubida" :type="tipoSubida" variant="tonal" class="mt-2">
      {{ mensajeSubida }}
    </v-alert>
  </div>

  <v-divider class="my-4" />

  <!-- Sección: Sincronizar en este dispositivo -->
  <div>
    <p class="text-subtitle-2 text-grey mb-2">Sincronizar lista en este dispositivo</p>
    <v-btn
      color="deep-orange"
      :loading="sincronizando"
      prepend-icon="mdi-sync"
      @click="sincronizar"
    >
      Sincronizar desde Firebase
    </v-btn>
    <v-alert v-if="mensajeSync" :type="tipoSync" variant="tonal" class="mt-2">
      {{ mensajeSync }}
    </v-alert>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/db.js'
import { storage } from '@/firebase.js'
import { ref as storageRef, uploadBytes, getBytes } from 'firebase/storage'
import personasEjemplo from '@/data/personas-ejemplo.json'

const archivo = ref(null)
const subiendo = ref(false)
const mensajeSubida = ref('')
const tipoSubida = ref('success')

const sincronizando = ref(false)
const mensajeSync = ref('')
const tipoSync = ref('success')

const estadoLocal = ref(null)

const personasRef = storageRef(storage, 'personas/lista.json')

onMounted(async () => {
  const count = await db.personas.count()
  if (count > 0) {
    estadoLocal.value = { tipo: 'success', mensaje: `${count} personas cargadas localmente` }
  } else {
    estadoLocal.value = { tipo: 'warning', mensaje: 'Sin personas en este dispositivo. Sincroniza antes del evento.' }
  }
})

async function subirLista() {
  if (!archivo.value) return
  subiendo.value = true
  mensajeSubida.value = ''
  try {
    const file = archivo.value instanceof File ? archivo.value : archivo.value[0]
    const texto = await file.text()
    const personas = JSON.parse(texto)
    await uploadBytes(personasRef, new Blob([JSON.stringify(personas)], { type: 'application/json' }))
    mensajeSubida.value = `${personas.length} personas subidas a Firebase`
    tipoSubida.value = 'success'
    archivo.value = null
  } catch (e) {
    mensajeSubida.value = `Error al subir: ${e.message}`
    tipoSubida.value = 'error'
  } finally {
    subiendo.value = false
  }
}

async function sincronizar() {
  sincronizando.value = true
  mensajeSync.value = ''
  try {
    const bytes = await getBytes(personasRef)
    const personas = JSON.parse(new TextDecoder().decode(bytes))
    await db.personas.bulkPut(personas)
    const count = await db.personas.count()
    estadoLocal.value = { tipo: 'success', mensaje: `${count} personas cargadas localmente` }
    mensajeSync.value = `${personas.length} personas sincronizadas correctamente`
    tipoSync.value = 'success'
  } catch {
    const count = await db.personas.count()
    if (count > 0) {
      mensajeSync.value = `Sin conexión. Usando lista local (${count} personas)`
      tipoSync.value = 'warning'
    } else {
      await db.personas.bulkPut(personasEjemplo)
      mensajeSync.value = `Sin conexión. Cargadas ${personasEjemplo.length} personas desde lista de respaldo`
      tipoSync.value = 'warning'
      estadoLocal.value = { tipo: 'warning', mensaje: `${personasEjemplo.length} personas (lista de respaldo)` }
    }
  } finally {
    sincronizando.value = false
  }
}
</script>
