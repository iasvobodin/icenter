<template>
  <div v-if="$store.state.user.info">
    <h1>Личная старница {{ $store.state.user.info.userDetails.split('@')[0].replace('.',' ') }}</h1>
    <p>в разработке</p>
    <br>
    <a href="/.auth/logout?post_logout_redirect_uri=/">Log out</a>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
