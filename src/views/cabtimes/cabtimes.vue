<template>
  <div>
    <h1>Раздел CabTime в разработке</h1>
          <router-link to="/cabtimes/addnewcabtime">
<img class="add__button" src="/img/add.svg" alt="Добавить новый CabTime">
</router-link>
  </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="css" scoped>
.add__button{
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>