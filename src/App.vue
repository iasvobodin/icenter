<template>
  <app-header v-if="match()" />
  <div id="view">
    <router-view />
  </div>
  <loader />
</template>

<script setup>
import loader from '@/components/loader.vue'
import appHeader from '@/components/header.vue'
import * as signalR from '@microsoft/signalr'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
import { ref, computed, onBeforeMount } from 'vue'

const store = useStore()
const route = useRoute()

const match = () =>
  route.path.includes('role') || route.path.includes('login') ? false : true

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
    const negotiate = await fetch('/api/negotiate')
    if (negotiate.ok) {
      negotiateRes = await negotiate.json()
      console.log(negotiateRes, 'negGGGGGGGGGGGGGG')
    }
  } catch (e) {
    throw new Error(e)
  }

  const connection = new signalR.HubConnectionBuilder()
    .withUrl('/api', {
      accessTokenFactory: () => negotiateRes.accessToken,
    })
    .configureLogging(signalR.LogLevel.Information)
    .build()
  console.log(connection, 'connection!!!!!!!!!!!!!')
  connection.onclose(() => {
    console.log('SignalR connection disconnected')
    setTimeout(() => connect(), 2000)
  })

  connection.on('updated', (updatedStock) => {
    // NEED TO UPDATE IDB!!!
    //DISPATCH STORE

    //CHECK AND PUSH NOTIFICATION

    if (Notification.permission == 'granted' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        // console.log(reg);
        const options = {
          body: `${this.$store.state?.user.info.userDetails} updated the project.`,
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

connect()
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
onBeforeMount(() => {
  const userFromLocal = JSON.parse(window.localStorage.getItem('user'))
  if (userFromLocal) {
    document.documentElement.style.setProperty(
      '--bg',
      `${userFromLocal.body?.bg}`
    )
    document.documentElement.style.setProperty(
      '--cursor',
      `${userFromLocal.body?.customCursor}`
    )
  }
})

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
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400&display=swap');
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
  min-height: calc(100vh - 50px);
  padding-bottom: 75px;
}
textarea,
select,
input[type='text'],
input[type='number'] {
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica,
    Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
  line-height: 1.15;
}

button,
input[type='submit'] {
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
}
button,
input[type='submit'] {
  width: min(95vw, 400px);
  margin: auto;
}
input[type='submit']:hover {
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
  font-family: 'Roboto Slab', serif;
  font-weight: normal;
}
h1{
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
  z-index: 2;
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
</style>
