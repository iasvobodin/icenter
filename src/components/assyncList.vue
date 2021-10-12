<template>
  <ul class="project_list">
    <li
      v-for="(project, index) in filterProject"
      :key="index"
      class="project_item"
      @mousedown="chooseProject(index)"
    >
      <p>{{ project }}</p>
    </li>
  </ul>
</template>

<script>
import { useProjects } from '@/hooks/projectList.ts'

export default {
  async setup() {
    const projectList = await useProjects()
    return { projectList }
  },
}
</script>

<style lang="scss" scoped></style>
