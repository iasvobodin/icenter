<template>
  <div>
    <h1>{{ $route.params.errorID }}</h1>
  </div>
<input type="file"> <button @click="sendFile" >send</button>
<br>
  <div v-if="error">
       <p>Проект: {{ error["project number"] }}</p>
    <p>Шкаф: {{ error["cab name"] }}</p>
    <p>Ошибку добавил: {{ error.fitter }}</p>
    <p>Мастер проекта: {{ error["senior fitter"] }}</p>
    <p>Статус {{ error["status"] }}</p>
    <p>Тип ошибки - {{ error.body["Тип ошибки"] }}</p>
    <p>Описание {{ error.body.Описание }}</p>
    <p v-if="error.stage === 1">
      Мастеру проекта необходимо изменить статус ошибки
    </p>
  </div>

   <!-- <div v-for="(value, key, index) in error" :key="index">
     <p>{{ key }} {{ value }}</p> 
  </div>  -->
  <p v-if="errorIsNotDef">{{ errorIsNotDef }}</p>
  <div
    v-if="
      error && error['senior fitter'] === $store.state.user.authInfo.userDetails
    "
  >
    You are master
  </div>
  <div
    v-if="
      error && error['fitter'] === $store.state.user.authInfo.userDetails
    "
  >
    You are fitter
  </div>
  <p v-if="errorIsNotDef">{{ errorIsNotDef }}</p>
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
formData.append('photo', fileField.files[0]);

try {
  const response = await fetch('/api/blob', {
    method: 'POST',
    body: formData
  });
  const result = await response.json();
  console.log('Успех:', JSON.stringify(result));
} catch (error) {
  console.error('Ошибка:', error);
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

<style lang="scss" scoped></style>
