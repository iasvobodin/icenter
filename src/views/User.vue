<template>
  <div class="about">
    <h1>User page</h1>
    <h2 v-if="user">{{ user.authInfo.mail }}</h2>
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
export default {
  methods: {
    async updateProfileInfo() {
      // eslint-disable-next-line no-unused-vars
      let clientPrincipal = {
        userId: "1298",
        mail: "test@mail.ru"
      };
      // const user = await fetch(`/api/user/${clientPrincipal.userId}`, {});
    }
  },
  data() {
    return {
      user: null,
      userName: ""
    };
  },
  async mounted() {
    // const response = await fetch("/.auth/me");
    // const payload = await response.json();
    // const { clientPrincipal } = payload;

    let clientPrincipal = {
      userId: "1298",
      mail: "test@mail.ru"
    };

    const user = await fetch(`/api/user/${clientPrincipal.userId}`, {
      method: "POST", // или 'PUT'
      body: JSON.stringify({
        id: clientPrincipal.userId,
        authInfo: clientPrincipal,
        userInfo: {},
        tasks: {},
        erors: {}
      })
    });
    const userData = await user.json();
    console.log(userData[0], "userData");

    this.user = userData[0];
    // this.user.userRoles.includes("admin") && this.$router.push(`/admin/`);
    // this.user.userRoles.includes("fitter") && this.$router.push(`/fitter/`);
    // this.user.userRoles.includes("engineer") && this.$router.push(`/engineer/`);
  }
};
</script>

<style lang="scss" scoped></style>
