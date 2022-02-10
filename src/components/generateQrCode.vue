<template>
  <div class="page">
    <h1 class="big__header">WO : {{ generateData.wo }}</h1>
    <div ref="generate" class="qr__holder"></div>
    <h1 class="big__header">{{ generateData['cab name'] }}</h1>
  </div>
</template>

<script setup lang="ts">
import QRCodeStyling from 'qr-code-styling'
import { onMounted, PropType, ref, toRefs } from 'vue';

const generate = ref()

const props = defineProps({
  generateData: {
    type: Object as PropType<{
      wo: string;
      "cab name": string;
    }>,
    required: true,
  },
})
const { generateData } = toRefs(props)

const generateQR = (wo: string) => {
  const qrCode = new QRCodeStyling({
    width: 500,
    height: 500,
    data: wo,
    margin: 50,
    type: 'canvas',
    image: '/img/logo.png',
    qrOptions: {
      typeNumber: 3,
      mode: 'Byte',
      errorCorrectionLevel: 'H',
    },
    imageOptions: {
      imageSize: 0.4,
      margin: 0,
    },
    dotsOptions: {
      type: 'classy-rounded',
    },

    cornersSquareOptions: {
      type: 'dot',
    },
    cornersDotOptions: {
      type: 'dot',
    },
  })
  qrCode.append(generate.value)
}
onMounted(() => {
  // generateData.value.forEach((cab, i) => {

  generateQR(generateData.value.wo)
  // })
})

</script>

<style lang="css" scoped>
.qr__holder {
  height: 500px;
}
.big__header {
  font-size: 60px;
  line-height: 65px;
  margin: 0;
}
.page {
  /* margin: 8vh; */
}
</style>
