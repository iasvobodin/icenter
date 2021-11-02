<template>
  <div v-if="computedItems.length > 0">
    <div
      v-for="(item, key) in computedItems"
      :key="item.id"
      class="error__holder"
    >
      <h2 @click="$router.push(`/errors/${item.id}`)">{{ item.id }}</h2>
      <small :style="{ backgroundColor: statusColor[item.info.status] }"
        >Статус: {{ item.info.status }}</small
      >
      <br />
      <br />
      <div class="err__tabs">
        <div v-for="(tab, i) in tabs" :key="tab" class="err__tab">
          <input
            :id="`tab${i + 1}${key}`"
            v-model="currentTab[key]"
            type="radio"
            :name="`tab-control${key}`"
            :value="tab"
          />
          <label :for="`tab${i + 1}${key}`" role="button">
            {{ tab }}
          </label>
        </div>
      </div>
      <div class="card__holder">
        <div v-if="currentTab[key] !== 'Фото'">
          <info-render :info-data="{ ...item.body[currentTab[key]] }" />
        </div>
        <div v-for="ph in item.photos" v-else :key="ph" class="photo__holder">
          <a
            :href="`https://icaenter.blob.core.windows.net/errors-photo/${ph}`"
          >
            <img
              :src="`https://icaenter.blob.core.windows.net/errors-photo/thumb__${ph}`"
              alt="photo error"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <h2>Безошибочный шкаф</h2>
  </div>
  <br />
  <button v-if="computedItems && computedItems.length > 0" @click="saveBook">
    Экспорт excel
  </button>
  <br />
  <router-link to="/errors/addnewerror">
    <img class="add__button" src="/img/add.svg" alt="Добавить новую ошибку" />
  </router-link>
</template>

<script>
// import XLSX from 'xlsx'
import { useStore } from 'vuex'
import { useFetch } from '@/hooks/fetch'
import { computed, reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import infoRender from '@/components/infoRender.vue'
export default {
  components: {
    infoRender,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      cabinetItems: null,
      cabinetTabs: ['Информация', 'CabTime', 'Ошибки', 'Задачи'],
      tabs: ['Открыто', 'Принято', 'Устранено', 'Фото'],
      currentTab: {},
      statusColor: {
        closed: 'green',
        open: 'red',
        confirmed: 'rgb(175, 164, 0)',
      },
    })
    const computedItems = computed(() =>
      store.state.cabinetItems?.filter((e) => e.type.endsWith('error'))
    )

    computedItems.value.forEach((e, i) => {
      state.currentTab[i] = 'Открыто'
    })
    // const getCabinetItems = async () => {
    //     const {
    //         request,
    //         response
    //     } = useFetch(
    //         `/api/cabinetItems?wo=${route.params.cabinetId}`,
    //     )
    //     await request()
    //     state.cabinetItems = response
    //     //need to chanche tabs set default OPEN
    //     state.cabinetItems.forEach((e, i) => {
    //         state.currentTab[i] = "Открыто"
    //     });
    // }
    // getCabinetItems()

    const saveBook = async () => {
      const XLSX = await import('xlsx')

      function formatDate(date) {
        return `${date.getDate()}.0${date.getMonth() + 1}.${date.getFullYear()}`
      }

      const arrArr = []
      computedItems.value.map((e, i) => {
        if (e.type === 't_error') {
        }
        arrArr.push([
          i + 1,
          // e.body.Открыто.Описание,
          e.body.Открыто?.['Тип'],
          e.body.Открыто?.['Причина'],
          e.body.Открыто?.['Этап'],
          e.body.Открыто?.['Описание'],
          e.body.Открыто?.['Количество ошибок'],
          e.body.Открыто?.['Ответственный'],
          e.body.Открыто?.['Ошибку допустил'],
          e.info.Добавил.split('@')[0].replace('.', ' '),
          formatDate(new Date(+e._ts)),
          e.body.Принято.Описание,
          e.info.Мастер.split('@')[0].replace('.', ' '),
          e.body.Устранено['Статус коррекции'],
          e.body.Устранено['Время на устранение'],
          e.body._changed.split('@')[0].replace('.', ' '),
          formatDate(new Date(+e.body._time)),
          ...e.photos.map(
            (p) => `https://icaenter.blob.core.windows.net/errors-photo/${p}`
          ),
        ])
      })
      const worksheet = XLSX.utils.aoa_to_sheet([
        [
          '№',
          'Тип',
          'Причина',
          'Этап',
          'Описание замечания',
          'Количество ошибок',
          'Ответственный',
          'Ошибку допустил',
          'ФИО',
          'Дата',
          'Описание решения',
          'ФИО',
          'Статус',
          'Время на устранение',
          'ФИО',
          'Дата',
          'Фото',
        ],
        ...arrArr,
      ])
      const new_workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(
        new_workbook,
        worksheet,
        route.params.cabinetId
      )
      XLSX.writeFile(new_workbook, `${Date.now()}.xlsx`)
    }
    return {
      computedItems,
      saveBook,
      ...toRefs(state),
    }
  },
}
</script>

<style lang="css" scoped>
.add__button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
[type='radio'] {
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
  background-color: rgb(255, 246, 242);
  display: block;
  width: 100%;
}

[type='radio']:checked ~ label {
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
  border-radius: 4px;
  background-color: rgba(224, 236, 255, 0.281);
  width: min(1200px, 95vw);
  margin: auto;
  margin-top: 1vh;
  padding: 1vh;
}
.error__holder > h2 {
  cursor: pointer;
}
</style>
