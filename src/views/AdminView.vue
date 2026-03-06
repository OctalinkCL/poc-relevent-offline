<template>
  <template v-if="authenticated">
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

  <v-container v-else class="d-flex align-center justify-center" style="min-height: 80vh">
    <v-card width="320" class="pa-6 text-center">
      <v-card-title class="mb-4">Ingresa tu PIN</v-card-title>
      <v-otp-input v-model="pin" length="4" type="number" @finish="verificarPin" />
      <v-alert v-if="error" type="error" class="mt-4" density="compact">
        PIN incorrecto
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { db } from "@/db.js";
import InicializarBD from "@/components/InicializarBD.vue";
import DescargarCSV from "@/components/DescargarCSV.vue";

const PIN = "1234";
const authenticated = ref(false);
const pin = ref("");
const error = ref(false);

function verificarPin(value) {
  if (value === PIN) {
    authenticated.value = true;
    error.value = false;
  } else {
    error.value = true;
    pin.value = "";
  }
}

async function resetearBD() {
  if (!confirm("¿Seguro que deseas borrar toda la base de datos? Esta acción no se puede deshacer.")) return;
  await db.registros.clear();
  await db.personas.clear();
  window.location.reload();
}
</script>
