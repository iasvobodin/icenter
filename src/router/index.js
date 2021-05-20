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
    component: ()=>  import("@/views/cabinets/index.vue"),
  },
  {
    path: "/cabinets/:cabinetId",
    component: ()=>  import("@/views/cabinets/_cabinetId/index.vue"),
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
    component: ()=>  import("@/views/projects/index.vue"),
  },
  {
    path: "/projects/:projectId",
    component: ()=>  import("@/views/projects/_projectId/index.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: ()=>  import("@/views/admin/index.vue"),
  },
  // {
  //   path: "/login",
  //   name: "login",
  //   beforeEnter() {
  //     window.open("http://www.google.com", "_blank");
  //   },
  //   component: ()=>  import("@/views/login.vue"),
  // },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach(async (to, from) => {
  // canUserAccess() returns `true` or `false`
  await store.dispatch('GET_auth')
  if (!store.state.user.info) return '/login'
})

export default router;
