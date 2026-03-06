<template>
  <v-btn
    :loading="estado === 'cargando'"
    :color="colorBtn"
    :disabled="estado === 'cargando'"
    @click="inicializar"
  >
    Inicializar BD
  </v-btn>

  <v-alert v-if="mensaje" :type="tipoAlerta" class="mt-3">
    {{ mensaje }}
  </v-alert>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { db } from "@/db.js";
import personasEjemplo from "@/data/personas-ejemplo.json";

const estado = ref("idle"); // idle | cargando | exito | error
const mensaje = ref("");

const colorBtn = computed(() => {
  if (estado.value === "exito") return "success";
  if (estado.value === "error") return "error";
  return "primary";
});

const tipoAlerta = computed(() => {
  return estado.value === "exito" ? "success" : "error";
});

onMounted(async () => {
  const count = await db.personas.count();
  if (count > 0) {
    estado.value = "exito";
    mensaje.value = `${count} personas cargadas`;
  }
});

async function inicializar() {
  estado.value = "cargando";
  mensaje.value = "";
  try {
    await db.personas.bulkPut(personasEjemplo);
    estado.value = "exito";
    mensaje.value = `${personasEjemplo.length} personas cargadas`;
  } catch (e) {
    estado.value = "error";
    mensaje.value = `Error: ${e.message}`;
  }
}
</script>
