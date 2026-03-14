<template>
  <h1>Admin</h1>
  <SincronizarPersonas />

  <v-divider class="my-4" />

  <div class="d-flex gap-3">
    <DescargarCSV />
    <v-btn color="error" prepend-icon="mdi-delete" @click="resetearBD">
      Resetear BD
    </v-btn>
  </div>

  <p class="text-caption text-grey text-center mt-6">v{{ VERSION }}</p>
</template>

<script setup>
import { db } from "@/db.js";

const VERSION = '1.0.0'
import SincronizarPersonas from "@/components/SincronizarPersonas.vue";
import DescargarCSV from "@/components/DescargarCSV.vue";

async function resetearBD() {
  if (!confirm("¿Seguro que deseas borrar toda la base de datos? Esta acción no se puede deshacer.")) return;
  await db.registros.clear();
  await db.personas.clear();
  window.location.reload();
}
</script>
