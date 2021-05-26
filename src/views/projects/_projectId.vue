<template>
    <div v-if="project">
        <h1>{{project.id}}</h1>
        <h3>Основная информация</h3>
        <info-render :info-data="project.info.base" />
        <h3>Дополнительные сведения</h3>
        <info-render :info-data="project.info.extends" />
        <h3>Шкафы</h3>
        <div v-for="(cab,i) in project.cabinets" :key="i">
        <info-render :info-data="cab" /> <br></div>
        <!-- <section v-for="(val, key, index) in project.info" :key="index" class="eror__body">
        <div v-if="!key.startsWith('_')&&Object.values(val)[1]">
          <div >
            <h2 >{{ key }}</h2>
          <info-render :info-data="val" />
          </div>
        </div>
      </section> -->
    </div>
</template>

<script>
    import {
        reactive,
        toRefs
    } from 'vue'
    import {
        useFetch
    } from '@/hooks/fetch'
import { useRouter, useRoute } from 'vue-router'
 import conditionalRender from "@/components/conditionalRender.vue";
import infoRender from "@/components/infoRender.vue";
export default {
  components: {
    // conditionalRender,
    infoRender,
  },
        setup() { 
            const route = useRoute()
                      const state = reactive({
                project: null,
            })
            const getProject = async () => {
                const {
                    request,
                    response
                } = useFetch(`/api/projects?status=open&project=${route.params.projectId}`)
await request()
state.project = response

            }
getProject()


 

            return {
                ...toRefs(state),
            }
        }
    }
</script>

<style lang="css" scoped>

</style>