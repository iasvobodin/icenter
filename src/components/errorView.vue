<template>
    <div class="error__holder">
        <h1>
            Ошибка от
            <small>({{ errorHeader() }})</small>
        </h1>
        <section class="information">
            <info-render :info-data="inputData.info" />
        </section>
        <!-- <div v-for="(val, key, index) in mainFilterBody" :key="index"> -->
        <div>
            <h2 class="error__stage">Открыто</h2>
            <div class="error__body" v-for="(v, k, i) in mainFilterBody.Открыто" :key="i">
                <h3 class="body__item__title">{{ k }}</h3>
                <p v-if="!changeData">{{ v }}</p>
                <render-inputs
                    v-else
                    v-model="mainFilterBody.Открыто![k as keyof BodyType['Открыто']]"
                    :data-render="typeof v === 'object' ? v : undefined"
                />
            </div>
        </div>
        <div>
            <h2 class="error__stage">Принято</h2>
            <div class="error__body" v-for="(v, k, i) in mainFilterBody.Принято" :key="i">
                <h3 class="body__item__title">{{ k }}</h3>
                <p v-if="!changeData">{{ v }}</p>
                <render-inputs
                    v-else
                    v-model="mainFilterBody.Принято![k as keyof BodyType['Принято']]"
                    :data-render="typeof v === 'object' ? v : undefined"
                />
            </div>
        </div>
        <div>
            <h2 class="error__stage">Устранено</h2>
            <div class="error__body" v-for="(v, k, i) in mainFilterBody.Устранено" :key="i">
                <h3 class="body__item__title">{{ k }}</h3>
                <p v-if="!changeData">{{ v }}</p>
                <render-inputs
                    v-else
                    v-model="mainFilterBody.Устранено![k as keyof BodyType['Устранено']]"
                    :data-render="typeof v === 'object' ? v : undefined"
                />
            </div>
        </div>

        <!-- </div> -->
        <button @click="changeData = !changeData">Редактировать</button>
    </div>
</template>

<script setup lang="ts">
import infoRender from '@/components/infoRender.vue'
import renderInputs from '@/components/renderInputs'
import { reactive, Ref, toRefs, computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useFetch } from '@/hooks/fetch'
import { templateType } from '@/types/templateType'

import { PropType } from 'vue'
import {
    errorType,
    templateBodyType,
    BodyType, Extend
} from '@/types/errorType'

const props = defineProps({
    inputData: {
        type: Object as PropType<errorType>,
        required: true,
    },
    changeData: {
        type: Boolean,
        default: () => false,
    },
    templateData: {
        type: Object as PropType<BodyType>,
        required: true,
    },
})
const route = useRoute()
const type = 't_error'
const { inputData, changeData, templateData } = toRefs(props)

const cloneInputData: errorType = JSON.parse(JSON.stringify(inputData.value))

const store = useStore()
const router = useRouter()



const checkAccessLevel = (creator: string) => {
    if (
        store.state.user.info.userRoles.includes('t_engineer') ||
        store.state.user.info.userRoles.includes('s_fitter')
    ) {
        return 2
    }
    if ((creator = store.state.user.info.userDetails)) {
        return 1
    } else {
        return 0
    }
}



// const filterrByType = (e: BodyType['Открыто']) => {
//     for (const key in e) {
//         type Key = keyof BodyType['Открыто']
//         // if (key in e) {
//             const element = e[key as Key];
//             console.log(element);
            
//             typeof element === 'object' && element.type && element.type === 't_error' && delete e[key as Key]
//         // }
//     }
//     return e
// }
// console.log(filterrByType(templateData.value.Открыто),"filterrByType");

const modifyBody = (el: errorType, status: string): BodyType => {
    // console.log(el)

    const lastElementInErrorBody = el.body.at(-1)!

    for (const key in lastElementInErrorBody) {
        key.startsWith('_') &&
            delete lastElementInErrorBody[key as keyof BodyType]
    }

    switch (status) {
        case 'open': return { Открыто: lastElementInErrorBody.Открыто }
        // break
        case 'confirmed': return {
            Открыто: lastElementInErrorBody.Открыто,
            Принято: lastElementInErrorBody.Принято
        }
        case 'closed': return lastElementInErrorBody
        default: return { Открыто: lastElementInErrorBody.Открыто }
    }
    // el.body = [lastElementinErrorBody]
    //   return lastElementInErrorBody
}

// const sanitizeInputData = () => {
//     const modBody = modifyBody(inputData.value)

//     return {...inputData.value,
//     body: modBody}
// }
const filterrByType = computed(()=>{
    const e: BodyType['Открыто'] = JSON.parse(JSON.stringify(templateData.value.Открыто))
        for (const key in e ) {
        type Key = keyof BodyType['Открыто']
            const element = e[key as Key];
            typeof element === 'object' && element.type && element.type === 't_error' && delete e[key as Key]
    }
    return e
})

const mainFilterBody = computed(() => {
    if (changeData.value) {
        return {...templateData.value, Открыто : filterrByType.value} as templateBodyType
    } else {
        const error = modifyBody(inputData.value, cloneInputData.info.status!)
        return error
    }
})
const errorHeader = () => {
    // const head:string = route.params.errorId
    if (typeof route.params.errorId === 'string') {
        const headSplit = route.params.errorId.split('__')
        //  console.log(headSplit[1],Date.now(),);
        // new Date(headSplit[1]).toISOString()
        return new Date(+headSplit[1]).toLocaleString()
    }
}
</script>

<style scoped>
.error__holder {
    border: 1px solid orange;
    border-radius: 4px;
    margin: auto;
    margin-top: 1vh;
    margin-bottom: 1vh;
    width: min(95vw, 600px);
    padding: 10px;
}
.body__item__title {
    justify-self: start;
    align-self: center;
    text-align: start;
    margin: 0;
}
.error__body {
    border-bottom: 1px solid rgb(102, 102, 102);
    padding: 5px;
    /* width: 100%; */
    display: grid;
    grid-template-columns: 2fr 5fr;
}
</style>
