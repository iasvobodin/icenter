<template>
  <div
    v-for="(value, key, index) in dataRender"
    :key="index"
    :class="{ error__item__desc: key === 'Описание' }"
    class="error__item"
  >
    <h4
      :class="{ error__item__vertical__title: key === 'Описание' }"
      class="error__item__title"
    >
      {{ key }}
    </h4>
    <select
      v-if="Object.values(value)[0] === 'select'"
      :value="modelValue[key]"
      required
      class="error__item__desc"
      @input="addVmodel($event,key)
      "
    >
      <option v-for="(v, i) in Object.values(value)[1]" :key="i">
        {{ v }}
      </option>
    </select>
    <input
      v-if="Object.values(value)[0] === 'checkbox'"
      :value="modelValue[key]"
      required
      type="checkbox"
      @input="
       addVmodel($event,key)
      "
    />
    <input
      v-if="Object.values(value)[0] === 'number'"
      :value="modelValue[key]"
      required
      type="number"
      @input="
       addVmodel($event,key)
      "
    />
    <textarea
      v-if="Object.values(value)[0] === 'textarea'"
      :value="modelValue[key]"
      required
      cols="30"
      rows="5"
      @input="
       addVmodel($event,key)
      "
    ></textarea>
  </div>
  <div v-if="modelValue && modelValue['Ответственный']">
    <div class="error__item">
      <h4 class="error__item__title">
        {{ modelValue["Ответственный"] }}
      </h4>
      <select
        :value="modelValue['Ошибку допустил']"
        required
        class="error__item__desc"
        @input="
         addVmodel($event,'Ошибку допустил')
        "
      >
        <option
          v-for="(value, key, index) in $store.state.template[
            modelValue['Ответственный']
          ]"
          :key="index"
        >
          {{ value }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
    dataRender: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    addVmodel($event,key) {
              this.$emit('update:modelValue', {
          ...this.modelValue,
          [key]: $event.target.value,
        })
    }
  },
};
</script>

<style lang="css" scoped>
.error__item {
  border-bottom: 1px solid black;
  padding: 2px;
  padding-top: 6px;
  padding-bottom: 6px;
  display: grid;
  grid-template-columns: 2fr 3fr;
}
.error__item__title {
  justify-self: start;
  align-self: center;
  text-align: start;
  margin: 0;
}

.error__item__vertical__title {
  text-align: center;
  margin: 5px;
}
.error__item__desc {
  display: block;
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
}
</style>
