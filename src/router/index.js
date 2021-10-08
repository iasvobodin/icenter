import { createRouter, createWebHistory } from "vue-router";
import store from '@/store/index.ts'
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/User",
    name: "User",
    component:()=>  import("@/views/User.vue"),
  },
  {
    path: '/login',
    name: 'login',
    component:()=>  import("@/views/login.vue"),
  },
  {
    path: '/role',
    name: 'role',
    component:()=>  import("@/views/role.vue"),
  },
  {
    path: "/admin",
    component: ()=> import("@/views/admin/index.vue"),
    children: [
      {
        path: "profile",
        component: ()=>  import("@/views/admin/UserProfile.vue"),
      },
      {
        path: "addproject",
        component: ()=>  import("@/views/admin/addProject.vue"),
      },
      {
        path: "reports",
        component: ()=>  import("@/views/admin/reports.vue"),
      },
      {
        path: "addcabtime",
        component: ()=>  import("@/views/admin/addCabTime.vue"),
      },
    ],
  },
  {
    path: "/errors",
    component: ()=>  import("@/views/errors/errors.vue"),
  },
  {
    path: "/errors/:errorId",
    component: ()=>  import("@/views/errors/_errorId.vue"),
  },
  {
    path: "/errors/addNewError",
    component: ()=>  import("@/views/errors/addNewError.vue"),
  },
  {
    path: "/errors/info",
    component: ()=>  import("@/views/errors/info.vue"),
  },
  {
    path: "/tasks",
    component: ()=>  import("@/views/tasks/tasks.vue"),
  },
  {
    path: "/tasks/:taskId",
    component: ()=>  import("@/views/tasks/_taskId.vue"),
  },
  {
    path: "/cabinets",
    component: ()=>  import("@/views/cabinets/cabinets.vue"),
  },
  {
    path: "/cabinets/:cabinetId",
    component: ()=>  import("@/views/cabinets/_cabinetId.vue"),
  },
  {
    path: "/cabtimes",
    component: ()=>  import("@/views/cabtimes/cabtimes.vue"),
  },
  {
    path: "/cabtimes/:cabtimeId",
    component: ()=>  import("@/views/cabtimes/_cabtimeId.vue"),
  },
  {
    path: "/cabtimes/addNewCabtime",
    component: ()=>  import("@/views/cabtimes/addNewCabtime.vue"),
  },
  {
    path: "/projects",
    component: ()=>  import("@/views/projects/projects.vue"),
//     async beforeEnter(to, from, next) {
//   try {
//     var hasPermission = await store.dispatch("auth/hasPermission");
//     if (hasPermission) {
//       next()
//     }
//   } catch (e) {
//     next({
//       name: "login", // back to safety route //
//       query: { redirectFrom: to.fullPath }
//     })
//   }
// }
  },
  {
    path: "/projects/addNewProject",
    component: ()=>  import("@/views/projects/addNewProject.vue"),
  },
  {
    path: "/projects/:projectId",
    component: ()=>  import("@/views/projects/_projectId.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: ()=>  import("@/views/admin/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach((to, from) => {
  if (to.path === '/login')  return true
})

const CHECK_auth = async () =>{
  const responseUserAuth = await fetch("/.auth/me");
  if (responseUserAuth.ok) {
      const userAuth = await responseUserAuth.json();
      return userAuth.clientPrincipal
      // window.localStorage.setItem("user", JSON.stringify(userAuth));
  }
  return false
  }

router.beforeEach(async (to, from) => {
  !store.state.template && await store.dispatch('GET_template')
  const user = window.localStorage.getItem("user")

const test = await CHECK_auth()
console.log(test, 'just check user auth from route');


  if (to.path === '/login' || to.path === '/role')  return true
  // if (to.path === '/role')  return true
  if (user) {
    if (!JSON.parse(user).info.userRoles.includes('icenter')) { //CHECK ROLE
      return '/role'
    }
    store.commit('setUserAuth', user) //ADD USER TO VUEX
  } else{
    await  store.dispatch('GET_auth') // TRY TO GET AUTH
  }
})

export default router;
