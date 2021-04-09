<template>
  <div class="about">
    <h1>User page</h1>
    <h2 v-if="$store.state.user.mail">{{ $store.state.user.mail }}</h2>
    <!-- <div v-if="errors">
      Ошибки!!! -->

    <!-- <user-errors /> -->

    <div v-for="(error, index) in errors" :key="index">
      <p>id {{ error.id }}</p>
      <p>статус {{ error.status }}</p>
      <p>проект {{ error["project number"] }}</p>
      <p>шкаф {{ error["cab name"] }}</p>
    </div>
    <!-- </div> -->
    <!-- <div v-else>
      В данный момент нет открытых вами ошибок.
    </div> -->
    <!-- <div v-if="user && !user.userInfo.name">
      <h2>
        Укажите ваше имя <input type="text" v-model="userName" /> {{ userName }}
      </h2>
      <button @click="updateProfileInfo">Сохранить</button>
    </div> -->
    <!-- <h2 v-else>{{ user.userInfo.name }}</h2> -->
  </div>
</template>

<script>
import userErrors from "@/components/userErrors";
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    userErrors,
  },
  methods: {
    async getUserErrors() {
      await this.$store.dispatch("GET_auth");
      console.log(window.sessionStorage.getItem("mail"), "11111");
      try {
        const responsErrors = await fetch(
          `/api/user/${window.sessionStorage.getItem("mail")}`
        );
        try {
          this.errors = await responsErrors.json();
        } catch (error) {
          console.error("this.errors.json", error);
          this.errors = [];
        }
      } catch (error) {
        console.log("errors is not def", error);
      }
    },
  },
  data() {
    return {
      user: null,
      userName: "",
      errors: null,
    };
  },
  async mounted() {
    this.getUserErrors();
    // const response = await fetch("/.auth/me");
    // const payload = await response.json();
    // let clientPrincipal;
    // if (payload) {
    //   clientPrincipal = payload.clientPrincipal;
    // } else {
    //   clientPrincipal = {
    //     userId: "1298",
    //     mail: "test@mail.ru",
    //     userDetails: "super@mail.com"
    //   };
    // }

    // const user = await fetch(`/api/user/${clientPrincipal.userId}`, {
    //   method: "POST", // или 'PUT'
    //   body: JSON.stringify({
    //     id: clientPrincipal.userId,
    //     type: "info",
    //     authInfo: clientPrincipal,
    //     userInfo: {}
    //   })
    // });
    // const userData = await user.json();
    // console.log(userData[0], "userData");
    // this.$store.commit("SETuser", clientPrincipal);
    // this.user = userData[0];
    // // this.user.userRoles.includes("admin") && this.$router.push(`/admin/`);
    // // this.user.userRoles.includes("fitter") && this.$router.push(`/fitter/`);
    // // this.user.userRoles.includes("engineer") && this.$router.push(`/engineer/`);
    //
  },
};
</script>

<style lang="scss" scoped></style>
