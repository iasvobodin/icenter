<template>
  <!-- <div>SET ERROR</div> -->
  <div v-if="$store.state.template">
    <form @submit.prevent="postError">
      <div v-if="$store.state.user.info.userRoles.includes('admin')">
        <select class="change__status" v-model="role">
          <option selected value="fitter">Сборщик</option>
          <option value="testEngeneer">Тестировщик</option>
        </select>
        <!-- <button>Fitter</button><button>TetsEngeneer</button> -->
      </div>
      <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
      <div v-if="role === 'fitter'"
        class="error__field"
        v-for="(value, key, index) in $store.state.template.error.body.Открыто"
        :key="index"
      >
        <p>{{ key }}</p>
        <br />
        <select
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
        ></textarea>
      </div>
      <div v-else>
        <div
          class="error__field"
          v-for="(value, key, index) in $store.state.template.error
            .testEngeneer"
          :key="index"
        >
          <p>{{ key }}</p>
          <br />
          <select
            v-model="errorBody[key]"
            v-if="Object.values(value)[0] === 'select'"
            name=""
            id=""
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
            name=""
            id=""
            cols="30"
            rows="5"
          ></textarea>
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
.error__field {
  margin: 10px;
  box-sizing: border-box;
}
form {
  width: min(95vw, 400px);
  margin: auto;
}
</style>
