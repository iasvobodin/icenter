<template>
<div @mouseleave="showMenu = !showMenu" v-if="showMenu" class="navigation">

  <nav >
    <ul>
      <li>
        <router-link :to="`/admin/profile`">Личный кабинет</router-link>
      </li>
      <li>
        <router-link :to="`/admin/reports`">Отчёты</router-link>
      </li>
      <li>
        <router-link :to="`/admin/addproject`">Добавить проект</router-link>
      </li>
      <li>
        <router-link :to="`/admin/addcabtime`">Расчёт CabTime</router-link>
      </li>
      <li>
        <router-link :to="`/errors`">Ошибки</router-link>
      </li>
      <li>
        <router-link :to="`/tasks`">Задачи</router-link>
      </li>
      <li>
        <router-link :to="`/projects`">Проекты</router-link>
      </li>
      <li>
        <router-link :to="`/cabinets`">Шкафы</router-link>
      </li>
      <li>
        <router-link :to="`/cabtimes`">CabTimes</router-link>
      </li>
    </ul>
  </nav>
</div>
<button class="menu_button" @click="showMenu = !showMenu">{{!showMenu?'Menu':'Close'}}</button>

</template>

<script>
export default {
data() {
  return {
    showMenu: false
  }
},
};
</script>

<style lang="css" scoped>
.menu_button{
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 2px;
}
.navigation {
  background-color: rgb(221, 221, 221);
  width: 250px;
  display: block;
  position: fixed;
  right: 0px;
  top: 0px;
  height: 100vh;
}
ul{
  margin: 0;
  padding: 0;
  margin-top: 10vh;
}
li {
  display: block;
  height: 30px;
}
</style>
