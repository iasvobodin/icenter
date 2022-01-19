import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store/index'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/User',
    name: 'User',
    component: () => import('@/views/User.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/role',
    name: 'role',
    component: () => import('@/views/role.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/index.vue'),
    children: [
      {
        path: 'profile',
        component: () => import('@/views/admin/UserProfile.vue'),
      },
      {
        path: 'reports',
        component: () => import('@/views/admin/reports.vue'),
      },
      {
        path: 'addcabtime',
        component: () => import('@/views/admin/addCabTime.vue'),
      },
    ],
  },
  {
    path: '/errors',
    component: () => import('@/views/errors/errors.vue'),
    // beforeEnter: async (to, from) => {
    //   Object.keys(store.state.template).length===0 && (await store.dispatch('GET_template'))
    //   return true
    // },
  },
  {
    path: '/errors/:errorId',
    component: () => import('@/views/errors/_errorId.vue'),
    beforeEnter: async (to, from) => {
      !store.state.template.error && (await store.dispatch('GET_template'))
      return true
    },
  },
  {
    path: '/errors/addNewError',
    beforeEnter: async (to, from) => {
      !store.state.template.error && (await store.dispatch('GET_template'))
      return true
    },
    component: () => import('@/views/errors/addNewError.vue'),
  },
  {
    path: '/errors/info',
    component: () => import('@/views/errors/info.vue'),
    beforeEnter: async (to, from) => {
      !store.state.template.error && (await store.dispatch('GET_template'))
      return true
    },
  },
  {
    path: '/tasks',
    component: () => import('@/views/tasks/tasks.vue'),
  },
  {
    path: '/tasks/:taskId',
    component: () => import('@/views/tasks/_taskId.vue'),
  },
  {
    path: '/cabinets',
    component: () => import('@/views/cabinets/cabinets.vue'),
  },
  {
    path: '/cabinets/:cabinetId',
    component: () => import('@/views/cabinets/_cabinetId.vue'),
    beforeEnter: async (to, from) => {
      Object.keys(store.state.template).length === 0 &&
        (await store.dispatch('GET_template'))
      return true
    },
  },
  {
    path: '/cabtimes',
    component: () => import('@/views/cabtimes/cabtimes.vue'),
    beforeEnter: async (to, from) => {
      Object.keys(store.state.template).length === 0 &&
        (await store.dispatch('GET_template'))
      return true
    },
  },
  {
    path: '/cabtimes/:cabtimeId',
    component: () => import('@/views/cabtimes/_cabtimeId.vue'),
    beforeEnter: async (to, from) => {
      Object.keys(store.state.template).length === 0 &&
        (await store.dispatch('GET_template'))
      return true
    },
  },
  {
    path: '/cabtimes/addNewCabtime',
    component: () => import('@/views/cabtimes/addNewCabtime.vue'),
    beforeEnter: async (to, from) => {
      Object.keys(store.state.template).length === 0 &&
        (await store.dispatch('GET_template'))
      return true
    },
  },
  {
    path: '/projects',
    component: () => import('@/views/projects/projects.vue'),
    beforeEnter: async (to, from) => {
      Object.keys(store.state.template).length === 0 &&
        (await store.dispatch('extendProject'))
      return true
    },
  },
  {
    path: '/projects/addNewProject',
    component: () => import('@/views/projects/addNewProject.vue'),
    beforeEnter: async (to, from) => {
      Object.keys(store.state.template).length === 0 &&
        (await store.dispatch('GET_template'))
      return true
    },
  },
  {
    path: '/projects/addNewProjectManual',
    component: () => import('@/views/projects/addNewProjectManual.vue'),
    beforeEnter: async (to, from) => {
      Object.keys(store.state.template).length === 0 &&
        (await store.dispatch('GET_template'))
      return true
    },
  },
  {
    path: '/projects/:projectId',
    component: () => import('@/views/projects/_projectId.vue'),
    beforeEnter: async (to, from) => {
      Object.keys(store.state.template).length === 0 &&
        (await store.dispatch('GET_template'))
      return true
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const createName = (clientPrincipal) => {
  if (clientPrincipal.identityProvider === 'aad') {
    const splitName = clientPrincipal.userDetails.split('@')[0].split('.')
    const name =
      splitName[0][0].toUpperCase() + '.' + splitName[1][0].toUpperCase() + '.'
    return name
  }
  return clientPrincipal.userDetails.split('@')[0]
}

const CHECK_auth = async () => {
  try {
    const responseUserAuth = await fetch('/.auth/me')
    if (responseUserAuth.ok) {
      const user = await responseUserAuth.json()
      const { clientPrincipal } = user
      //CREATE OBJECT FOR SERVER
      if (clientPrincipal) {
        const userRes = {
          id: clientPrincipal.userId,
          type: 'info',
          info: clientPrincipal,
          body: {
            name: createName(clientPrincipal),
          },
        }
        console.log(userRes, 'this return from CHEC_auth, if true')
        return userRes
      }
    }
    return false
  } catch (error) {
    console.log(error, 'CHECK AUTH ERROR')
    return false
  }
}
const commitUser = (user) => {
  window.localStorage.setItem('user', JSON.stringify(user))
  store.commit('setUserAuth', JSON.stringify(user))
}
const CHECK_userDB = async (user) => {
  try {
    const registerUserRes = await fetch(
      `/api/user/${user.info.userId}?getRegisterUser=true`
    )
    //   console.log(responseUserAuth,'responseUserAuth');
    if (registerUserRes.ok) {
      user = await registerUserRes.json()
      user && commitUser(user)
    }
  } catch (error) {
    console.log(error, 'from check user in db')
    try {
      const options = {
        method: 'POST', // или 'PUT'
        body: JSON.stringify(user),
      }
      await fetch(
        `/api/user/${user.info.userId}?postRegisterUser=true`,
        options
      )
      commitUser(user)
    } catch (error) {
      console.log(error, 'error from register user in db')
    }
  }
}

router.beforeEach(async (to, from) => {
  if (to.path === '/login' || to.path === '/role') return true

  // Object.keys(store.state.template).length===0 && (await store.dispatch('GET_template'))

  if (import.meta.env.MODE === 'development') {
    const user = {
      id: '9c0c1980f5904d10b43e552d2b7c4041',
      type: 'info',
      info: {
        identityProvider: 'aad',
        userId: '9c0c1980f5904d10b43e552d2b7c4041',
        userDetails: 'ivan.svobodin@emerson.com',
        userRoles: ['admin', 'anonymous', 'icenter', 'authenticated'],
      },
      body: {
        name: 'I.S.',
      },
    }
    commitUser(user)
    return true
  } else {
    //CHECK USER GLOBAL
    const user = window.localStorage.getItem('user') // type string

    if (user) {
      const userParse = JSON.parse(user) // type object
      if (!userParse.info.userRoles.includes('icenter')) {
        //CHECK ROLE
        return '/role'
      } else {
        commitUser(userParse)
        // CHECK_userDB(userParse)
        return true
      }
    } else {
      const userCheck = await CHECK_auth()
      if (userCheck) {
        //CHECK ROLE
        if (!userCheck.info.userRoles.includes('icenter')) {
          return '/role'
        } else {
          CHECK_userDB(userCheck)
          return true
        }
      } else {
        return '/login'
      }
    }
  }

  // const test = await CHECK_auth()
  // console.log(await CHECK_auth(), 'just check user auth from route own');

  // async function getUser() {
  //   const response = await fetch('/api/user');
  //   const payload = await response.json();
  //   const { clientPrincipal } = payload;
  //   return clientPrincipal;
  // }

  // console.log(await getUser(), 'just check user auth from route ff');

  // if (to.path === '/role')  return true
  // if (user) {
  //   if (!JSON.parse(user).info.userRoles.includes('icenter')) { //CHECK ROLE
  //     return '/role'
  //   }
  //   store.commit('setUserAuth', user) //ADD USER TO VUEX
  // } else {
  //   await store.dispatch('GET_auth') // TRY TO GET AUTH
  // }
})

export default router