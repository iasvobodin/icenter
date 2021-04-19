<template>
  <div class="cabinet">
    <div>
      <h1>{{ $route.params.errorID }}</h1>
    </div>
    <br />
    <!-- <span v-if="!changeInfo">{{ value }}</span>
      <input v-else v-model="message[key]" :placeholder="value" /> -->
    <div v-if="error" class="cabinet__info">
      <div class="cabinet__info__item">
        <h3>Проект:</h3>
        <p>
          {{ error["project number"] }}
        </p>
      </div>
      <div class="cabinet__info__item">
        <h3>Шкаф:</h3>
        <p>
          {{ error["cab name"] }}
        </p>
      </div>
      <div class="cabinet__info__item">
        <h3>Ошибку добавил:</h3>
        <p>
          {{ error.fitter }}
        </p>
      </div>
      <div class="cabinet__info__item">
        <h3>Мастер проекта:</h3>
        <p>
          {{ error["senior fitter"] }}
        </p>
      </div>
      <div class="cabinet__info__item">
        <h3>Статус:</h3>
        <p>
          {{ error["status"] }}
        </p>
      </div>
      <div  style="border: 1px solid red; margin: 5px; padding: 5px;">

      <h2 v-if="changeInfo" >Открыто</h2>
      <div class="cabinet__info__item" >
        <h3>Тип ошибки:</h3>
        <p v-if="!changeInfo">
          {{ error.body["Тип ошибки"] }}
        </p>
        <select v-else v-model="errorBody['Тип ошибки']">
          <option
            v-for="(opt, index) in $store.state.template.error.stage1[
              'Тип ошибки'
            ]"
            :key="index"
          >
            {{ opt }}
          </option>
        </select>
      </div>
      <div class="description__area" >
        <h3>Описание</h3>
        <p v-if="!changeInfo">
          {{ error.body.Описание }}
        </p>
        <textarea rows="6" v-else v-model="error.body.Описание" />
      </div>
      </div>

      <div
      style="border: 1px solid yellow; margin: 5px; padding: 5px;"
        v-if="
          changeInfo &&
          error.stage === 1 &&
          error['senior fitter'] === $store.state.user.authInfo.userDetails
        "
      >
        <h2>Утверждено</h2>
        <div
         :class="{ cabinet__info__item : typeof value === 'object' }"
          v-for="(value, key, index) in $store.state.template.error.stage2"
          :key="index"
        >
          <h3>{{ key }}</h3>
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
            v-model="errorBody[`${key} 2`]"
            cols="50"
            rows="6"
          ></textarea>
        </div>
      </div>
      <div style="border: 1px solid green; margin: 5px; padding: 5px;"
        v-if="
          changeInfo &&
          error['senior fitter'] === $store.state.user.authInfo.userDetails
        "
      >
        <h2>Закрыто</h2>
        <div
          :class="{ cabinet__info__item : typeof value === 'object' }"
          v-for="(value, key, index) in $store.state.template.error.stage3"
          :key="index"
        >
          <h3>{{ key }}</h3>
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
            v-model="errorBody[`${key} 3`]"
            cols="50"
            rows="6"
          ></textarea>
        </div>
      </div>
    </div>
    <div v-else class="loading" />
    <p v-if="errorIsNotDef">{{ errorIsNotDef }}</p>
  </div>

  <button @click="changeInfo = !changeInfo">Редактировать</button>
</template>

<script>
export default {
  // setup
  data() {
    return {
      errorBody: {},
      changeInfo: false,
      error: null,
      errorIsNotDef: null,
      errorTemplate: null,
    };
  },
  async mounted() {
    try {
      if (!this.errorTemplate) {
        this.errorTemplate = await (
          await fetch("/api/templates/templateProject/ver1")
        ).json();
      }
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    async sendFile() {
      const formData = new FormData();
      const fileField = document.querySelector('input[type="file"]');

      // formData.append('username', 'abc123');
      formData.append("photo", fileField.files[0]);

      try {
        const response = await fetch("/api/blob", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        console.log("Успех:", JSON.stringify(result));
      } catch (error) {
        console.error("Ошибка:", error);
      }
    },
    async getUserErrors() {
      // console.log(this.$route.params.errorID);
      try {
        const responsError = await fetch(
          `/api/errors/${this.$route.params.errorID}`
        );
        if (!responsError.ok) {
          this.errorIsNotDef = "Данной ошибки не существует";
          console.log("error is not exist");
        }
        try {
          this.error = await responsError.json();
        } catch (error) {
          console.error("this.errors.json", error.message);
        }
      } catch (error) {
        console.log("errors is not def", error);
      }
    },
  },

  created() {
    this.getUserErrors();
    !this.$store.state.template && this.$store.dispatch("GET_template");
  },
};
</script>

<style lang="css" scoped>
.description__area{
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
  width: min(95vw, 500px);
  padding: 10px;
  box-sizing: border-box;
}
h1 {
  margin: 10px;
}
h2{
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
  grid-template-columns: 2fr 3fr;
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
