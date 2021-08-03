<template>
  <div
    v-for="(value, key, index) in dataRender"
    :key="index"
    class="error__item"
    :class="{ error__item__desc: key === 'Описание',
              disble__grid : !onlyField
     }"
  >
    <h4 v-if="onlyField"
      :class="{ error__item__vertical__title: key === 'Описание' }"
      class="error__item__title"
    >
      {{ key }}
    </h4>
    <select
    v-if="Object.values(value)[0] === 'select'"
    :form="formId"
      :name="key"
      :value="modelValue[key]"
      :required="required"
      class="error__item__desc"
      @input="addVmodel($event,key)
      "
    >
      <option v-for="(v, i) in Object.values(value)[2]" :key="i">
        {{ v }}
      </option>
    </select>
    <input
    v-if="Object.values(value)[0] === 'checkbox'"
    :form="formId"
      :name="key"
      :value="modelValue[key]"
      :required="required"
      type="checkbox"
      @input="
       addVmodel($event,key)
      "
    />
    <input
    v-if="Object.values(value)[0] === 'number'"
    :form="formId"
      :name="key"
      :value="modelValue[key]"
      :required="required"
      type="number"
      @input="
       addVmodel($event,key)
      "
    />
    <textarea
    v-if="Object.values(value)[0] === 'textarea'"
    :form="formId"
      :name="key"
      :value="modelValue[key]"
      :required="required"
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
      :form="formId"
      :name="key"
        :value="modelValue['Ошибку допустил']"
        :required="required"
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
// import {h} from 'vue'

// const ComponentA = {
//     render() {
//     return h(
//       'p', // имя тега
//        'TEST all work'
//     )
//   },
//   props: {
//     type: {
//       type: String,
//       required: true
//     }
//   }
// }
export default {
  //   components: {
  //  ComponentA,
  // },
  props: {
    onlyField:{
       type: Boolean,
      default:()=> true
    },
    formId:{
      type: String,
      default:"form"
    },
    modelValue: {
      type: Object,
      default: () => {},
    },
    dataRender: {
      type: Object,
      required: true,
    },
    required:{
      type: Boolean,
      default:()=> true
    }
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
.disble__grid{
  grid-template-columns: 1fr;
  border-bottom: 1px solid transparent;
}
</style>
