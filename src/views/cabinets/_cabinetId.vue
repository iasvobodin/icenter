<template>
    <div>
        <button @click="saveBook">click</button>
        <h1>WO {{$route.params.cabinetId}}</h1>
        <div v-for="(item, key)  in cabinetItems" :key="item.id" class="error__holder">
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
import XLSX from 'xlsx'
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

// function ExportData()
//     {
//             filename='reports.xlsx';
//        data=[{Market: "IN", ['New Arrivals']: "6", ['Upcoming Appointments']: "2", '[Pending - 1st Attempt]': "4"},
//             {Market: "KS/MO", ['New Arrivals']: "4", ['Upcoming Appointments']: "4", '[Pending - 1st Attempt]': "2"},
//             {Market: "KS/MO", ['New Arrivals']: "4", ['Upcoming Appointments']: "4", '[Pending - 1st Attempt]': "2"},
//             {Market: "KS/MO", ['New Arrivals']: "4", ['Upcoming Appointments']: "4", '[Pending - 1st Attempt]': "2"}]
//         var ws = XLSX.utils.json_to_sheet(data);
//         var wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "People");
//         XLSX.writeFile(wb,filename);
//      }

const saveBook = ()=>{
    const arrArr =[]
state.cabinetItems.map((e,i) =>{
arrArr.push([i+1, e.body.Открыто.Описание, e.info.Добавил.split('@')[0], "Дата", e.body.Принято.Описание,e.info.Мастер.split('@')[0] ,"Дата", e.body.Устранено['Статус коррекции'] , e.body.Устранено['Время на устранение']])
})
    var worksheet = XLSX.utils.aoa_to_sheet([['№п.п', "Описание замечания", "ФИО","Дата","Описание решения","ФИО","Дата","Статус", "Время на устранение","ФИО","Дата"],...arrArr]);
var new_workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(new_workbook, worksheet, route.params.cabinetId);
    XLSX.writeFile(new_workbook, '2out.xlsx');
}
    return {saveBook,
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