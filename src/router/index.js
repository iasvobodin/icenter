import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import cabtime from "@/views/admin/addCabTime.vue";
// import UserHome from "@/views/admin/UserHome.vue";
import UserProfile from "@/views/admin/UserProfile.vue";
import addProject from "@/views/admin/addProject.vue";
import reports from "@/views/admin/reports.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/User",
    name: "User",
    component: function () {
      return import(/* webpackChunkName: "about" */ "@/views/User.vue");
    },
  },
  {
    path: "/admin",
    children: [
      // { path: "", component: UserHome },
      { path: "profile", component: UserProfile },
      { path: "addproject", component: addProject },
      { path: "reports", component: reports },
      { path: "addcabtime", component: cabtime },
    ],
    component: function () {
      return import(/* webpackChunkName: "about" */ "@/views/admin/index.vue");
    },
  },
  // {
  //   path: "/projects/:projectnumber",
  //   component: function () {
  //     return import(
  //       /* webpackChunkName: "about" */ "@/views/projects/_projectnumber/index.vue"
  //     );
  //   },
  // },
  // {
  //   path: "/projects/:projectnumber/:wonumber",
  //   component: function () {
  //     return import(
  //       /* webpackChunkName: "about" */ "@/views/projects/_projectnumber/_wonumber/index.vue"
  //     );
  //   },
  // },
  {
    path: "/errors",
    component: function () {
      return import(/* webpackChunkName: "about" */ "@/views/errors/index.vue");
    },
  },
  {
    path: "/errors/:errorId",
    component: function () {
      return import(
        /* webpackChunkName: "about" */ "@/views/errors/_errorId/index.vue"
      );
    },
  },
  {
    path: "/tasks",
    component: function () {
      return import(/* webpackChunkName: "about" */ "@/views/tasks/index.vue");
    },
  },
  {
    path: "/tasks/:taskId",
    component: function () {
      return import(
        /* webpackChunkName: "about" */ "@/views/tasks/_taskId/index.vue"
      );
    },
  },
  {
    path: "/cabinets",
    component: function () {
      return import(
        /* webpackChunkName: "about" */ "@/views/cabinets/index.vue"
      );
    },
  },
  {
    path: "/cabinets/:cabinetId",
    component: function () {
      return import(
        /* webpackChunkName: "about" */ "@/views/cabinets/_cabinetId/index.vue"
      );
    },
  },
  {
    path: "/cabtimes",
    component: function () {
      return import(
        /* webpackChunkName: "about" */ "@/views/cabtimes/index.vue"
      );
    },
  },
  {
    path: "/cabtimes/:cabtimeId",
    component: function () {
      return import(
        /* webpackChunkName: "about" */ "@/views/cabtimes/_cabtimeId/index.vue"
      );
    },
  },
  {
    path: "/projects",
    component: function () {
      return import(
        /* webpackChunkName: "about" */ "@/views/projects/index.vue"
      );
    },
  },
  {
    path: "/projects/:projectId",
    component: function () {
      return import(
        /* webpackChunkName: "about" */ "@/views/projects/_projectId/index.vue"
      );
    },
  },
  {
    path: "/admin",
    name: "admin",
    component: function () {
      return import(/* webpackChunkName: "about" */ "@/views/admin/index.vue");
    },
  },
  {
    path: "/login",
    name: "login",
    beforeEnter() {
      window.open("http://www.google.com", "_blank");
    },
    component: function () {
      return import(/* webpackChunkName: "about" */ "@/views/login.vue");
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
