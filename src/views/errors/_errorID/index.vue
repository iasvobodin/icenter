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
          <p>
            {{ val }}
          </p>
        </div>
      </section>
      <section v-if="!changeInfo" class="eror__body">
        <div
          v-show="Object.values(val)[0]"
          v-for="(val, key, index) in dataModel"
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
          <div>
            <h2>Открыто</h2>
            <div class="cabinet__info__item">
              <h3>
                {{ Object.keys($store.state.template.error.body.Открыто)[0] }}:
              </h3>
              <select
                form="errorData"
                required
                v-model="dataModel.Открыто['Тип ошибки']"
              >
                <option
                  v-for="(opt, index) in $store.state.template.error.body
                    .Открыто['Тип ошибки']"
                  :key="index"
                >
                  {{ opt }}
                </option>
              </select>
            </div>
            <div class="cabinet__info__item">
              <h3>
                {{ Object.keys($store.state.template.error.body.Открыто)[1] }}:
              </h3>
              <textarea
                required
                v-model="dataModel.Открыто['Описание']"
                cols="50"
                rows="6"
              ></textarea>
            </div>
          </div>
          <div v-if="error.info.Мастер === $store.state.user.info.userDetails">
            <h2>Принято</h2>
            <div class="cabinet__info__item">
              <h3>
                {{ Object.keys($store.state.template.error.body.Принято)[0] }}:
              </h3>
              <select required v-model="dataModel.Принято['Статус решения']">
                <option
                  v-for="(opt, index) in $store.state.template.error.body
                    .Принято['Статус решения']"
                  :key="index"
                >
                  {{ opt }}
                </option>
              </select>
            </div>
            <div class="cabinet__info__item">
              <h3>
                {{ Object.keys($store.state.template.error.body.Принято)[1] }}:
              </h3>
              <textarea
                required
                form="errorData"
                v-model="dataModel.Принято['Описание']"
                cols="50"
                rows="6"
              ></textarea>
            </div>
          </div>
          <div v-if="dataModel.Принято['Описание']">
            <h2>Устранено</h2>
            <div class="cabinet__info__item">
              <h3>
                {{
                  Object.keys($store.state.template.error.body.Устранено)[0]
                }}:
              </h3>
              <select
                required
                v-model="dataModel.Устранено['Статус коррекции']"
              >
                <option
                  v-for="(opt, index) in $store.state.template.error.body
                    .Устранено['Статус коррекции']"
                  :key="index"
                >
                  {{ opt }}
                </option>
              </select>
            </div>
            <div class="cabinet__info__item">
              <h3>
                {{
                  Object.keys($store.state.template.error.body.Устранено)[1]
                }}:
              </h3>
              <textarea
                required
                v-model="dataModel.Устранено['Описание']"
                cols="50"
                rows="6"
              ></textarea>
            </div>
            <div class="cabinet__info__item">
              <h3>
                {{
                  Object.keys($store.state.template.error.body.Устранено)[2]
                }}:
              </h3>
              <input
                type="number"
                required
                v-model="dataModel.Устранено['Время на устранение']"
              />
            </div>
          </div>
        </form>
      </section>
    </div>
    <div v-else class="loading" />
    <p v-if="errorIsNotDef">{{ errorIsNotDef }}</p>
  </div>

  <button @click="changeData">Редактировать</button>
  <button type="submit" form="errorData">Обновить</button>
</template>

<script>
export default {
  data() {
    return {
      openType: null,
      openDesc: null,
      confirmedType: null,
      confirmedDesc: null,
      closedType: null,
      closedDesc: null,
      dataModel: null,
      modifiedErrorBody: {
        Открыто: {
          "Тип ошибки": "",
          Описание: "",
        },
        Принято: {
          "Статус решения": "",
          Описание: "",
        },
        Устранено: {
          "Статус коррекции": "",
          Описание: "",
          "Время на устранение": "",
        },
      },
      changeInfo: false,
      error: null,
      errorIsNotDef: null,
      errorTemplate: null,
      test: null,
    };
  },
  methods: {
    changeData() {
      this.changeInfo = !this.changeInfo;
    },
    async updateErorData() {
      const updateErorBody = {
        id: this.$store.state.currentError.id,
        status: Object.values(this.modifiedErrorBody.stage2)[0]
          ? "confirmed"
          : Object.values(this.modifiedErrorBody.stage3)[0]
          ? "closed"
          : "open",
        info: this.$store.state.currentError.info,
        body: []
          .push(this.$store.state.currentError.body)
          .push(this.modifiedErrorBody), // this.error.push(this.modifiedErrorBody),
      };
      console.log(updateErorBody);
      try {
        await fetch("/api/POST_error", {
          method: "POST", // или 'PUT'
          body: JSON.stringify({ ...updateErorBody }),
        });
      } finally {
        this.changeInfo = !this.changeInfo;
      }
    },
    async getUserErrors() {
      try {
        const responsError = await fetch(
          `/api/errors/${this.$route.params.errorId}`
        );
        const error = await responsError.json();
        this.$store.commit("SETERROR", error);
        if (!responsError.ok) {
          this.errorIsNotDef = "Данной ошибки не существует";
        }
        // this.modifiedErrorBody = error.body[error.body.length - 1];
        this.error = error;

        //         for (const prop of Object.getOwnPropertyNames(this.$store.state.template.error.body)) {
        //   delete this.$store.state.template.error.body[prop];
        // }
        //  console.log(typeof this.$store.state.template.error.body);// this.$store.state.template.error.body
        this.dataModel = {
          ...this.modifiedErrorBody,
          ...error.body[error.body.length - 1],
        };
        //  {
        //   ...this.modifiedErrorBody,
        //   ...error.body[error.body.length - 1],
        // };
      } catch (error) {
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

  created() {
    this.getUserErrors();
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
</style>
