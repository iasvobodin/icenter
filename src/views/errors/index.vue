<template>
  <div>
      <h1 v-if="errors"> !!!!!!!!!!!!!!!!!!!!!!!{{errors}}</h1>
  </div>
</template>

<script>
export default {
    data() {
        return {
            errors: null
        }
    },
    methods: {
      async  getErrors() {
       const resErrors =   await fetch(`/api/errors?status=${"open"}`)
       this.errors = await resErrors.json()
        }
    },
    created () {
       this.getErrors() ;
    },
};
</script>

<style lang="scss" scoped></style>
