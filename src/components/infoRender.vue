<template >
  <div v-for="(v, k, i) in infoData" :key="i"
    >
    <div class="cabinet__info__item" :class="{error__item__desc : k.includes('Описание') || k.includes('Specific') }">
      <h3 :class="{ error__item__vertical__title: k.includes('Описание')|| k.includes('Specific')}" class="info__item__title">{{ k }}:</h3>
    <p :class="{ error__item__vertical__title: k.includes('Описание') || k.includes('Specific') }" class="error__item__desc">
      {{ typeof v === 'string'&&v.includes('@')? v.split('@')[0].replace('.', ' ') : v }}
    </p>
    </div>
  <div class="card__border"></div>
  </div>
</template>

<script>
  export default {
    props: {
      infoData: {
        type: Object,
        required: true
      }
    },
  }
</script>

<style lang="css" scoped>
.card__border{
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
  grid-template-columns: 2fr 3fr;
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

.error__item__vertical__title {
  width: inherit;
  text-align: center;
  margin: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>