<template>
  <nav class="navigation">
    <!-- <router-link :to="`/admin/${$route.params.id}`">На главную</router-link> | -->
    <router-link :to="`/admin/profile`">Личный кабинет</router-link>
    |
    <router-link :to="`/admin/reports`">Отчёты</router-link>
    |
    <router-link :to="`/admin/addproject`">Добавить проект</router-link>
    |
    <router-link :to="`/admin/addcabtime`">Расчёт CabTime</router-link>
  </nav>
</template>

<script>
export default {
  setup() {
    return {};
  }
};
</script>

<style lang="css" scoped>
.navigation {
  display: block;
}
li {
  display: block;
}
</style>
