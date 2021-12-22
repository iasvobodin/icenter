<template>
  <div v-for="(v, k, i) in infoData" :key="i">
    <div
      class="cabinet__info__item"
      :class="{
        error__item__desc:
        typeof k === 'string' && k.includes('Описание') ||
        typeof k === 'string' &&  k.includes('Specific') ||
       typeof k === 'string' &&   k.includes('Comments'),
      }"
    >
      <h3
        :class="{
          error__item__vertical__title:
          typeof k === 'string' &&  k.includes('Описание') ||
         typeof k === 'string' &&   k.includes('Specific') ||
        typeof k === 'string' &&    k.includes('Comments'),
        }"
        class="info__item__title"
      >{{ k }}:</h3>
      <p
        :class="{
          error__item__vertical__title:
          typeof k === 'string' &&  k.includes('Описание') ||typeof k === 'string' && k.includes('Specific'),
          left__allign: typeof k === 'string' && k.includes('Comments'),
        }"
        class="error__item__desc"
      >
        {{
          typeof v === 'string' && v.includes('@')
            ? v.split('@')[0].replace('.', ' ')
            : v
        }}
      </p>
    </div>
    <hr v-if="hr" style="margin: 0" />
    <!-- <div class="card__border"></div> -->
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue';
type ooo = {[key:string]:string}
const props = defineProps({
  hr: {
    type: Boolean,
    default: () => true,
  },
  infoData: {
    type: Object,// as PropType<ooo>,
    required: true,
  },
})
const{hr, infoData} = toRefs(props)

</script>

<style lang="css" scoped>
.card__border {
  /* width: 100%; */
  height: 0;
  margin: 0 10px;
  border-top: 1px solid #d3d3d3;
}
.cabinet__info__item {
  /* border-bottom: 1px solid rgb(102, 102, 102); */
  padding: 5px;
  /* width: 100%; */
  display: grid;
  grid-template-columns: 2fr 5fr;
}
/* .cabinet__info__item:last-child{
  border-bottom: 0px;
} */
.error__item__desc {
  height: inherit;
  display: block;
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
  /* border-bottom: none; */
}

.info__item__title {
  justify-self: start;
  align-self: center;
  text-align: start;
  margin: 0;
}

.error__item__desc {
  height: inherit;
  display: block;
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
  /* border-bottom: none; */
}
/* 
.error__item__vertical__title {
  width: inherit;
  text-align: center;
  margin: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.left__allign {
  text-align: start;
  font-size: 14px;
} */
</style>
