<template>
  <div v-if="showMenu" v-click-away="onClickAway" class="navigation">
    <nav>
      <ul>
        <li> 
          <router-link :to="`/projects`">Проекты</router-link>
        </li>
        <li>
          <router-link :to="`/cabinets`">Шкафы</router-link>
        </li>
        <li>
          <router-link :to="`/errors`">Ошибки</router-link>
        </li>
        <li>
          <router-link :to="`/tasks`">Задачи</router-link>
        </li>
        <li>
          <router-link :to="`/cabtimes`">CabTimes</router-link>
        </li>
        <li>
          <router-link :to="`/admin/reports`">Отчёты</router-link>
        </li>
      </ul>
    </nav>
  </div>
  <img
    class="menu_button"
    src="/img/menu.svg"
    alt=""
    @click="showMenu = !showMenu"
  />
  <!-- <button class="menu_button" @click="showMenu = !showMenu">{{!showMenu?'Menu':'Close'}}</button> -->
</template>

<script>
export default {
  data() {
    return {
      showMenu: false,
    }
  },
  created() {
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
  methods: {
    onClickAway(event) {
      this.showMenu = false
      // console.log(event);
    },
  },
}
</script>

<style lang="css" scoped>
.menu_button {
  position: absolute;
  top: 5px;
  height: 40px;
  right: 10px;
  z-index: 4;
  cursor: pointer;
}
.navigation {
  /* background-color: rgb(0, 162, 255); */
  width: 250px;
  display: block;
  position: fixed;
  right: 0px;
  top: 0px;
  /* height: 100vh; */
  z-index: 2;
}
ul {
  margin: 0;
  padding: 0;
  margin-top: 50px;
  padding: 0px 3px;
  border: 1px solid #14161c;
  background-color: #004481;
  border-radius: 4px;
  box-shadow: inset 0px 2px 3px 0px rgb(0 0 0 / 40%),
    0px 1px 2px 0px rgb(255 255 255 / 20%);
}
li {
  display: block;
  cursor: pointer;
  /* height: 40px; */
  border-bottom: 1px solid #292d38;
  /* border-radius: 4px; */
  margin: auto;
  /* margin-top: 10px; */
}
li:hover {
  background-color: #003768;
}
a {
  width: 100%;
  display: block;
  text-decoration-line: none;
  color: #ffffff;
  text-decoration-color: rgb(255, 255, 255);
  line-height: 40px;
}
a.router-link-exact-active {
  color: orange;
}
</style>
