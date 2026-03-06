<template>
  <h1>Admin</h1>
  <InicializarBD />

  <v-divider class="my-4" />

  <div class="d-flex gap-3">
    <DescargarCSV />
    <v-btn color="error" prepend-icon="mdi-delete" @click="resetearBD">
      Resetear BD
    </v-btn>
  </div>
</template>

<script setup>
import { db } from "@/db.js";
import InicializarBD from "@/components/InicializarBD.vue";
import DescargarCSV from "@/components/DescargarCSV.vue";

async function resetearBD() {
  if (!confirm("¿Seguro que deseas borrar toda la base de datos? Esta acción no se puede deshacer.")) return;
  await db.registros.clear();
  await db.personas.clear();
  window.location.reload();
}
</script>
