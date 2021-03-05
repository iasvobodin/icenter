<template>
<h5>Dropdown, Templating and Force Selection</h5>
<AutoComplete v-model="selectedCountry2" :suggestions="projectsList" @dropdown-click="getProjectTest" :dropdown="true" field="name" forceSelection>
    <template #item="slotProps">
        <div class="country-item">
            <div>{{slotProps.item}}</div>
        </div>
    </template>
</AutoComplete>
</template>

<script>
import AutoComplete from 'primevue/autocomplete';
export default {
    data() {
        return {
            projectsList: null,
            selectedCountry2: null
        }
    },
      methods: {
    async getProjectTest() {
      !this.projectsList &&
        (this.projectsList = await (
          await fetch(`/api/projectstatus/Open`)
        ).json());
    },
    },
  components: {
   AutoComplete,
  },
  setup() {
    return {};
  }
};
</script>

<style lang="scss" scoped></style>
