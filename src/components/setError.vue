<template>
  <div>SET ERROR</div>
  <div v-if="errorTemplate">
    <form @submit.prevent="postError">
      <div
        class="error__field"
        v-for="(value, key, index) in errorTemplate.error.stage1"
        :key="index"
      >
        {{ key }}
        <select v-if="typeof value === 'object'" v-model="errorBody[key]">
          <option v-for="(opt, index) in value" :key="index">{{ opt }}</option>
        </select>
        <textarea
          v-else
          v-model="errorBody[key]"
          cols="30"
          rows="10"
        ></textarea>
      </div>
      <input class="add__button" type="submit" value="добавить в базу" />
    </form>

    <!-- {{errorTemplate.error.body}} -->
  </div>
</template>

<script>
export default {
  methods: {
    async postError() {
      await fetch("/api/POST_error", {
        method: "POST", // или 'PUT'
        body: JSON.stringify({
          id: `error_userid_${Date.now()}`,
          wo: this.$store.state.projectInfo.wo,
          status: "open",
          "senior fitter": this.$store.state.projectInfo["senior fitter"],
          body: this.errorBody
        })
      });
    }
  },
  data() {
    return {
      errorTemplate: null,
      errorBody: {}
    };
  },
  async mounted() {
    try {
      if (!this.errorTemplate) {
        this.errorTemplate = await (
          await fetch("/api/templates/templateProject/ver1")
        ).json();
      }
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style lang="css" scoped>
.error__field {
  margin: 10px;
}
</style>
