import {
  createRouter,
  createWebHistory
} from "vue-router";
import Home from "@/views/Home.vue";
import cabtime from "@/views/admin/addCabTime.vue";
// import UserHome from "@/views/admin/UserHome.vue";
import UserProfile from "@/views/admin/UserProfile.vue";
import addProject from "@/views/admin/addProject.vue";
import reports from "@/views/admin/reports.vue";
const routes = [{
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/User",
    name: "User",
    component: () => import("@/views/User.vue")
  },
  {
    path: "/admin",
    children: [
      // { path: "", component: UserHome },
      {
        path: "profile",
        component: UserProfile
      },
      {
        path: "addproject",
        component: addProject
      },
      {
        path: "reports",
        component: reports
      },
      {
        path: "addcabtime",
        component: cabtime
      },
    ],
    component: () => import("@/views/admin/index.vue")
  },
  // {
  //   path: "/projects/:projectnumber",
  //   component: () => {
  //import(
  //       "@/views/projects/_projectnumber/index.vue"
  //     );
  //   },
  // },
  // {
  //   path: "/projects/:projectnumber/:wonumber",
  //   component: () => {
  //import(
  //       "@/views/projects/_projectnumber/_wonumber/index.vue"
  //     );
  //   },
  // },
  {
    path: "/errors",

    component: () => import("@/views/errors/index.vue")
  },
  {
    path: "/errors/:errorId",
    component: () => import(
      "@/views/errors/_errorId/index.vue"
    )

  },
  {
    path: "/errors/addNew",
    component: () => import(
      "@/views/errors/addNew.vue"
    )

  },
  {
    path: "/tasks",
    component: () => import("@/views/tasks/index.vue")

  },
  {
    path: "/tasks/:taskId",
    component: () => import(
      "@/views/tasks/_taskId/index.vue"
    )

  },
  {
    path: "/cabinets",
    component: () => import(
      "@/views/cabinets/index.vue"
    )
  },
  {
    path: "/cabinets/:cabinetId",
    component: () => import(
      "@/views/cabinets/_cabinetId/index.vue"
    )

  },
  {
    path: "/cabtimes",
    component: () => import(
      "@/views/cabtimes/index.vue"
    )

  },
  {
    path: "/cabtimes/:cabtimeId",
    component: () => import(
      "@/views/cabtimes/_cabtimeId/index.vue"
    )

  },
  {
    path: "/projects",
    component: () => import("@/views/projects/index.vue")
  },
  {
    path: "/projects/:projectId",
    component: () => import("@/views/projects/_projectId/index.vue")
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/views/admin/index.vue")
  },
  {
    path: "/login",
    name: "login",
    beforeEnter() {
      window.open("http://www.google.com", "_blank");
    },
    component: () => import("@/views/login.vue")
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;