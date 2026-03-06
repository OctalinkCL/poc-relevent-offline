<template>
  <div id="qr-reader" style="width:100%" />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const emit = defineEmits(['close'])
let scanner = null

onMounted(() => {
  scanner = new Html5Qrcode('qr-reader')
  scanner.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      console.debug('[QR]', decodedText)
      scanner.stop().then(() => emit('close'))
    },
    undefined
  )
})

onUnmounted(() => {
  if (scanner?.isScanning) scanner.stop()
})
</script>
