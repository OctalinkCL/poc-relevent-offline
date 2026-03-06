<template>
  <v-app id="inspire">
    <v-app-bar color="deep-orange-darken-1" flat>
      <v-app-bar-title>Control Evento</v-app-bar-title>
      <v-btn icon="mdi-home-outline" @click="$router.push('/')"></v-btn>
      <v-btn icon="mdi-cog-outline" @click="$router.push('/admin')"></v-btn>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-snackbar v-model="updateReady" timeout="-1" color="primary">
      Nueva versión disponible
      <template #actions>
        <v-btn variant="text" @click="reloadApp">Actualizar</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";

const updateReady = ref(false);

const { updateServiceWorker } = useRegisterSW({
  onNeedRefresh() {
    updateReady.value = true;
  },
});

function reloadApp() {
  updateReady.value = false;
  updateServiceWorker(true);
}
</script>
