<template>
    <div>
<h1>Проекты</h1>
<projectList/>
    </div>
</template>

<script>
import projectList from "../../components/projectList";
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
     projectList,
  },
    setup () {
        

        return {}
    }
}
</script>

<style lang="css" scoped>

</style>