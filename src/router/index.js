import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import cabtime from "../views/admin/addCabTime.vue";
import UserHome from "../views/admin/UserHome.vue";
import UserProfile from "../views/admin/UserProfile.vue";
import addProject from "../views/admin/addProject.vue";
import reports from "../views/admin/reports.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/User",
    name: "User",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(/* webpackChunkName: "about" */ "../views/User.vue");
    }
  },
  {
    path: "/admin/:id",
    // name: "admin",
    children: [
      { path: "", component: UserHome },
      { path: "profile", component: UserProfile },
      { path: "addproject", component: addProject },
      { path: "reports", component: reports },
      { path: "addcabtime", component: cabtime }
    ],
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(/* webpackChunkName: "about" */ "../views/admin/_id.vue");
    }
  },
  {
    path: "/admin",
    name: "admin",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(/* webpackChunkName: "about" */ "../views/admin/index.vue");
    }
  },
  {
    path: "/login",
    name: "login",
    beforeEnter() {
      window.open("http://www.google.com", "_blank");
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(/* webpackChunkName: "about" */ "../views/login.vue");
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
