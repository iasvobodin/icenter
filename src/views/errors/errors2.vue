<template>
    <h1>Текущие ошибки по шкафам</h1>
    <p>
        В данном разделе Вы можете посмотреть ошибки добавленные сборщиками и
        инженерами по тестированию.
    </p>
    <br />
    <br />
    <!-- <div class="selectStatus">
    <h3>Выберете статус ошибки   </h3>
    <select v-model="selectedStatus" class="change__status">
      <option value="open">Открыто</option>
      <option value="confirmed">Принято</option>
    </select>
    </div>-->
    <!-- <h3 class="search__title">Поиск</h3> -->
    <label for="search">Поиск:</label>
    <input
        id="search"
        v-model="state.search"
        class="choose"
        type="text"
        placeholder="WO или номер проекта"
        @keyup.enter="keyEnter"
    />
    <br />
    <br />
    <div v-if="state.modErrors" class="errors__holder">
        <div
            v-for="(value, key, index) in filter"
            :key="index"
            class="item__card"
            @click="$router.push(`/errors/${value.id}`)"
        >
            <div
                v-for="(v, k, i) in value.info"
                :key="i"
                :class="{ error__item__desc: k === 'Описание' }"
                class="error__item"
            >
                <h3
                    :class="{ error__item__vertical__title: k === 'Описание' }"
                    class="error__item__title"
                >{{ k }}:</h3>
                <p
                    :class="{ error__item__vertical__title: k === 'Описание' }"
                    class="error__item__desc"
                >{{ v?.includes('@') ? v.split('@')[0].replace('.', ' ') : v }}</p>
            </div>
        </div>
    </div>
    <!-- <div v-if="errorMessage">{{ errorMessage }}</div> -->
    <div v-if="state.fetchStatus" class="loading" />
    <div class="button__holder">
        <img
            class="info"
            src="/img/information.svg"
            alt="Справка"
            @click="$router.push('/errors/info')"
        />
        <img
            class="add__button"
            src="/img/add.svg"
            alt="Добавить новую ошибку"
            @click="$router.push('/errors/addnewerror')"
        />
    </div>
    <!-- v-if="view === 'table'" class="table" -->
    <section>
        <table>
            <colgroup>
                <!-- <col span="1" style="width: 6%" />
                <col span="1" style="width: 10%" />
                <col span="1" style="width: 10%" />
                <col span="1" style="width: auto" />
                <col span="1" style="width: auto" />
                <col span="1" style="width: 5%" />
                <col span="1" style="width: 5%" />
                <col span="1" style="width: 6%" />-->
            </colgroup>
            <tr class="head">
                <!-- <th>№</th> -->
                <th v-for="(vv, kk) in filter[0].info" :key="kk">{{ kk }}</th>
            </tr>
            <tbody>
                <tr>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script setup lang="ts">
import itemPhotoUploader from '@/components/itemPhotoUploader.vue'
import { reactive, computed, watch, ref } from 'vue'
import { useFetch } from '@/hooks/fetch'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { errorType } from '@/types/errorType'
import { useStore } from 'vuex'
// export default {
type modType = {
    id: string
    info: {
        Проект: string
        Шкаф: string
        wo: string
        Добавил: string
        Мастер: string
        status?: string
        Описание: string
    }
    type: 'f_error' | 't_error'
}

const state = reactive({
    phList: [],
    modErrors: <modType[]>{},
    search: '',
    errorForTable: null,
    // resErrors: null,
    fetchStatus: null,
    // errorMessage: "",
})
const selectedStatus = ref('open')

const store = useStore()

const keyEnter = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement)) return
    e.target.blur()
}

const getErrors = async () => {
    const { request, response } = useFetch<errorType[]>(`/api/errors`)

    try {
        if (Object.keys(store.state.activeErrors).length === 0) {
            await request()
            store.commit('SET_activeErrors', response.value!)
            console.log(store.state.activeErrors)
        }

        state.modErrors = store.state.activeErrors.map((e) => {
            return {
                id: e.id,
                type: e.type,
                info: {
                    ...e.info,
                    Описание: e.body.at(-1)!.Открыто.Описание,
                },
            }
        })
    } catch (error) {
        console.log('err get errors', error)
    }
}

getErrors()

watch(selectedStatus, () => getErrors())

const filter = computed(() => {
    return state.search
        ? state.modErrors.filter((e) =>
            [e?.info.wo, e?.info['Проект']].some(
                (s) => s && s.toLowerCase().includes(state.search.toLowerCase())
            )
        )
        : state.modErrors
})

onBeforeRouteUpdate(async (to, from) => {
    if (from.fullPath.includes('error')) {
        alert('a')
    }
})
onBeforeRouteLeave((to, from) => {
    console.log(to, 'onBeforeRouteLeave')
    console.log(from, 'onBeforeRouteLeave')
})

// return {
//   selectedStatus,
//   ...toRefs(state),
// }
//   },
// };
</script>

<style lang="css" scoped>
/* .info{

/* .info{
  position: fixed;
  bottom: 20px;
  right: 80px;
  width: 40px;
  height: 40px;
  cursor: pointer;
} */
.search__title {
    width: auto;
}
input {
    height: 30px;
    border: 1px solid orange;
    border-radius: 5px;
    min-width: 250px;
    line-height: 30px;
    font-size: 18px;
    text-align: center;
    margin: auto;
    padding: 0px;
}
.button__holder {
    display: grid;
    grid-auto-flow: column;
    column-gap: 20px;
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 120px;
    height: 60px;
    cursor: pointer;
    background-color: white;
    border: 1px solid blue;
    padding: 10px;
    border-radius: 10px;
}
.button__holder > img {
    place-self: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.selectStatus > h3 {
    display: inline;
}
.change__status {
    width: auto;
}
.update__button {
    margin-top: 1vh;
}
.errors__holder {
    display: grid;
    width: 98%;
    margin: auto;
    grid-template-columns: repeat(auto-fill, minmax(max(18vw, 250px), 1fr));
    column-gap: 2vh;
    row-gap: 2vh;
}
.errors__card {
    border: 1px solid orange;
    border-radius: 4px;
    padding: 5px;
    cursor: pointer;
}
.errors__card:hover {
    border: 1px solid black;
    background: rgba(245, 254, 255, 0.356);
}
.error__item {
    border-bottom: 1px solid black;
    padding: 2px;
    display: grid;
    grid-template-columns: 2fr 3fr;
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
.loading {
    margin: auto;
    width: 30px;
    height: 30px;
    background: url(/img/loading.gif) no-repeat center bottom;
}
.error__desc {
    border-bottom: none;
    padding: 2px;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
    border-bottom: none;
}
.error__item__vertical__title {
    width: inherit;
    text-align: center;
    margin: 5px;
    white-space: pre-wrap;
    word-wrap: break-word;
}
