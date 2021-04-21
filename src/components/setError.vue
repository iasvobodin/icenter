<template>
  <!-- <div>SET ERROR</div> -->
  <div v-if="$store.state.template">
    <form @submit.prevent="postError">
      <div
        class="error__field"
        v-for="(value, key, index) in $store.state.template.error.stage1"
        :key="index"
      >
        <p>{{ key }}</p>
        <br />
        <select
          required
          v-if="typeof value === 'object'"
          v-model="errorBody[key]"
        >
          <option v-for="(opt, index) in value" :key="index">
            {{ opt }}
          </option>
        </select>
        <textarea
          v-else
          required
          v-model="errorBody[key]"
          cols="50"
          rows="3"
        ></textarea>
      </div>
      <!-- <input type="file" /> -->
      <input class="add__button" type="submit" value="добавить в базу" />
    </form>
    <!-- {{errorTemplate.error.body}} -->
  </div>
</template>

<script>
export default {
  methods: {
    async postError() {
      this.error = {
        id: "error__" + Date.now(),
        info: {
          wo: this.$store.state.projectInfo.wo.toString(),
          "cab name": this.$store.state.projectInfo["cab name"],
          "project number": this.$store.state.projectInfo["project number"],
          fitter: sessionStorage.getItem("userDetails").toLowerCase(),
          "senior fitter": this.$store.state.projectInfo[
            "senior fitter"
          ].toLowerCase(),
          type: "error",
        },
        status: "open",
        stage: 1,
        ttl: 6000,
        body: [{stage1 : this.errorBody}],
      };

      try {
        await fetch("/api/POST_error", {
          method: "POST", // или 'PUT'
          body: JSON.stringify({ ...this.error }),
        });
      } finally {
        this.errorBody = {};
      }
      // await fetch(`/api/blob?fileName=${this.error.id}`, {
      //   method: "POST",
      //   body: formData,
      // });
    },
  },
  created() {
    // !this.$store.state.template && this.$store.dispatch("GET_template");
  },
  data() {
    return {
      errorTemplate: null,
      errorBody: {},
      error: {},
      photo: null,
    };
  },

  // async mounted() {
  //   try {
  //     if (!this.errorTemplate) {
  //       this.errorTemplate = await (
  //         await fetch("/api/templates/templateProject/ver1")
  //       ).json();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};
</script>

<style lang="css" scoped>
.error__field {
  margin: 10px;
  box-sizing: border-box;
}
</style>
