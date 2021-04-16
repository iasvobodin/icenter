<template>
 <div class="cabinet">
  <div>
    <h1>{{ $route.params.errorID }}</h1>
  </div>
  <br />
     <div v-if="error" class="cabinet__info">
      <div class="cabinet__info__item">
        <h4>Проект:</h4>
        <p>
{{ error["project number"] }}
        </p>
      </div>
      <div class="cabinet__info__item">
        <h4>Шкаф:</h4>
        <p>
 {{ error["cab name"] }}
        </p>
      </div>
      <div class="cabinet__info__item">
        <h4>Ошибку добавил:</h4>
        <p>
{{ error.fitter }}
        </p>
      </div>
      <div class="cabinet__info__item">
        <h4>Мастер проекта:</h4>
        <p>
{{ error["senior fitter"] }}
        </p>
      </div>
        <div class="cabinet__info__item">
        <h4>Статус:</h4>
        <p>
{{ error["status"] }}
        </p>
      </div>
        <div class="cabinet__info__item">
        <h4>Тип ошибки -</h4>
        <p>
{{ error.body["Тип ошибки"] }}
        </p>
      </div>
            <div class="cabinet__info__item">
        <h4>Описание</h4>
        <p>
 {{ error.body.Описание }}
        </p>
      </div>
    </div>
  <!-- <div v-if="error">
    <p>Проект: </p>
    <p>Шкаф:</p>
    <p>Ошибку добавил: </p>
    <p>Мастер проекта: </p>
    <p>Статус </p>
    <p>Тип ошибки - </p>
    <p>Описание</p>
    <p v-if="error.stage === 1">
      Мастеру проекта необходимо изменить статус ошибки
    </p>
  </div> -->

  <!-- <div v-for="(value, key, index) in error" :key="index">
     <p>{{ key }} {{ value }}</p> 
  </div>  -->
  <p v-if="errorIsNotDef">{{ errorIsNotDef }}</p>
  <!-- <div
    v-if="
      error && error['senior fitter'] === $store.state.user.authInfo.userDetails
    "
  >
    You are master
  </div>
  <div
    v-if="error && error['fitter'] === $store.state.user.authInfo.userDetails"
  >
    You are fitter
  </div>
  <p v-if="errorIsNotDef">{{ errorIsNotDef }}</p>-->
   </div> 
</template>

<script>
export default {
  // setup
  data() {
    return {
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
  },
};
</script>

<style lang="css" scoped>
.cabinet{
  border: 1px solid orange;
  border-radius: 4px;
  margin: auto;
  margin-top: 1vh;
  margin-bottom: 1vh;
  width: min(95vw, 500px);
  padding: 10px;
  box-sizing: border-box;
}
h1{
  margin: 10px;
}
.cabinet__info {
  /* width: min(95vw, 400px); */
  margin: auto;
}
.cabinet__info__item {
  border-bottom: 1px solid black;
  padding: 5px;
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 3fr;
}
.cabinet__info__item > h4 {
  justify-self: start;
  align-self: center;
  text-align: start;
}
.cabinet__info__item > p {
  justify-self: end;
  text-align: start;
  align-self: center;
}</style>
