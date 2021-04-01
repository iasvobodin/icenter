<template>
  <div>
    <h4>Номер проекта : {{ projectNumber }}</h4>
    <h4>Название проекта : {{ projectName }}</h4>
    <h4>Номер WO : {{ cabinetWo }}</h4>
    <h4>Название шкафа : {{ cabinetName }}</h4>
  </div>
  <div>
    <h2>Статус шкафа</h2>
    <p>Данный блок в разработке</p>
  </div>
  <div>
    <button @click="error = !error">Добавить ошибку</button>
    <set-error v-if="error" />
    <!-- <button>Запустить задачу</button> -->
  </div>
</template>

<script>
import setError from "@/components/setError";
export default {
  data() {
    return {
      error: false
    };
  },
  components: {
    setError
  },
  props: {
    projectNumber: {
      type: String,
      default: "t"
    },
    projectName: {
      type: String,
      default: "t"
    },
    cabinetWo: {
      type: String,
      default: "t"
    },
    cabinetName: {
      type: String,
      default: "t"
    }
  }
};
</script>

<style lang="css" scoped></style>
