<template>
    <div class="app__header">
        <navigation-panel />
        <img class="back__image"  src="/img/back.svg" alt="" @click="$router.back()" />
        <div>
            <h4 @click="$router.push('/login')" v-if="!$store.state.user.info">Необходима авторизация</h4>
            <div v-else class="user" @click="$router.push('/user')"> 
            <span>
                {{ $store.state.user.body.name}}
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
a {
    text-decoration-line: none;
    color: #ffffff;
    text-decoration-color: rgb(255, 255, 255);
}

.app__header {
    position: sticky;
    top: 0px;
    height: 50px;
    width: 100%;
    background-color: #004481;
    box-shadow: inset 0px 2px 3px 0px rgb(0 0 0 / 40%), 0px 1px 2px 0px rgb(255 255 255 / 20%);
    z-index: 3;
    /* position: fixed;
    top: 0px; */
    /* position: absolute;
    top: 0; */
}

.user {
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

.user>span {
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