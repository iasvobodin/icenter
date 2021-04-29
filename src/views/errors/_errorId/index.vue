<template>
  <div class="cabinet">
    <div>
      <h1>{{ $route.params.errorId }}</h1>
      <br />
    </div>
    <div v-if="error" class="cabinet__info">
      <section class="information">
        <div
          v-for="(val, key, index) in error.info"
          :key="index"
          class="cabinet__info__item"
        >
          <h3>{{ key }}:</h3>
          <p>{{ val }}</p>
        </div>
      </section>
      <section v-if="!changeInfo" class="eror__body">
        <div
          v-show="Object.values(val)[1] && !key.startsWith('_')"
          v-for="(val, key, index) in error.body"
          :key="index"
        >
          <h2>{{ key }}</h2>
          <div class="cabinet__info__item" v-for="(v, k, i) in val" :key="i">
            <h3>{{ k }}:</h3>
            <p>{{ v }}</p>
          </div>
        </div>
      </section>
      <section v-else class="mod__error__body">
        <form @submit.prevent="updateErorData" id="errorData">
          <div
            v-for="(value, key, index) in $store.state.template.error[
              error.type
            ]"
            :key="index"
          >
            <section v-if="returnRender(key)">
              <h3>Статус ошибки: {{ key }}</h3>
              <conditional-render
                v-model="error.body[key]"
                :dataRender="value"
              />
            </section>
          </div>
        </form>
      </section>
    </div>
    <div v-else class="loading" />
    <p v-if="errorIsNotDef">{{ errorIsNotDef }}</p>
  </div>

  <button
    v-if="
      error &&
      !changeInfo &&
      error.info.Добавил === $store.state.user.info.userDetails
    "
    @click="changeData"
  >
    Редактировать
  </button>
  <button @click="statusConfirmed = !statusConfirmed">
    Подтвердить ошибку
  </button>
  <button v-if="statusConfirmed" @click="statusClosed = !statusClosed">
    Закрыть ошибку
  </button>
  <button v-if="changeInfo" type="submit" form="errorData">
    Сохранить изменения
  </button>
</template>

<script>
import conditionalRender from "@/components/conditionalRender";
export default {
  data() {
    return {
      statusConfirmed: false,
      statusClosed: false,
      closeError: null,
      dataModel: null,
      changeInfo: false,
      error: null,
      errorIsNotDef: null,
      errorTemplate: null,
      test: null,
    };
  },
  components: {
    conditionalRender,
  },
  methods: {
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
    changeData() {
      this.changeInfo = !this.changeInfo;
    },
    async updateErorData() {
      const err = await this.getCurrentError();
      const updateErorBody = {
        id: this.error.id,
        info: this.error.info,
        status: Object.values(this.error.body.Устранено)[0]
          ? "closed"
          : Object.values(this.error.body.Принято)[0]
          ? "confirmed"
          : "open",
        type: this.error.type,
        body: [
          ...err.body,
          {
            ...this.error.body,
            _changed: sessionStorage.getItem("userDetails").toLowerCase(),
            _time: `${Date.now()}`,
          },
        ],
      };
      const openError = {
        id: this.error.id,
        info: {
          ...this.error.info,
          Описание: this.error.body.Открыто["Описание"],
        },
        type: "error",
        status: updateErorBody.status,
        ttl: 6000,
      };

      if (
        err.status != updateErorBody.status ||
        updateErorBody.status === "closed"
      ) {
        console.log("comparestatus");
        await fetch("/api/POST_openError", {
          method: "POST", // или 'PUT'
          body: JSON.stringify({ id: err.id, status: err.status, ttl: 1 }),
        });
      }
      // console.log(updateErorBody);
      try {
        await fetch("/api/POST_error", {
          method: "POST", // или 'PUT'
          body: JSON.stringify({ ...updateErorBody }),
        });
        if (updateErorBody.status === "closed") {
          return;
        }
        await fetch("/api/POST_openError", {
          method: "POST", // или 'PUT'
          body: JSON.stringify({ ...openError }),
        });
      } finally {
        this.changeInfo = !this.changeInfo;
      }
    },
    async getCurrentError() {
      try {
        const responsError = await fetch(
          `/api/errors/${this.$route.params.errorId}`
        );
        const error = await responsError.json();
        // this.$store.commit("SETERROR", error);
        if (!responsError.ok) {
          this.errorIsNotDef = "Данной ошибки не существует";
          console.log("Данной ошибки не существует");
        }

        return error;
      } catch (error) {
        this.errorIsNotDef = "Данной ошибки не существует";
        console.log("errors is not def", error);
      }
    },
    // stageSort(o) {
    //   return Object.keys(o)
    //     .sort((a, b) => b[0] - a[0])
    //     .reduce((r, k) => ((r[k] = o[k]), r), {});
    // },
    // async sendFile() {
    //   const formData = new FormData();
    //   const fileField = document.querySelector('input[type="file"]');

    //   // formData.append('username', 'abc123');
    //   formData.append("photo", fileField.files[0]);

    //   try {
    //     const response = await fetch("/api/blob", {
    //       method: "POST",
    //       body: formData,
    //     });
    //     const result = await response.json();
    //     console.log("Успех:", JSON.stringify(result));
    //   } catch (error) {
    //     console.error("Ошибка:", error);
    //   }
    // },
  },

  async created() {
    this.error = await this.getCurrentError();
    this.error.body = this.error.body[this.error.body.length - 1];
    console.log("here");
  },
};
</script>

<style lang="css" scoped>
.description__area {
  width: inherit;
}
.loading {
  margin: auto;
  width: 30px;
  height: 30px;
  background: url(/img/loading.gif) no-repeat center bottom;
}
p {
  font-size: 16px;
}
h3 {
  margin: 5px;
}
.cabinet {
  border: 1px solid orange;
  border-radius: 4px;
  margin: auto;
  margin-top: 1vh;
  margin-bottom: 1vh;
  width: min(95vw, 600px);
  padding: 10px;
  box-sizing: border-box;
}
h1 {
  margin: 10px;
}
h2 {
  margin: 7px;
}
.cabinet__info {
  /* width: min(95vw, 400px); */
  width: 100%;
  box-sizing: border-box;
  margin: auto;
}
.cabinet__info__desc {
  /* border-bottom: 1px solid black; */
  padding: 5px;
  /* width: 100%; */
}
.cabinet__info__desc > h3 {
  margin-top: 1vh;
  margin-bottom: 1vh;
}
.cabinet__info__item {
  border-bottom: 1px solid black;
  padding: 5px;
  /* width: 100%; */
  display: grid;
  grid-template-columns: 1fr 4fr;
}
.cabinet__info__item > h3 {
  justify-self: start;
  align-self: center;
  text-align: start;
}
.cabinet__info__item > p {
  justify-self: end;
  text-align: end;
  align-self: center;
}
.cabinet__info__item > select {
  justify-self: end;
  text-align: end;
  align-self: center;
}
.error__item__desc {
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
}
.error__item__vertical__title {
  text-align: center;
  margin: 5px;
}
.error__item__vertical__desc {
  padding: 5px;
  text-align: start;
}
</style>
