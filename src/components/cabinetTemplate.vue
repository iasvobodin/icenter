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
    <button>Добавить ошибку</button>
    <button>Запустить задачу</button>
  </div>
</template>

<script>
export default {
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
