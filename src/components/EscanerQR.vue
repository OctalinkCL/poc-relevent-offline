<template>
  <QrcodeStream :constraints="{ facingMode: 'environment' }" :paused="paused" @detect="onDetect" @error="onError"
    style="height: 300px;" />
</template>

<script setup>
import { ref } from 'vue'
import { QrcodeStream } from "vue-qrcode-reader";

const emit = defineEmits(["scanned"]);
const paused = ref(false)

function onDetect(detections) {
  if (detections.length > 0) {
    paused.value = true
    emit("scanned", detections[0].rawValue)
    setTimeout(() => { paused.value = false }, 500)
  }
}

function onError(err) {
  console.error("QR scanner error:", err);
}
</script>
