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
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 4;
}
.navigation {
  /* background-color: rgb(0, 162, 255); */
  width: 250px;
  display: block;
  position: fixed;
  right: 0px;
  top: 0px;
  height: 100vh;
  z-index: 2;
}
ul{
  margin: 0;
  padding: 0;
  margin-top: 50px;
      padding: 0px 3px;
      border: 1px solid #14161C;
    background-color: #3b3f4d;
    border-radius: 4px;
      box-shadow: inset 0px 2px 3px 0px rgb(0 0 0 / 40%), 0px 1px 2px 0px rgb(255 255 255 / 20%);
}
li {
  display: block;
  /* height: 40px; */
      border-bottom: 1px solid #292D38;
  /* border-radius: 4px; */
  margin: auto;
  /* margin-top: 10px; */
}
li:hover{
    background-color: #3b414d;
}
a{
text-decoration-line: none;
color: #ffffff;
text-decoration-color: rgb(255, 255, 255);
line-height: 40px;
}
a.router-link-exact-active {
  color: #42b983;
}
</style>
