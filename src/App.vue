<template>
  <app-header v-if="match()" />
<div id="view">
  <router-view  />
</div>
  <loader />
</template>


<script setup>
import loader from '@/components/loader.vue'
import appHeader from "@/components/header.vue";
import * as signalR from '@microsoft/signalr'
import {
  useRoute
} from 'vue-router'
import {
  useStore
} from 'vuex'
import {
  ref
} from 'vue'


const store = useStore()
const route = useRoute()
const match = () => route.path.includes('role') || route.path.includes('login') ? false : true

const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications!');
    return;
  }

  Notification.requestPermission(status => {
    console.log('Notification permission status:', status);
  });
}
getNotificationPermission()

const connect = async () => {
  let negotiateRes;
  try{
 const negotiate = await fetch('/api/negotiate');
 if (negotiate.ok) {
   negotiateRes = await negotiate.json()
   console.log(negotiateRes, 'negGGGGGGGGGGGGGG');
 }
  }catch(e){
    throw new Error(e)
  }


  const connection = new signalR.HubConnectionBuilder()
    .withUrl('/api', {
        accessTokenFactory: () => negotiateRes.accessToken
      })
      .configureLogging(signalR.LogLevel.Information)
    .build();
console.log(connection, 'connection!!!!!!!!!!!!!');
  connection.onclose(() => {
    console.log('SignalR connection disconnected');
    setTimeout(() => connect(), 2000);
  });

  connection.on('updated', updatedStock => {
    // NEED TO UPDATE IDB!!!
    //DISPATCH STORE


    //CHECK AND PUSH NOTIFICATION

    if (Notification.permission == 'granted' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        // console.log(reg);
        const options = {
          body: `${this.$store.state?.user.info.userDetails} updated the project.`,
          vibrate: [100, 50, 100],
          actions: [{
              action: 'explore',
              title: 'Explore',
              icon: '/img/checkmark.png'
            },
            {
              action: 'close',
              title: 'Close',
              icon: '/img/xmark.png'
            },
          ],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
        };
        reg.showNotification(`${updatedStock.id}`, options);
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
const getTT = async () => {
  await store.dispatch('GET_template')
}
getTT()
store.state.user.body?.customCursor && document.documentElement.style.setProperty('--cursor', `url('/img/unicorn.png')`)
store.state.user.body?.bg && document.documentElement.style.setProperty('--bg', `${store.state.user.body.bg}`)
// const bg = ref(store.state.user.body?.bg||'red')
// console.log(bg.value,'bg');
// return {
//   match
// }
// },
// mounted() {
//   // this.$store.state.user.body?.bg && document.documentElement.style.setProperty('--bg', `${this.$store.state.user.body.bg}`);

//   function formatDate(date) {
//     return (
//       date.getDate() +
//       '/' +
//       '0' +
//       (date.getMonth() + 1) +
//       '/' +
//       date.getFullYear() +
//       ' ' +
//       date.getHours() +
//       ':' +
//       date.getMinutes()
//     )
//   }
//   const dd = new Date()
//   console.log(formatDate(dd))
// },

// }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400&display=swap');
*,
*:before,
*:after {
  box-sizing: border-box;
}
*{
  /* cursor: v-bind(color); */
  cursor: var(--cursor), auto;	
}
textarea,
select,
input[type='text'],
input[type='number']{
  font-size: 16px;

}
html{
  height: 100%;
  
}
body{
  width: 100%; 
  min-height: 100%;
  margin: 0;
  /* background: v-bind('bg'); */
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
  /* font-size: 16px; */
}
textarea {
  /* font-size: inherit; */
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
 
}
/* #app{

} */
</style>