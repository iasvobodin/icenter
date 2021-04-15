<template>
  <div class="about">
    <h1>User page</h1>
    <h2 v-if="$store.state.user.authInfo.userDetails.userDetails">
      {{ $store.state.user.authInfo.userDetails.userDetails }}
    </h2>
    <Suspense>
      <template #default>
        <user-errors />
      </template>
      <template #fallback>
        <div>Loading errrorrrrrs</div>
      </template>
    </Suspense>
  </div>
</template>

<script>
import userErrors from "@/components/userErrors";
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    userErrors,
  },
  methods: {
    async getUserErrors() {
    !window.sessionStorage.getItem("userDetails") &&  await this.$store.dispatch("GET_auth");
      // console.log(window.sessionStorage.getItem("userDetails"), "11111");
      try {
        const responsErrors = await fetch(
          `/api/user/${window.sessionStorage.getItem("userDetails")}`
        );
        try {
          this.errors = await responsErrors.json();
        } catch (error) {
          console.error("this.errors.json", error);
          this.errors = [];
        }
      } catch (error) {
        console.log("errors is not def", error);
      }
    },
  },
  data() {
    return {
      user: null,
      userName: "",
      errors: null,
    };
  },
  created() {
    this.getUserErrors();
  },
};
</script>

<style lang="css" scoped></style>
