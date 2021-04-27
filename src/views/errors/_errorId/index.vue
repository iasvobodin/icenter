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
            class="error__field"
            v-for="(value, key, index) in $store.state.template.error.body2"
            :key="index"
          >
            <h2>{{ key }}</h2>
            <div class="error__item__desc" v-for="(v, k, i) in value" :key="i">
              <h3 class="error__item__vertical__title">{{ k }}</h3>
              <select
                v-model="error.body[key][k]"
                v-if="Object.values(v)[0] === 'select'"
                name=""
                id=""
              >
                <option v-for="(j, k) in Object.values(v)[1]" :key="k">
                  {{ j }}
                </option>
              </select>
              <input
                v-model="error.body[key][k]"
                v-if="Object.values(v)[0] === 'checkbox'"
                type="checkbox"
              />
              <input
                v-model="error.body[key][k]"
                v-if="Object.values(v)[0] === 'number'"
                type="number"
              />
              <textarea
                v-model="error.body[key][k]"
                v-if="Object.values(v)[0] === 'textarea'"
                name=""
                id=""
                cols="30"
                rows="5"
              ></textarea>
            </div>
          </div>
        </form>
        <!-- <form @submit.prevent="updateErorData" id="errorData">
          <div>
            <h2>Открыто</h2>
            <div class="cabinet__info__item">
              <h3>
                {{ Object.keys($store.state.template.error.body.Открыто)[0] }}:
              </h3>
              <select
                form="errorData"
                required
                v-model="error.body.Открыто['Тип ошибки']"
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
            <div class="error__item__desc">
              <h3 class="error__item__vertical__title">
                {{ Object.keys($store.state.template.error.body.Открыто)[1] }}:
              </h3>
              <textarea
                class="error__item__vertical__desc"
                required
                v-model="error.body.Открыто['Описание']"
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
              <select required v-model="error.body.Принято['Статус решения']">
                <option
                  v-for="(opt, index) in $store.state.template.error.body
                    .Принято['Статус решения']"
                  :key="index"
                >
                  {{ opt }}
                </option>
              </select>
            </div>
            <div class="error__item__desc">
              <h3 class="error__item__vertical__title">
                {{ Object.keys($store.state.template.error.body.Принято)[1] }}:
              </h3>
              <textarea
                required
                form="errorData"
                v-model="error.body.Принято['Описание']"
                cols="50"
                rows="6"
              ></textarea>
            </div>
          </div>
       
          <div v-else-if="error.body.Принято['Описание']">
            <h2>Принято</h2>
            <div class="cabinet__info__item">
              <h3>
                {{ Object.keys($store.state.template.error.body.Принято)[0] }}:
              </h3>
              <select
                disabled
                required
                v-model="error.body.Принято['Статус решения']"
              >
                <option
                  v-for="(opt, index) in $store.state.template.error.body
                    .Принято['Статус решения']"
                  :key="index"
                >
                  {{ opt }}
                </option>
              </select>
            </div>
            <div class="error__item__desc">
              <h3 class="error__item__vertical__title">
                {{ Object.keys($store.state.template.error.body.Принято)[1] }}:
              </h3>
              <textarea
                disabled
                required
                form="errorData"
                v-model="error.body.Принято['Описание']"
                cols="50"
                rows="6"
              ></textarea>
            </div>
          </div>
          <div v-if="closeError">
            <h2>Устранено</h2>
            <div class="cabinet__info__item">
              <h3>
                {{
                  Object.keys($store.state.template.error.body.Устранено)[0]
                }}:
              </h3>
              <select
                required
                v-model="error.body.Устранено['Статус коррекции']"
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
            <div class="error__item__desc">
              <h3 class="error__item__vertical__title">
                {{
                  Object.keys($store.state.template.error.body.Устранено)[1]
                }}:
              </h3>
              <textarea
                required
                v-model="error.body.Устранено['Описание']"
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
                v-model="error.body.Устранено['Время на устранение']"
              />
            </div>
          </div>
        </form> -->
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
  <button
    v-if="!closeError && changeInfo && error.body.Принято['Описание']"
    @click="closeError = !closeError"
  >
    Закрыть ошибку
  </button>
  <button v-if="changeInfo" type="submit" form="errorData">
    Сохранить изменения
  </button>
</template>

<script>
export default {
  data() {
    return {
      closeError: null,
      dataModel: null,
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
      const err = await this.getCurrentError();
      const updateErorBody = {
        id: this.error.id,
        status: Object.values(this.error.body.Устранено)[0]
          ? "closed"
          : Object.values(this.error.body.Принято)[0]
          ? "confirmed"
          : "open",
        info: this.error.info,
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
