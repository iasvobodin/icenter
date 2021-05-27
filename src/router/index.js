import { createRouter, createWebHistory } from "vue-router";
import store from '@/store/index'
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
    path: "/errors/addNew",
    component: ()=>  import("@/views/errors/addNew.vue"),
  },
  {
    path: "/tasks",
    component: ()=>  import("@/views/tasks/index.vue"),
  },
  {
    path: "/tasks/:taskId",
    component: ()=>  import("@/views/tasks/_taskId/index.vue"),
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
    component: ()=>  import("@/views/cabtimes/index.vue"),
  },
  {
    path: "/cabtimes/:cabtimeId",
    component: ()=>  import("@/views/cabtimes/_cabtimeId/index.vue"),
  },
  {
    path: "/projects",
    component: ()=>  import("@/views/projects/projects.vue"),
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
// router.beforeEach((to, from) => {
// //  return router.push('/login')
//   // next({ name: 'login' })
// })
//   // canUserAccess() returns `true` or `false`
//   const user = window.sessionStorage.getItem("user")
//   if (!user) {
//     return '/login'
//     // next({ name: 'User' })
    
//   //   store.commit('setUserAuth', user)
//   //   next()
//   // } else {

//   // await store.dispatch('GET_auth')
//   // if (!store.state.user.info) next({ name: 'login' })
//   // else
//   //  next()
//   } else{
//     // next()
//   } 
// })

export default router;
