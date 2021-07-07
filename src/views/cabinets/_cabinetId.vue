<template>
    <div>
        <h1>WO {{$route.params.cabinetId}}</h1>
<br>
  <button
  class="cabinets__category"
     v-for="tab in cabinetTabs"
     :key="tab.title"
     :class="['tab-button', { active: currentCabinetTab === tab.value }]"
     @click="currentCabinetTab = tab.value"
   >
    {{ tab.title }}
  </button>
  <br>
  <br>
  <component :is="currentCabinetTab" class="tab"></component>
    </div>
</template>

<script>
// import XLSX from 'xlsx'
import {
    useFetch
} from '@/hooks/fetch'
import {
    reactive,
    toRefs
} from 'vue'
import {
    useRouter,
    useRoute
} from 'vue-router'
import infoRender from '@/components/infoRender.vue'
import cabinetErrors from '@/components/cabinetErrors.vue'
import cabinetCabTime from '@/components/cabinetCabTime.vue'
export default {
    components: {
        cabinetErrors,
        cabinetCabTime,
        // conditionalRender,
        infoRender,
        // chooseWoNumber,
    },
    setup() {
        const route = useRoute()
        const state = reactive({
            cabinetItems: null,
            cabinetTabs: [
                {title:'Информация',
                value: 'cabinet-info'
                }, 
                {title:'CabTime',
                value: 'cabinet-cab-time'
                }, 
                {title:'Ошибки',
                value: 'cabinet-errors'
                }, 
                {title:"Задачи",
                value: 'cabinet-tasks'
                }],
            tabs: ['Открыто', 'Принято', 'Устранено', "Фото"],
            currentCabinetTab:"",
            currentTab: {},
            statusColor: {
                closed: "green",
                open: "red",
                confirmed: "yellow"
            }
        })
        const getCabinetItems = async () => {
            const {request, response} = useFetch(
                `/api/cabinetItems?wo=${route.params.cabinetId}`,
            )
            await request()
            state.cabinetItems = response
            //need to chanche tabs set default OPEN
            state.cabinetItems.forEach((e, i) => {
                state.currentTab[i] = "Открыто"
            });
        }
        getCabinetItems()

        const saveBook = async () => {
            const XLSX = await import('xlsx')

            function formatDate(date) {
                return `${date.getDate()}.0${date.getMonth() + 1}.${date.getFullYear()}`
            }

            const arrArr = []
            state.cabinetItems.map((e, i) => {
                arrArr.push([
                    i + 1, e.body.Открыто.Описание,
                    e.info.Добавил.split('@')[0].replace('.', ' '),
                    formatDate(new Date(+e._ts)),
                    e.body.Принято.Описание, e.info.Мастер.split('@')[0].replace('.', ' '),
                    e.body.Устранено['Статус коррекции'],
                    e.body.Устранено['Время на устранение'],
                    e.body._changed.split('@')[0].replace('.', ' '),
                    formatDate(new Date(+e.body._time)),
                    ...e.photos.map(p => `https://icaenter.blob.core.windows.net/errors-photo/${p}`)
                ])
            })
            const worksheet = XLSX.utils.aoa_to_sheet([
                ['№', "Описание замечания", "ФИО", "Дата", "Описание решения", "ФИО", "Статус", "Время на устранение", "ФИО", "Дата", "Фото"], ...arrArr
            ]);
            const new_workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(new_workbook, worksheet, route.params.cabinetId);
            XLSX.writeFile(new_workbook, `${Date.now()}.xlsx`);
        }
        return {
            saveBook,
            //   updateWO,
            ...toRefs(state),
        }
    },
}
</script>

<style lang="css" scoped>
.cabinets__category{
    min-width: 20%;
}
.tab-button.active {
  background: #0066ff1f;
}
[type="radio"] {
    display: none;
}

small{
    /* border-style: solid;
    border-width: 3px; */
    border-radius: 5px;
    padding: 3px;
    color: white;
}

label {
    border: 1px solid orange;
    position: relative;
    /* border-bottom: 0px solid orange; */
    padding: 5px;
    cursor: pointer;
    /* border-radius: 4px; */
    border-radius: 5px 5px 0 0;
    background-color: rgba(255, 183, 157, 0.13);
    display: block;
    width: 100%;
}

[type="radio"]:checked~label {
    background: white;
    background-color: rgb(255, 255, 255);
    /* color: aliceblue; */
    border-bottom: 1px solid white;
    /* z-index: 2; */
}

.card__holder {
    margin-top: 0px;
    padding: 15px;
    border-radius: 0 0 5px 5px;
    border: 1px solid orange;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
}

.err__tab {
    place-self: stretch;
}

.err__tabs {
    display: grid;
    grid-auto-flow: column;
    column-gap: 10px;
    /* width: 100%; */
    margin: auto;
    margin-bottom: -1px;

}

.error__holder {
    border-bottom: 1px solid black;
    /* border-radius:4px; */
    width: min(1200px, 95vw);
    margin: auto;
    margin-top: 1vh;
    padding-bottom: 1vh;

}
</style>