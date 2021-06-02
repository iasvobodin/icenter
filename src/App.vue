<template>
  <app-header />
<div id="view">
  <router-view  />
</div>
  <loader />
</template>


<script>
import loader from '@/components/loader.vue'
import appHeader from "@/components/header.vue";
// import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
// import { ref } from "vue";
export default {
  components: {
    loader,appHeader
  },
  //   beforeRouteEnter (to, from, next) {
  //     // return false
  //     console.log('here');
  //     next({name: 'login'})
  // // next(vm => {
  // //   console.log(vm, 'vm');
  // //   // access to component public instance via `vm`
  // // })
  // },
  // setup() {
  //   // same as beforeRouteLeave option with no access to `this`
  //   onBeforeRouteLeave((to, from) => {
  //     const answer = window.confirm(
  //       "Do you really want to leave? you have unsaved changes!"
  //     );
  //     // cancel the navigation and stay on the same page
  //     if (!answer) return false;
  //   });

  //   const userData = ref();

  //   // same as beforeRouteUpdate option with no access to `this`
  //   onBeforeRouteUpdate(async (to, from) => {
  //     // only fetch the user if the id changed as maybe only the query or the hash changed
  //     if (to.params.id !== from.params.id) {
  //       userData.value = await fetchUser(to.params.id);
  //     }
  //   });
  // },
  // beforeRouteEnter(to, from) {
  //   console.log("beforeRouteEnter");
  //   // called before the route that renders this component is confirmed.
  //   // does NOT have access to `this` component instance,
  //   // because it has not been created yet when this guard is called!
  // },
  mounted() {
    this.$store.state.user.body&&document.documentElement.style.setProperty('--bg', `${this.$store.state.user.body.bg}`);
    // console.log(this.$store.state.user.body.bg,'!!!!!!!!!!!');
    function formatDate(date) {
      return (
        date.getDate() +
        '/' +
        '0' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes()
      )
    }
    const dd = new Date()
    console.log(formatDate(dd))
  },
  created() {
      const user = window.localStorage.getItem("user")
      // console.log(user, 'user');
  if (user) {
      this.$store.commit('setUserAuth', user)
    } else{
      console.log('not user');
      this.$store.dispatch('GET_auth')
    }
    // !this.$store.state.user.info && this.$store.dispatch('GET_auth')
    !this.$store.state.template && this.$store.dispatch('GET_template')
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400&display=swap');
*,
*:before,
*:after {
  box-sizing: border-box;
}
html{
  height: 100%;
}
body{
  width: 100%; 
  min-height: 100%;
  background: var(--bg);
}
button,
input[type='submit'] {
  height: 40px;
  background-color: #ffffff;
  /* border: none; */
  /* color: white; */
  /* padding: 15px 32px; */
  border: 1px solid rgb(0, 140, 255);
  border-radius: 3px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  box-sizing: border-box;
  font-size: 16px;
}
/* ::-webkit-file-upload-button{
  background-image: url('/img/add__image.svg');
  background-repeat: no-repeat;
} */
input[type='submit']:hover {
  background-color: #00a2ff5b;
}
button:hover {
  background-color: #00a2ff5b;
}
h4 {
  margin: 0;
}
h2{
  margin: 1vh;
}
p {
  margin: 0;
}
select {
  height: 30px;
  width: 100%;
}
textarea {
  /* height: 30px; */
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100vh;
    /* position: relative; */
}

#nav {
  padding: 30px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Roboto Slab', serif;
  font-weight: normal;
}
body{
  margin: 0;
}
/* #app{

} */
</style>