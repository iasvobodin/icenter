<template>
<div v-if="showMenu" class="navigation">
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
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.showMenu = false
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
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
  background-color: rgb(248, 248, 248);
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
  border: 1px solid black;
  border-radius: 4px;
  width: 90%;
  margin: auto;
  margin-top: 10px;
}
li:hover{
  background-color: #fff;
}
a{
text-decoration-line: none;
color: #2c3e50;
text-decoration-color: black;
line-height: 30px;
}
a.router-link-exact-active {
  color: #42b983;
}
</style>
