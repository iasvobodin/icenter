<template>
    <div v-for="(item, key)  in cabinetItems" :key="item.id" class="error__holder">
        <h2>{{item.id }}</h2>
        <small :style="{backgroundColor: statusColor[item.status]}">Статус: {{item.status}}</small>
        <br>
        <br>
        <div class="err__tabs">
            <div class="err__tab" v-for="(tab, i) in tabs" :key="tab">
                <input v-model="currentTab[key]" :id="`tab${i+1}${key}`" type="radio" :name="`tab-control${key}`"
                    :value="tab">
                <label :for="`tab${i+1}${key}`" role="button">
                    {{tab}}
                </label>
            </div>
        </div>
        <div class="card__holder">
            <div v-if="currentTab[key] !== 'Фото'">
                <info-render :info-data="{...item.body[currentTab[key]]}" />
            </div>
            <div class="photo__holder" v-for="ph in item.photos" v-else :key="ph">
                <a :href="`https://icaenter.blob.core.windows.net/errors-photo/${ph}`">
                    <img :src="`https://icaenter.blob.core.windows.net/errors-photo/thumb__${ph}`" alt="photo error">
                </a>
            </div>
        </div>
    </div>
            <br>
        <button v-if="cabinetItems&&cabinetItems.length>0" @click="saveBook">Экспорт excel</button>
        <br>
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
            cabinetTabs: ['Информация', 'CabTime', 'Ошибки', "Задачи"],
            tabs: ['Открыто', 'Принято', 'Устранено', "Фото"],
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

[type="radio"] {
    display: none;
}

small {
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
    background-color: rgb(255,246,242);
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
    background-color: #fff;
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
    border: 1px solid black;
    border-radius:4px;
    background-color: rgba(224, 236, 255, 0.281);
    width: min(1200px, 95vw);
    margin: auto;
    margin-top: 1vh;
    padding: 1vh;
   

}
</style>