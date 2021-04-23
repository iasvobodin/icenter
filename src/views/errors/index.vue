<template>
    <div
      v-for="(value, key, index) in errors"
      :key="index"
      class="errors__card"
      @click="chosseError(value.id)"
    >
        <div
          v-for="(val, key, index) in val.info"
          :key="index"
          class="cabinet__info__item"
        >
          <h3>{{ key }}:</h3>
          <p>
            {{ val }}
          </p>
        </div>
    </div>
    
  <div>
      <h1 @click="$router.push(`/errors/${errors[0].id}`)" v-if="errors">{{errors}}</h1>
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
