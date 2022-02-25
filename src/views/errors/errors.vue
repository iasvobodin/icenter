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
  <section>
    <table v-show="false" v-if="storeTemplate">
      <colgroup>
        <col span="1" style="width: 100px" />
        <col span="1" style="width: 100px" />
        <col span="1" style="width: 100px" />
        <col span="1" style="width: 100px" />
        <col span="1" style="width: 100px" />
        <col span="1" style="width: 100px" />
        <col span="1" style="width: auto" />
        <col v-if="state.editTable" span="1" style="width: 200px" />
        <col v-if="state.editTable" span="1" style="width: 200px" />
        <col v-if="state.editTable" span="1" style="width: 200px" />
        <col v-if="state.editTable" span="1" style="width: 200px" />
        <col v-if="state.editTable" span="1" style="width: auto" />
      </colgroup>
      <tr class="head">
        <th v-for="(vv, kk) in state.errors[0]?.info" :key="kk" rowspan="2">{{ kk }}</th>
        <th rowspan="2">Описание ошибки</th>
        <th v-if="state.editTable">Статус решения</th>
        <th v-if="state.editTable">Описание решения</th>
        <th v-if="state.editTable">Статус устранения</th>
        <th v-if="state.editTable">Описание устранения</th>
        <th v-if="state.editTable">Время на устранения</th>
      </tr>
      <tbody>
        <tr v-for="(value, key, index) in state.errors" :key="index">
          <td
            v-for="(vv, kk, ii) in value.info"
            :key="ii"
          >{{ vv?.endsWith('@emerson.com') ? vv.split('@')[0].split('.')[1] : vv }}</td>
          <td>{{ value.body.at(-1)?.Открыто.Описание }}</td>
          <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
          <td
            v-for="(vvv, kkk, iii) in storeTemplate?.error?.f_error?.Принято"
            v-if="state.editTable"
            :key="iii"
          >
            <render-inputs
              v-model="state.errors[key].body[state.errors[key].body.length - 1].Принято"
              :data-render="vvv"
            />
          </td>
          <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
          <td
            v-for="(vvv, kkk, iii) in storeTemplate?.error?.f_error?.Устранено"
            v-if="state.editTable"
            :key="iii"
          >
            <render-inputs
              v-model="state.errors[key].body[state.errors[key].body.length - 1].Устранено"
              :data-render="vvv"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <section
    v-if="$store.state.user.info.userRoles.includes('testengeneer') || $store.state.user.info.userRoles.includes('godmode')"
  >
    <h2>Типа отчёт</h2>
    <div>
      <br />FROM
      <input v-model="state.dateFrom" type="date" />
      <!-- {{ Date.parse(state.date) / 1000 }} -->
      <br />
      <br />TO
      <input v-model="state.dateTo" type="date" />
      <!-- {{ new Date(state.date2) }} -->
      <br />
      <br />
      <button @click="getErrorsByTime">Запрос</button>
      <div v-if="state.errorsByT" class="tasks">
        <div v-for="task in state.errorsByT" :key="task.id">
          {{ task.id }}
          status {{ task.info.status }}
        </div>
      </div>
      <button @click="saveBook">IMPORT EXCEL</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import renderInputs from '@/components/renderInputs'
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
  dateFrom: "",
  dateTo: "",
  editTable: false,
  phList: [],
  modErrors: <modType[]>{},
  errors: <errorType[]>{},
  errorsByT: <errorType[]>{},
  search: '',
  // resErrors: null,
  fetchStatus: null,
  // errorMessage: "",
})
const selectedStatus = ref('open')

const store = useStore()


const getErrorsByTime = async () => {
  const { request: reqTasks, response: resTasks } = useFetch<errorType[]>(`/api/errorsByTime?from=${new Date(state.dateFrom).toISOString()}&to=${new Date(state.dateTo).toISOString()}`)
  await reqTasks()
  state.errorsByT = resTasks.value!
}


const saveBook = async () => {
  const XLSX = await import('xlsx')
  // function formatDate(date) {
  //   return `${date.getDate()}.0${date.getMonth() + 1}.${date.getFullYear()}`
  // }
  const arrArr: string[][] = []

  state.errorsByT.map((e, i) => {
    const row = [
      e.info.wo,
      'TBD',
      e.body.at(-1)!.Открыто['Ошибку допустил'] ? e.body.at(-1)!.Открыто['Ошибку допустил']! : e.info.Добавил,
      e.type === 't_error' ? e.info.Добавил : '',
      'TBD',
      e.type === 't_error' ? 'FFI' : 'Сборка',
      e.body.at(-1)!.Устранено['Время на устранение']?.toString() ? e.body.at(-1)!.Устранено['Время на устранение']!.toString() : '',
      e.body.at(-1)!.Открыто['Количество ошибок']?.toString() ? e.body.at(-1)!.Открыто['Количество ошибок']!.toString() : '',
      e.body.at(-1)!.Открыто.Описание!
    ]
    arrArr.push(row)
  })
  const worksheet = XLSX.utils.aoa_to_sheet([
    [
      'WO',
      'Проектировщик',
      'Сборщик',
      'Проверил',
      'Код ошибки',
      'Этап',
      'Влияние на трудозатраты',
      'Кол-во ошибок',
      'Описание',
    ],
    ...arrArr,
  ])
  const new_workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(
    new_workbook,
    worksheet,
    // route.params.cabinetId
  )
  XLSX.writeFile(new_workbook, `${Date.now()}.xlsx`)
}










const storeTemplate = computed(() => store.state.template)

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
      // console.log(store.state.activeErrors)
    }

    state.errors = JSON.parse(JSON.stringify(store.state.activeErrors)) //.map((e) => {
    //   return {
    //     id: e.id,
    //     type: e.type,
    //     info: {
    //       ...e.info,
    //       Описание: e.body.at(-1)!.Открыто.Описание,
    //     },
    //   }
    // })

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
td input {
  min-width: auto;
  width: 5ch;
  border-color: black;
  line-height: 1.1;
  height: auto;
  padding: 2px;
}
td select {
  width: 90%;
}
table {
  width: auto;
  /* width: max(98vw, 800px); */
}
</style>
