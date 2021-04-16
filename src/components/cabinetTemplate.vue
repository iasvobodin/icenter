<template>
  <div class="cabinet">
    <h3>Информация по выбранному шкафу</h3>
    <div class="cabinet__info">
      <div class="cabinet__info__item">
        <h4>Номер проекта:</h4>
        <p>
          {{ $store.state.projectInfo["project number"] }}
        </p>
      </div>
      <div class="cabinet__info__item">
        <h4>Название проекта:</h4>
        <p>
          {{ $store.state.projectInfo["project name"] }}
        </p>
      </div>
      <div class="cabinet__info__item">
        <h4>Номер WO:</h4>
        <p>
          {{ $store.state.projectInfo.wo }}
        </p>
      </div>
      <div class="cabinet__info__item">
        <h4>Название шкафа:</h4>
        <p>
          {{ $store.state.projectInfo["cab name"] }}
        </p>
      </div>
    </div>
  </div>

  <!-- <div>
    <h2>Статус шкафа</h2>
    <p>Данный блок в разработке</p>
  </div> -->
  <div>
    <!-- <button @click="error = !error">Добавить ошибку</button> -->
    <set-error />
    <!-- <button>Запустить задачу</button> -->
  </div>
</template>

<script>
import setError from "@/components/setError";
export default {
  data() {
    return {
      error: false,
    };
  },
  components: {
    setError,
  },
  props: {
    projectNumber: {
      type: String,
      default: "t",
    },
    projectName: {
      type: String,
      default: "t",
    },
    cabinetWo: {
      type: String,
      default: "t",
    },
    cabinetName: {
      type: String,
      default: "t",
    },
  },
};
</script>

<style lang="css" scoped>
div{
  box-sizing: border-box;
}
.cabinet{
  border: 1px solid orange;
  border-radius: 4px;
  margin: auto;
  margin-top: 1vh;
  margin-bottom: 1vh;
  width: min(95vw, 400px);
  padding: 10px;
  box-sizing: border-box;
}
h3{
  margin: 10px;
}
.cabinet__info {
  width: 100%;
  /* width: min(95vw, 400px); */
  margin: auto;
}
.cabinet__info__item {
  padding: 5px;
  width: 100%;
  display: grid;
  border-bottom: 1px solid black;
  grid-template-columns: 2fr 3fr;
}
.cabinet__info__item > h4 {
  justify-self: start;
  align-self: center;
  text-align: start;
}
.cabinet__info__item > p {
  justify-self: end;
  text-align: end;
  align-self: center;
}
</style>
