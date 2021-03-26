<template>
  <nav class="navigation">
    <ul>
      <li>
        <router-link :to="`/admin/${$route.params.id}`">На главную</router-link>
      </li>
      <li>
        <router-link :to="`/admin/${$route.params.id}/profile`"
          >Личный кабинет</router-link
        >
      </li>
      <li>
        <router-link :to="`/admin/${$route.params.id}/reports`"
          >Отчёты</router-link
        >
      </li>
      <li>
        <router-link :to="`/admin/${$route.params.id}/addproject`"
          >Добавить проект</router-link
        >
      </li>
      <li>
        <router-link :to="`/admin/${$route.params.id}/addcabtime`"
          >Расчёт CabTime</router-link
        >
      </li>
    </ul>
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
  display: grid;
}
</style>
