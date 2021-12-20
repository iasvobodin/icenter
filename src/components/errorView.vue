<template></template>

<script setup lang="ts">
import { reactive, Ref, toRefs,computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useFetch } from '@/hooks/fetch'
import { templateType } from '@/types/templateType'
import { PropType } from 'vue'
import { errorType, errorBodyFitterType, errorBodyTesterType } from '@/types/errorType'

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
        type: Object as PropType<templateType['error']>,
        required: true,
    },
})

const { inputData, changeData, templateData } = toRefs(props)

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
console.log([0].at(-1), "test");

function modifyBody(el:errorType) {

    const lastBody = el.body.at(-1)!
type K = keyof errorType['body'][0]
    for (const key in lastBody) {
        
        key.startsWith('_') && delete lastBody[key:K]
    }

  const objE = Object.entries(lastBody).filter(
    (entries) => !entries[0].startsWith('_')
  )
  let mBody :errorBodyFitterType|errorBodyTesterType;
  if (el.type === 't_error' ) {
      mBody =  Object.fromEntries(objE) as errorBodyTesterType
  }
}
const sanitizeInputData = () => {
    const modBody = clearData<errorType['body'][0], templateType['error']['body']>(inputData.value.body.at(-1)!)
    
    return {...inputData.value,
    body: modBody}
}
const mainFilter = computed(()=> {
    if (changeData.value ) {
        return templateData.value
    } else{
        sanitizeInputData()
    }
})

</script>

<style scoped></style>
