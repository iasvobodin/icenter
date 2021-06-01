<template>
    <div>
        <h1>WO {{$route.params.cabinetId}}</h1>
        <div v-for="(item, key)  in cabinetItems" :key="item.id" class="error__holder">
            <h2>Ошибка {{ key+1 }}</h2>
            <div class="err__tabs">
                <div class="err__tab" v-for="(tab, i) in tabs" :key="tab">
                    <!-- <p >{{tab}}</p> -->
                    <input v-model="currentTab[key]" :id="`tab${i+1}${key}`" type="radio" :name="`tab-control${key}`"
                        :value="tab">
                    <label :for="`tab${i+1}${key}`" role="button">
                        {{tab}}
                    </label>
                </div>
            </div>
            <div class="card__holder">
                <div v-if="currentTab[key] !== 'Фото'">
                <info-render  :info-data="{...item.body[currentTab[key]]}" />
                </div>
                <div class="photo__holder" v-for="ph in item.photos" v-else :key="ph">
                    <a :href="`https://icaenter.blob.core.windows.net/errors-photo/${ph}`">
                    <img :src="`https://icaenter.blob.core.windows.net/errors-photo/thumb__${ph}`" alt="photo error">
                    </a>
                </div>
            </div>
        </div>
         <br>
        <button @click="saveBook">Экспорт excel</button>
        <br>
         <br>
    </div>
</template>

<script>
import XLSX from 'xlsx'
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
            tabs: ['Открыто', 'Принято', 'Устранено', "Фото"],
            currentTab: {}
        })
        const getCabinetItems = async () => {
            const {
                request,
                response
            } = useFetch(
                `/api/cabinetItems?wo=${route.params.cabinetId}`,
            )
            await request()
            state.cabinetItems = response
            state.cabinetItems.forEach((e, i) => {
                state.currentTab[i] = "Открыто"
            });
        }
        getCabinetItems()

        const saveBook = () => {
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

label {
    border: 1px solid orange;
    border-bottom: 0px solid orange;
    padding: 5px;
    cursor: pointer;
    border-radius: 4px;
    display: block;
    width: 100%;
}

[type="radio"]:checked~label {
    background: white;
    z-index: 2;
    background-color: coral;
    color: aliceblue;
}

.card__holder {
    margin-top: 0px;
    padding: 15px;
    border-radius: 4px;
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