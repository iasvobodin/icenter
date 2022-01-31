<template>
  <div id="view">
    <!-- <div class="gap"></div> -->
    <router-view />
  </div>
  <app-header v-if="match()" />
  <fetch-loader />

  <!-- <input v-model="state.mess" type="text" name="" id="" /><br /><br /><button
    @click="sendmessage"
  >
    sendmessage</button
  ><br /><br />
  <div :key="index" v-for="(message, index) in state.messages">
    <p>{{ message }}</p>
  </div>-->
</template>

<script setup>
import fetchLoader from '@/components/fetchLoader.vue'
import appHeader from '@/components/header.vue'
import * as signalR from '@microsoft/signalr'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
import { ref, computed, onBeforeMount, reactive, watchEffect } from 'vue'

const store = useStore()
const route = useRoute()

const match = () =>
  route.path.includes('role') || route.path.includes('login') ? false : true

const state = reactive({
  messages: [],
  mess: '',
})

const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications!')
    return
  }

  Notification.requestPermission((status) => {
    console.log('Notification permission status:', status)
  })
}
getNotificationPermission()

const connect = async () => {
  let negotiateRes
  try {
    const negotiate = await fetch(`/api/negotiate`)
    if (negotiate.ok) {
      negotiateRes = await negotiate.json()
      console.log(negotiateRes, 'negGGGGGGGGGGGGGG')
    }
  } catch (e) {
    throw new Error(e, 'error in connection signalR')
  }
  // }

  const connection = new signalR.HubConnectionBuilder()
    .withUrl('/api', {
      accessTokenFactory: () => negotiateRes.accessToken,
    })
    .configureLogging(signalR.LogLevel.Information)
    .build()
  // debugger
  console.log(connection, 'connection!!!!!!!!!!!!!')
  connection.onclose(() => {
    console.log('SignalR connection disconnected')
    setTimeout(() => connect(), 2000)
  })
  connection.on('newMessage', (message) => {
    console.log(message, 'newMessage')
    store.commit('UPDATE_cabinets', message)
  }) // state.messages.push(message))
  connection.on('updated', (updatedStock) => {
    console.log(updatedStock, 'updatedStock')
    // NEED TO UPDATE IDB!!!
    //DISPATCH STORE

    //CHECK AND PUSH NOTIFICATION

    if (Notification.permission == 'granted' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        // console.log(reg);
        const options = {
          body: `${store.state?.user.info.userDetails} updated the project.`,
          vibrate: [100, 50, 100],
          actions: [
            {
              action: 'explore',
              title: 'Explore',
              icon: '/img/checkmark.png',
            },
            {
              action: 'close',
              title: 'Close',
              icon: '/img/xmark.png',
            },
          ],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
          },
        }
        // reg.showNotification(`${updatedStock.id}`, options);
      })
    }
    // console.log(updatedStock);
    // alert(`${updatedStock.id} обновлена`)
  })

  connection.start().then(() => {
    console.log('SignalR connection established')
  })
}

// import.meta.env.MODE !== 'development'&&
// Object.keys(store.state.user).length !== 0 &&
connect()

// const onNewMessage = (message) => state.messages.push(message)
// const sendmessage = async () => {
//   fetch('/api/getUserHeader', {
//     method: 'post',
//     body: state.mess,
//   })
// }
// const ttemp = ref(null)
// onBeforeRouteUpdate(async ( to, from, next) => {
//   console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
// // ttemp.value = await store.dispatch('GET_template')
// //  next()
//   })

// const getTT = async () => {
//   await store.dispatch('GET_template')
// }

// getTT()
// computed(()=> {
//   return
// })
const userData = computed(() => store.state.user.body)

watchEffect(() => {
  document.documentElement.style.setProperty('--bg', `${userData.value?.bg}`)
  document.documentElement.style.setProperty(
    '--cursor',
    `${userData.value?.customCursor}`
  )
})
// onBeforeMount(() => {
//   const userFromLocal = JSON.parse(window.localStorage.getItem('user'))
//   if (userFromLocal) {
//     document.documentElement.style.setProperty(
//       '--bg',
//       `${userFromLocal.body?.bg}`
//     )
//     document.documentElement.style.setProperty(
//       '--cursor',
//       `${userFromLocal.body?.customCursor}`
//     )
//   }
// })

