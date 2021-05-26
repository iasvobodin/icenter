<template>
    <div class="app__header">
        <navigation-panel />
        <img class="back__image"  src="/img/back.svg" alt="" @click="$router.back()" />
        <div>
            <a v-if="!$store.state.user.info" href="/.auth/login/aad?post_login_redirect_uri=/user">Login |</a>
            <div v-else class="user" @click="$router.push('/user')"> <span>{{ $store.state.user.info.name}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import navigationPanel from "@/components/adminNavigation.vue";
    export default {
          components: {
    navigationPanel
    }
    }
</script>

<style lang="css" scoped>
a{text-decoration-line: none;
color: #ffffff;
text-decoration-color: rgb(255, 255, 255);}
.app__header{
    height: 50px;
    width: 100%;
     background-color: #3b3f4d;
      box-shadow: inset 0px 2px 3px 0px rgb(0 0 0 / 40%), 0px 1px 2px 0px rgb(255 255 255 / 20%);
     z-index: 3;
    /* position: absolute;
    top: 0; */
}
.user{
    position: relative;
    top: 5px;
    left: 5px;
    width: 40px;
    height: 40px;
    border: 1px solid white;
    border-radius: 50%;
    display: grid;
    cursor: pointer;
}
.user>span{
    place-self: center;
    color: white;
}
.back__image{
  position: absolute;
  top: 5px;
  right: 80px;
  width: 40px;
  border: 1px solid black;
  border-radius: 4px;
  cursor: pointer;
}
</style>