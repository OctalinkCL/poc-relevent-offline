<template>
  <QrcodeStream
    :constraints="{ facingMode: 'environment' }"
    @detect="onDetect"
    @error="onError"
  />
</template>

<script setup>
import { QrcodeStream } from "vue-qrcode-reader";

const emit = defineEmits(["scanned"]);

function onDetect(detections) {
  if (detections.length > 0) {
    emit("scanned", detections[0].rawValue);
  }
}

function onError(err) {
  console.error("QR scanner error:", err);
}
</script>
