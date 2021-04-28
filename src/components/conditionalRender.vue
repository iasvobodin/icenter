<template>
  <div
    :class="{ error__item__desc: key === 'Описание' }"
    class="error__item"
    v-for="(value, key, index) in dataRender"
    :key="index"
  >
    <h4
      :class="{ error__item__vertical__title: key === 'Описание' }"
      class="error__item__title"
    >
      {{ key }}
    </h4>
    <select
      @input="
        $emit('update:modelValue', {
          ...modelValue,
          [key]: $event.target.value,
        })
      "
      value=" "
      required
      class="error__item__desc"
      v-if="Object.values(value)[0] === 'select'"
    >
      <option v-for="(v, i) in Object.values(value)[1]" :key="i">
        {{ v }}
      </option>
    </select>
    <input
      @input="
        $emit('update:modelValue', {
          ...modelValue,
          [key]: $event.target.value,
        })
      "
      value=" "
      required
      v-if="Object.values(value)[0] === 'checkbox'"
      type="checkbox"
    />
    <input
      @input="
        $emit('update:modelValue', {
          ...modelValue,
          [key]: $event.target.value,
        })
      "
      value=" "
      required
      v-if="Object.values(value)[0] === 'number'"
      type="number"
    />
    <textarea
      @input="
        $emit('update:modelValue', {
          ...modelValue,
          [key]: $event.target.value,
        })
      "
      required
      v-if="Object.values(value)[0] === 'textarea'"
      cols="30"
      rows="5"
    ></textarea>
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
  //   computed: {
  //     value: {
  //       get() {
  //         return this.modelValue;
  //       },
  //       set(value) {
  //         this.$emit("update:modelValue", value);
  //       },
  //     },
  //   },
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
