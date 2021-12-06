<template>
  <div class="app__header">
    <navigation-panel />
    <img
      class="back__image"
      src="/img/back.svg"
      alt=""
      @click="$router.back()"
    />
    <div>
      <h4 v-if="!userInfo" class="checkAuth">Проверка авторизации</h4>
      <div v-else class="user" @click="$router.push('/user')">
        <img
          class="user-photo"
          v-if="$store.state.user.body.photo"
          :src="`https://icaenter.blob.core.windows.net/user-photo/thumb__${store.state.user.info.userDetails}`"
          alt="user"
        />
        <span v-else>
          {{ $store.state.user.body.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import navigationPanel from '@/components/adminNavigation.vue'
import { useStore } from 'vuex'
const store = useStore()
const userInfo = computed(() => store.state.user.info)
</script>

<style lang="css" scoped>
.user-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
a {
  text-decoration-line: none;
  color: #ffffff;
  text-decoration-color: rgb(255, 255, 255);
}

.app__header {
  position: fixed;
  top: 0px;
  height: 50px;
  width: 100%;
  background-color: #004481;
  box-shadow: inset 0px 2px 3px 0px rgb(0 0 0 / 40%),
    0px 1px 2px 0px rgb(255 255 255 / 20%);
  /* z-index: 3; */
  /* position: fixed;
    top: 0px; */
  /* position: absolute;
    top: 0; */
}

.user {
  overflow: hidden;
  position: relative;
  top: 5px;
  left: 5px;
  width: 40px;
  height: 40px;
  border: 3px solid white;
  border-radius: 50%;
  display: grid;
  cursor: pointer;
}
.checkAuth {
  line-height: 50px;
  color: white;
  font-weight: 300;
}
.user > span {
  place-self: center;
  color: white;
}

.back__image {
  position: absolute;
  top: 5px;
  right: 60px;
  width: 40px;
  /* border: 1px solid black; */
  border-radius: 4px;
  cursor: pointer;
}
</style>
