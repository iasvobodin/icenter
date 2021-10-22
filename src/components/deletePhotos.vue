<template>
  <div class="photolist">
    <div v-for="(item, i) in state.phList" :key="i" class="holder">
      <img
        :src="`https://icaenter.blob.core.windows.net/errors-photo/${item}`"
        alt=""
        class="listphotos"
      />
      <div class="cross" @click="deletPh(i, item)"><span>&#10060;</span></div>
    </div>
    <!-- <error-photos :current-photos="state.phList" /> -->
  </div>
  <button @click="dd">DD</button>
</template>

<script setup>
import { useFetch } from '@/hooks/fetch'
import { reactive, computed, watch, ref } from 'vue'
const state = reactive({
  errors: null,
  phList: [],
  delphotos: [],
  // resErrors: null,
  fetchStatus: null,
  // errorMessage: "",
})
const deletPh = (i, item) => {
  state.phList.splice(i, 1)
  state.delphotos.push(item)
}
const dd = async () => {
  // this.error.photos.length > 0 &&
  await Promise.all(
    state.delphotos.map(async (e) => {
      await fetch(`/api/blob?container=errors-photo&fileName=${e}&delblob=true`)
    })
  )
}

const getphotoList = async () => {
  const { request: photoListreq, response: phList } = useFetch(
    `/api/blob?container=errors-photo&list=true`
  )
  state.phList = phList
  await photoListreq()
}
getphotoList()
</script>

<style lang="css" scoped>
.cross {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
}
.holder {
  position: relative;
}
.photolist {
  margin-top: 5vh;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-auto-columns: 200px;
}
.listphotos {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
