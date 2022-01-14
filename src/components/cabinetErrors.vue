<template>
  <div v-if="computedItems.length > 0">
    <div v-for="(item, key) in computedItems" :key="item.id" class="error__holder">
      <h2 @click="$router.push(`/errors/${item.id}`)">{{ item.id }}</h2>
      <small :style="{ backgroundColor: statusColor[item.status] }">Статус: {{ item.status }}</small>
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
          <label :for="`tab${i + 1}${key}`" role="button">{{ tab }}</label>
        </div>
      </div>
      <div class="card__holder">
        <div v-if="currentTab[key] !== 'Фото'">
          <info-render :info-data="{ ...item.body[currentTab[key]] }" />
        </div>
        <div v-for="ph in item.photos" v-else :key="ph" class="photo__holder">
          <a :href="`https://icaenter.blob.core.windows.net/errors-photo/${ph}`">
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
  <button v-if="computedItems && computedItems.length > 0" @click="saveBook">Экспорт excel</button>
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

    const saveBook = async () => {
      const XLSX = await import('xlsx')
      function formatDate(date) {
        return `${date.getDate()}.0${date.getMonth() + 1}.${date.getFullYear()}`
      }
      const arrArr = []
      computedItems.value.map((e, i) => {
        // if (e.type === 't_error') {
        // }
        arrArr.push([
          i + 1,//0
          e.type === 't_error' ? 'Тестирование' : 'Сборка',//1
          e.body.Открыто?.['Тип'] || e.body.Открыто?.['Тип ошибки'],//2
          e.body.Открыто?.['Причина'],//3
          e.body.Открыто?.['Этап'],//4
          e.body.Открыто?.['Описание'],//5
          e.body.Открыто?.['Количество ошибок'],//6
          e.body.Открыто?.['Ответственный'],//7
          e.body.Открыто?.['Ошибку допустил'],//8
          e.history.opened._changed.split('@')[0].replace('.', ' '),//9
          new Date(+e.history?.opened._time).toLocaleString(),//10
          e.body.Принято.Описание,//11
          e.history.confirmed?._changed.split('@')[0].replace('.', ' '),//12
          new Date(+e.history.confirmed?._time).toLocaleString(),
          e.body.Устранено['Статус коррекции'],//13
          e.body.Устранено['Время на устранение'],//14
          e.history.closed?._changed.split('@')[0].replace('.', ' ') || null,//15
          new Date(+e.history.closed?._time).toLocaleString() || null,//16
          ...e.photos.map(//17
            (p) => `https://icaenter.blob.core.windows.net/errors-photo/${p}`
          ),
        ])
      })
      const worksheet = XLSX.utils.aoa_to_sheet([
        [
          '№',//0
          'Этап добавления',//1
          'Тип',//2
          'Причина',//3
          'Этап',//4
          'Описание замечания',//5
          'Количество ошибок',//6
          'Ответственный',//7
          'Ошибку допустил',//8
          'Добавил ошибку',//9
          'Время добавления',//10
          'Описание решения',//11
          'Ошибку подтвердил',//12
          'Время подтверждения',//12
          'Статус коррекции',//13
          'Время на устранение',//14
          'Закрыл ошибку',//15
          'Время закрытия',//16
          'Фото',//17
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
  background-color: rgb(255, 246, 242);
  display: block;
  width: 100%;
}

[type="radio"]:checked ~ label {
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
  min-height: 150px;
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
