<template>
<h1>{{qr}}</h1>
  <video id="qr-video" playsinline="" disablepictureinpicture="" style="transform: scaleX(-1);"></video>
  <button @click="scanner.start()">SCAN</button>
</template>

<script>
import qrcode from "html5-qrcode"
import QrScanner from 'qr-scanner';
export default {
  data() {
    return {
      qr: '',
      scanner: null
    }
  },
  mounted () {
    const video = document.getElementById('qr-video');
    // QrScanner.hasCamera().then();
    this.scanner = new QrScanner(video, result => this.qr = result);
   
  },
};
</script>

<style lang="scss" scoped></style>
