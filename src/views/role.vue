<template>
    <h1>У вас недостаточно прав для доступа!</h1>
    <button @click="clearUser">Log out</button>
</template>

<script>
    export default {
          methods: {
    clearUser() {
      window.localStorage.removeItem("user")
      if (
        import.meta.env.MODE === 'development') {
          this.$router.push('/login')
        } else{
          window.location.href = '/.auth/logout?post_logout_redirect_uri=/login'
        }
    }
  },
    }
</script>

<style lang="css" scoped>
h1{
    color: red;
}
</style>