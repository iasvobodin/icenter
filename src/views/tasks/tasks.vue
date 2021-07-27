<template>
  <div>
    <!-- <h1>Раздел Tasks в разработке</h1> -->
    <component-a v-model="model" :data-render="{
                '_field': 'textarea',
                'value': '',
                name: 'f'
            }"/>
    <component-a v-model="model" :data-render="{
                '_field': 'select',
                'value': [
                    'Dmitry.Pavlov@Emerson.com',
                    'Ivan.Svobodin@Emerson.com',
                    'Andrey.Solodovnikov@Emerson.com',
                    'Ilgiz.Sibagatullin@Emerson.com',
                    'Yevgeny.Smirnov@Emerson.com'
                ],
                'name':'senior fitter'
            }" />
                <component-a v-model="model" :data-render="{
                '_field': 'checkbox',
                'value': '',
                'name':'fitter'
            }" />
  </div>
</template>

<script>
import {h, reactive, toRefs} from 'vue'

const ComponentA = {
  render() {

switch (this.dataRender._field) {
  case 'select':
    return h(
      'select', {
        value: this.modelValue[this.dataRender.name],
        onInput: $event => this.addVmodel($event, this.dataRender.name) // this.$emit('update:modelValue', {...this.modelValue, [this.dataRender.name] : $event.target.value}),
      }, this.dataRender.value.map((item) => {
        return h('option', item)
      })
    )
  case 'textarea':
    return h(
      'textarea', {
        value: this.modelValue[this.dataRender.name],
        onInput: $event => this.addVmodel($event, this.dataRender.name)
      }
    )
  case 'checkbox':
    return h(
      'input', {
        type: 'checkbox',
        value: this.modelValue[this.dataRender.name],
        onInput: $event => this.addVmodel($event, this.dataRender.name)
      }
    )
  case 'number':
    return h(
      'input', {
        type: 'number',
        value: this.modelValue[this.dataRender.name],
        onInput: $event => this.addVmodel($event, this.dataRender.name)
      }
    )
}

    // if (this.dataRender._field === 'select') {
    //   return h(
    //     'select', {
    //       value: this.modelValue[this.dataRender.name],
    //       onInput: $event => this.addVmodel($event,this.dataRender.name )// this.$emit('update:modelValue', {...this.modelValue, [this.dataRender.name] : $event.target.value}),
    //     }, this.dataRender.value.map((item) => {
    //       return h('option', item)
    //     })
    //   )
    // }
    // if (this.dataRender._field === 'textarea') {
    //   return h(
    //     'textarea', {
    //       value: this.modelValue[this.dataRender.name],
    //      onInput: $event => this.addVmodel($event,this.dataRender.name )
    //     }
    //   )
    // }
  },
  methods: {
    addVmodel($event,key) {
      // console.log($event.target.value);
              this.$emit('update:modelValue', {
          ...this.modelValue,
          [key]: $event.target.value,
        })
    }
  },
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    dataRender: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue'],
}

export default {
  components: {
   ComponentA,
  },
  setup() {
    const state = reactive({
      model:{}
    })
    return {...toRefs(state)};
  },
};
</script>

<style lang="css" scoped></style>
