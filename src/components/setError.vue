<template>
  <!-- <div>SET ERROR</div> -->
  <div v-if="$store.state.template">
    <form @submit.prevent="postError">
      <div
        class="error__item"
        v-if="$store.state.user.info.userRoles.includes('admin')"
      >
      <h4 class="error__item__title">Выберете роль</h4>  
        <select class="change__status error__item__desc" v-model="role">
          <option selected value="fitter">Сборщик</option>
          <option value="testEngeneer">Тестировщик</option>
        </select>
        <!-- <button>Fitter</button><button>TetsEngeneer</button> -->
      </div>
      <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
      <div  v-if="role === 'fitter'"
        :class="{ error__item__desc: key==='Описание' }"
          class="error__item"
        v-for="(value, key, index) in $store.state.template.error.body2.Открыто"
        :key="index"
      >
        <h4 :class="{ error__item__vertical__title: key==='Описание' }"  class="error__item__title">{{ key }}</h4>
       <select class="error__item__desc"
            v-model="errorBody[key]"
            v-if="Object.values(value)[0] === 'select'"
          >
            <option v-for="(v, i) in Object.values(value)[1]" :key="i">
              {{ v }}
            </option>
          </select>
          <input
            v-model="errorBody[key]"
            v-if="Object.values(value)[0] === 'checkbox'"
            type="checkbox"
          />
          <input
            v-model="errorBody[key]"
            v-if="Object.values(value)[0] === 'number'"
            type="number"
          />
          <textarea
            v-model="errorBody[key]"
            v-if="Object.values(value)[0] === 'textarea'"
            cols="30"
            rows="5"
          ></textarea>
      </div>
      <div v-else>
        <div
          :class="{ error__item__desc: key==='Описание' }"
          class="error__item"
          v-for="(value, key, index) in $store.state.template.error.testEngeneer"
          :key="index"
        >
          <h4 :class="{ error__item__vertical__title: key==='Описание' }"  class="error__item__title">{{ key }}</h4>
          <select class="error__item__desc"
            v-model="errorBody[key]"
            v-if="Object.values(value)[0] === 'select'"
          >
            <option v-for="(v, i) in Object.values(value)[1]" :key="i">
              {{ v }}
            </option>
          </select>
          <input
            v-model="errorBody[key]"
            v-if="Object.values(value)[0] === 'checkbox'"
            type="checkbox"
          />
          <input
            v-model="errorBody[key]"
            v-if="Object.values(value)[0] === 'number'"
            type="number"
          />
          <textarea
            v-model="errorBody[key]"
            v-if="Object.values(value)[0] === 'textarea'"
            cols="30"
            rows="5"
          ></textarea>
        </div>
      </div>
      <div v-if="errorBody['Ошибку допустил']&&role === 'testEngeneer'">
        <div
          class="error__field"
          v-if="errorBody['Ошибку допустил'] === 'Инженер-проектировщик'"
        >
          <select name="" id="">
            <option value="">инж1</option>
            <option value="">инж2</option>
          </select>
        </div>
        <div
          class="error__field"
          v-if="errorBody['Ошибку допустил'] === 'Сборщик'"
        >
          <select name="" id="">
            <option value="">сб1</option>
            <option value="">сб2</option>
          </select>
        </div>
      </div>
      <!-- <input type="file" /> -->
      <input class="add__button" type="submit" value="добавить в базу" />
    </form>
    <!-- {{errorTemplate.error.body}} -->
  </div>
  <!-- <select
          required
          v-if="typeof value === 'object'"
          v-model="errorBody[key]"
        >
          <option v-for="(opt, index) in value" :key="index">
            {{ opt }}
          </option>
        </select>
        <textarea
          v-else
          required
          v-model="errorBody[key]"
          cols="50"
          rows="5"
        ></textarea> -->
</template>

<script>
export default {
  methods: {
    async postError() {
      this.error = {
        id: "error__" + Date.now(),
        info: {
          Проект: this.$store.state.projectInfo["project number"],
          Шкаф: this.$store.state.projectInfo["cab name"],
          wo: this.$store.state.projectInfo.wo.toString(),
          Добавил: sessionStorage.getItem("userDetails").toLowerCase(),
          Мастер: this.$store.state.projectInfo["senior fitter"].toLowerCase(),
        },
        type: "error",
        status: "open",
        stage: 1,
        ttl: 6000,
        body: [{ Открыто: this.errorBody, Принято: {}, Устранено: {} }],
      };

      const openError = {
        id: this.error.id,
        info: {
          ...this.error.info,
          Описание: this.errorBody["Описание"],
        },
        type: "error",
        status: "open",
        ttl: 6000,
      };

      try {
        await fetch("/api/POST_error", {
          method: "POST", // или 'PUT'
          body: JSON.stringify({ ...this.error }),
        });
        await fetch("/api/POST_openError", {
          method: "POST", // или 'PUT'
          body: JSON.stringify({ ...openError }),
        });
      } finally {
        this.errorBody = {};
      }
      // await fetch(`/api/blob?fileName=${this.error.id}`, {
      //   method: "POST",
      //   body: formData,
      // });
    },
  },
  created() {
    // !this.$store.state.template && this.$store.dispatch("GET_template");
  },
  data() {
    return {
      errorTemplate: null,
      errorBody: {},
      error: {},
      photo: null,
      role: "fitter",
    };
  },

  // async mounted() {
  //   try {
  //     if (!this.errorTemplate) {
  //       this.errorTemplate = await (
  //         await fetch("/api/templates/templateProject/ver1")
  //       ).json();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};
</script>

<style lang="css" scoped>
.cabinet__info__item {
  border-bottom: 1px solid black;
  padding: 5px;
  /* width: 100%; */
  display: grid;
  grid-template-columns: 1fr 4fr;
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
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
}
.error__field {
  margin: 10px;
  box-sizing: border-box;
}
form {
  width: min(95vw, 400px);
  margin: auto;
}
.error__item__desc {
  display: block;
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
}
.error__item__vertical__title {
  text-align: center;
  margin: 5px;
}
</style>
