<template>
  <div v-if="$store.state.template">
    <form id="postError" @submit.prevent="postError">
      <div
        class="error__item"
        v-if="$store.state.user.info.userRoles.includes('admin')"
      >
        <h4 class="error__item__title">Выберете роль</h4>
        <select class="change__status error__item__desc" v-model="role">
          <option selected value="f_error">Сборщик</option>
          <option value="t_error">Тестировщик</option>
        </select>
      </div>
      <div
        v-for="(value, key, index) in $store.state.template.error[role]"
        :key="index"
      >
        <section v-if="returnRender(key)">
          <h3>Статус ошибки: {{ key }}</h3>
          <conditional-render v-model="errorBody[key]" :dataRender="value" />
        </section>
      </div>
      <br />
      <input class="add__button" type="submit" value="Добавить" />
    </form>
    <br />
    <input @input="checkFile" multiple type="file" id="imageFile" capture="user" accept="image/*" />
    <br>
    <div v-if="files">
    <p v-for="f in files" :key="f.lastModified" >{{f.name}}</p></div>
    <br />
    <br>
    <button @click="statusConfirmed = !statusConfirmed">
      Подтвердить ошибку
    </button>
    <button v-if="statusConfirmed" @click="statusClosed = !statusClosed">
      Закрыть ошибку
    </button>
  </div>
</template>

<script>
import conditionalRender from "@/components/conditionalRender";
export default {
    data() {
    return {
      files: null,
      errorTemplate: null,
      errorBody: { Открыто: {}, Принято: {}, Устранено: {} },
      error: {},
      photo: null,
      role: "f_error",
      statusConfirmed: false,
      statusClosed: false,
    };
  },
  methods: {
    checkFile(){
var fileInput = document.getElementById("imageFile");

// files is a FileList object (similar to NodeList)
this.files = fileInput.files;
// console.log(files);
    },
    returnRender(key) {
      if (key === "Открыто") {
        return true;
      }
      if (key === "Принято" && this.statusConfirmed) {
        return true;
      }
      if (key === "Устранено" && this.statusClosed && this.statusConfirmed) {
        return true;
      }
    },
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
        type: this.role,
        status: Object.values(this.errorBody.Устранено)[0]
          ? "closed"
          : Object.values(this.errorBody.Принято)[0]
          ? "confirmed"
          : "open",
        ttl: 6000,
        body: [
          {
            ...this.errorBody,
            _changed: sessionStorage.getItem("userDetails").toLowerCase(),
            _time: `${Date.now()}`,
          },
        ],
      };

      const openError = {
        id: this.error.id,
        info: {
          ...this.error.info,
          Описание: this.errorBody.Открыто["Описание"],
        },
        type: this.error.type,
        status: this.error.status,
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
        this.errorBody = { Открыто: {}, Принято: {}, Устранено: {} };
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
  components: {
    conditionalRender,
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
  padding-top: 6px;
  padding-bottom: 6px;
  display: grid;
  grid-template-columns: 2fr 3fr;
}
.error__item__title {
  justify-self: start;
  align-self: center;
  text-align: start;
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
