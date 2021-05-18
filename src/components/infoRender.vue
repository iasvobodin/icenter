<template>
    <div v-for="(v, k, i) in infoData" :key="i" class="cabinet__info__item"
        :class="{error__item__desc : k ==='Описание'}">
        <h3 class="info__item__title" :class="{ error__item__vertical__title: k === 'Описание' }">{{ k }}:</h3>
        <p class="error__item__desc" :class="{ error__item__vertical__title: k === 'Описание' }">
            {{ v.includes('@')? v.split('@')[0].replace('.', ' ') : v }}
        </p>
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
.cabinet__info__item {
  border-bottom: 1px solid black;
  padding: 5px;
  /* width: 100%; */
  display: grid;
  grid-template-columns: 2fr 3fr;
}
.error__item__desc {
  height: inherit;
  display: block;
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
  border-bottom: none;
}
.cabinet__info__item > h3 {
  justify-self: start;
  align-self: center;
  text-align: start;
  margin: 0;
}
.cabinet__info__item > p {
  justify-self: end;
  text-align: end;
  align-self: center;
}

.error__item__title {
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
  border-bottom: none;
}
.error__item__vertical__title {
  width: inherit;
  text-align: center;
  margin: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>