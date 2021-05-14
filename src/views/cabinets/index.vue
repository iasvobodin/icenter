<template>
<h1>{{qr}}</h1>
  <!-- <video id="qr-video" playsinline="" disablepictureinpicture="" style="transform: scaleX(-1);"></video>
  <button @click="scanner.start()">SCAN</button> -->
  <!-- <div id="reader" style="width: 500px"></div> -->
  <QRcodeScanner/>
</template>
<script>
import QRcodeScanner from '@/components/QRcodeScanner.vue'
export default {
    components: {
    QRcodeScanner
  },
  data() {
    return {
      qr: '',
      scanner: null
    }
  },
  mounted () {
    function onScanSuccess(qrCodeMessage) {
      console.log(qrCodeMessage);
	// handle on success condition with the decoded message
}
    // const video = document.getElementById('qr-video');
    // // QrScanner.hasCamera().then();
    // this.scanner = new QrScanner(video, result => this.qr = result);
  //  const html5QrcodeScanner = new Html5QrcodeScanner(
	// "reader", { fps: 10, qrbox: 250 });

  // console.log(globalThis);

// html5QrcodeScanner.render(onScanSuccess);
  },
};
</script>

<style lang="scss" scoped></style>
