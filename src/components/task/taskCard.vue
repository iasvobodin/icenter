<template>
    <div
        v-if="userTask?.status === 'active' && !minifyView"
        style="cursor: pointer"
        class="task_card item__card"
        @click="$router.push(`/tasks/${userTask.id}`)"
    >
        <div class="user__photo__holder">
            <picture>
                <source :srcset="linkPhoto + userTask.info.user" />
                <img src="/img/user.png" alt="user photo" />
            </picture>
        </div>
        <div class="task__description">
            <p>Проект : {{ userTask.info['project number'] }}</p>
            <p>Шкаф : {{ userTask.info['cab name'] }}</p>
            <p>Время работы: {{ time }}</p>
        </div>
    </div>
    <div v-if="minifyView" class="minify" @click="$router.push(`/tasks/${userTask.id}`)">
        <p>Текущая задача {{ time }}</p>
    </div>
</template>
<script setup lang="ts">
import { computed, PropType, reactive, toRefs } from 'vue';
import { taskType } from '@/types/taskType'
import { useStore } from 'vuex';

const props = defineProps({
    userTask: {
        type: Object as PropType<taskType>,
        required: true
    },
    minifyView: {
        type: Boolean,
        default: false
    }
})
const { minifyView, userTask } = toRefs(props)
const linkPhoto = 'https://icaenter.blob.core.windows.net/user-photo/'
const store = useStore()

const state = reactive({
    passedTime: 0
})

const userFromStore = computed(() =>
    JSON.parse(JSON.stringify(store.state.user))
)
state.passedTime = Date.now() - userTask.value.body.timeStart!

const time = computed(() => new Date(state.passedTime).toISOString().substr(11, 8))
// state.pps =
// const startTick = ()=>{
setInterval(() => {
    state.passedTime += 1000
    // console.log(state.passedTime)
}, 1000)

</script>
<style lang="css">
.minify {
    color: white;
    padding: 0px 10px;
    border-radius: 5px;
    cursor: pointer;
    border: 2px solid white;
    min-height: 36px;
}
.minify p {
    line-height: 36px;
}
.task_card {
    max-height: 150px;
    width: min(450px, 95vw);
    margin: 3vh auto;
    display: grid;
    grid-auto-flow: column;
}
.task__description {
    place-self: center;
}
.task__description p {
    margin: 10px;
}
.user__photo__holder {
    place-self: center;
    overflow: hidden;
    border-radius: 50%;
    width: 100px;
    height: 100px;
}
.user__photo__holder picture img {
    object-fit: cover;
    object-position: center;
    width: 100%;
    height: 100%;
}
</style>