<template>
  <app-header v-if="match()" />
<div id="view">
  <router-view  />
</div>
  <loader />
</template>


<script>
import loader from '@/components/loader.vue'
import appHeader from "@/components/header.vue";
import * as signalR from '@microsoft/signalr'
// import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
// import { ref } from "vue";
export default {
  components: {
    loader,
    appHeader
  },
  methods: {
    match() {
      if (this.$route.path.includes('role')) {
        return false
      }
      if (this.$route.path.includes('login')) {
        return false
      }
      return true
    }
  },
  mounted() {
    this.$store.state.user.body?.bg && document.documentElement.style.setProperty('--bg', `${this.$store.state.user.body.bg}`);
    // this.$store.state.user.body?.customCursor&&document.documentElement.style.setProperty('--cursor', `url('/img/unicorn.png')`);
    // if () {
    // this.$store.state.user.body&&
    // }

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

    const connect = async () => {
      await await fetch('/api/negotiate');

      const connection = new signalR.HubConnectionBuilder()
        .withUrl('/api')
        .build();

      connection.onclose(() => {
        console.log('SignalR connection disconnected');
        setTimeout(() => connect(), 2000);
      });

      connection.on('updated', updatedStock => {

        //CHECK AND PUSH NOTIFICATION
        console.log('try to push');
        if (!('Notification' in window)) {
          console.log('This browser does not support notifications!');
          return;
        }

        Notification.requestPermission(status => {
          console.log('Notification permission status:', status);
        });
        if (Notification.permission == 'granted' && 'serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then(reg => {
            console.log(reg);
            const options = {
              body: `${this.$store.state?.user.info.userDetails} is updated`,
              vibrate: [100, 50, 100],
              data: {
                dateOfArrival: Date.now(),
                primaryKey: 1 
              },
            };
            reg.showNotification(`Project ${updatedStock.id}`, options);
          });
        }
        // console.log(updatedStock);
        // alert(`${updatedStock.id} обновлена`)
      });

      connection.start().then(() => {
        console.log("SignalR connection established");
      });
    };

    connect();


    this.$store.state.user.body?.customCursor && document.documentElement.style.setProperty('--cursor__p', `url('/img/unicorn2.png')`)
    this.$store.state.user.body?.customCursor && document.documentElement.style.setProperty('--cursor', `url('/img/unicorn.png')`)
    this.$store.state.user.body?.bg && document.documentElement.style.setProperty('--bg', `${this.$store.state.user.body.bg}`)

    const getTT = async () => {
      await this.$store.dispatch('GET_template')
    }
    getTT()



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
*{
  cursor: var(--cursor), auto;	
  cursor: var(--cursor__p), pointer;
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
  border: 1px solid #004481;
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
  margin: 0.3vh;
  
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