// document.documentElement.style.setProperty('--bg', `${store.state.user.body?.bg}`)
// document.documentElement.style.setProperty('--cursor', `${store.state.user.body?.customCursor}`)

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
@import url("https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400&display=swap");
:root {
  --size-300: clamp(0.7rem, 0.66rem + 0.2vw, 0.8rem);
  --size-400: clamp(0.88rem, 0.83rem + 0.24vw, 1rem);
  --size-500: clamp(1.09rem, 1rem + 0.47vw, 1.33rem);
  --size-600: clamp(1.37rem, 1.21rem + 0.8vw, 1.78rem);
  --size-700: clamp(1.71rem, 1.45rem + 1.29vw, 2.37rem);
  --size-800: clamp(2.14rem, 1.74rem + 1.99vw, 3.16rem);
  --size-900: clamp(2.67rem, 2.07rem + 3vw, 4.21rem);
  --size-1000: clamp(3.34rem, 2.45rem + 4.43vw, 5.61rem);
}
*,
*:before,
*:after {
  box-sizing: border-box;
}
* {
  cursor: var(--cursor), auto;
}

html {
  height: 100%;
}

body {
  width: 100%;
  min-height: 100%;
  margin: 0;
  background: var(--bg);
}
#view {
  /* min-height: calc(100vh - 50px); */
  padding-bottom: 75px;
  padding-top: 50px;
}
textarea,
select,
input[type="text"],
input[type="number"] {
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica,
    Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
  line-height: 1.15;
}

button,
input[type="submit"] {
  height: 30px;
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
  margin: 5px 1vw;
}
button,
input[type="submit"] {
  width: min(85vw, 350px);
  /* margin: auto; */
}
input[type="submit"]:hover {
  background-color: #00a2ff5b;
}
button:hover:enabled {
  background-color: #00a2ff5b;
}
/* bottom:disabled bottom:hover {
  background-color: #ffffff;
} */
h4 {
  margin: 0;
}
h2 {
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
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}
#app {
  position: relative;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* min-height: 100vh; */
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
  font-family: "Roboto Slab", serif;
  font-weight: normal;
}
h1 {
  margin: 0;
  padding: 2vh;
}
.item__card {
  background-color: white;
  /* border: 1px solid orange; */
  /* box-shadow: 0 0 25px rgb(0 0 0 / 8%); */
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  border-radius: 4px;
  padding: 1vh;
  cursor: pointer;
  min-height: 150px;
  height: 100%;
  overflow: hidden;
}
.item__card:hover {
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}
.group__items {
  position: sticky;
  top: 50px;
  width: 100%;
  min-height: 50px;
  /* z-index: 2; */
  background-color: #ffffff;
  /* color: black; */
  margin: 1.5vh auto;
  margin-bottom: 40px;
  /* display: block; */
  box-shadow: rgba(0, 0, 0, 0.2) 0px 25px 20px -20px;
  /* border-radius: 5px; */
  /* width: min(700px, 95%); */
  /* padding: 0.01vh; */
  /* font-size: min(20px 5vw ); */
  /* transform: translateY(-50%); */
}
.gap {
  height: 50px;
}

thead tr th {
  white-space: pre-wrap;
  word-wrap: break-word;
}
table {
  margin: auto;
  margin-top: 2vh;
  border-collapse: collapse;
  border-radius: 5px;
  /* overflow: hidden; */
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  padding: 2vw;
  width: min(95vw, 800px);
}

td,
th {
  box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;

  /* padding: 3px; */
  /* padding-right: 1ch; */
  /* text-align: start; */
  font-size: 12px;
}
td input {
  text-align: center;
}

tbody tr:nth-child(odd) {
  background: #f3f3f3;
}
table tbody .partially {
  background: hsl(252deg 100% 95%);
}
table tbody .done {
  background: hsl(120deg 100% 95%);
}
tbody tr {
  margin-bottom: 10px;
  height: 40px;
}
.head {
  border-bottom: solid 1px orange;
  background: white;
  border-radius: 3px;
  height: 40px;
  position: sticky;
  top: 50px;
}
</style>
