<template>
    <div>
        <h1>WO {{$route.params.cabinetId}}</h1>
        <div class="error__holder" v-for="(item, key)  in cabinetItems" :key="item.id">
            <h2>Ошибка {{ key+1 }}</h2>
            <div class="err__view">
                <p v-for="tab in tabs" :key="tab" @click="currentTab[key] = tab">{{tab}}</p>
            </div>            
                 <info-render v-if="currentTab[key] !== 'Фото'" :info-data="{...item.body[currentTab[key]]}" />
            <div v-for="ph in item.photos" v-else :key="ph">
                <img :src="`https://icaenter.blob.core.windows.net/errors-photo/thumb__${ph}`" alt="">
            </div>

            <br>
        </div>
    </div>
</template>

<script>
import { useFetch } from '@/hooks/fetch'
import { reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import infoRender from '@/components/infoRender.vue'
export default {
  components: {
    // conditionalRender,
    infoRender,
    // chooseWoNumber,
  },
          setup() {
    const route = useRoute()
    const state = reactive({
      cabinetItems: null,
      tabs: ['Открыто', 'Принято', 'Устранено',"Фото"],
      currentTab: {}
    })
    const getCabinetItems = async () => {
      const { request, response } = useFetch(
        `/api/cabinetItems?wo=${route.params.cabinetId}`,
      )
      await request()
      state.cabinetItems = response
      state.cabinetItems.forEach((e,i) => {
          state.currentTab[i] = "Открыто"
      });
    }
    // const updateWO = async () => {
    //   const { request, response } = useFetch(
    //     `/api/cabinetList?updateWO=true&project=${route.params.projectId}`,
    //   )
    //   await request()
    //   state.newWO = response
    // }
    getCabinetItems()

    return {
    //   updateWO,
      ...toRefs(state),
    }
  },
    }
</script>

<style lang="css" scoped>
.err__view{
    display: flex;
    width: 95%;
    margin: auto;
}
.err__view>p{
    width: 30%;
    text-align: center;
    /* margin: 10px; */
    font-weight: 700;
    font-size: 14px;
    border: 1px solid black;
    padding: 2px;
    /* border-radius: 4px; */
}
.error__holder{
    border: 1px solid red;
    margin: 1vh;
    border-radius:4px;

}
</style>