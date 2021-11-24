import { h } from 'vue'

export default {
  render() {
    switch (this.dataRender._field) {
      case 'select':
        return h(
          'select',
          {
            required: this.required,
            value: this.modelValue[this.dataRender.name],
            onInput: ($event) => this.addVmodel($event, this.dataRender.name), // this.$emit('update:modelValue', {...this.modelValue, [this.dataRender.name] : $event.target.value}),
          },
          this.dataRender.value.map((item) => {
            return h('option', item)
          })
        ) 
      case 'textarea':
        return h('textarea', {
          required: this.required,
          value: this.modelValue[this.dataRender.name],
          onInput: ($event) => this.addVmodel($event, this.dataRender.name),
          rows: 5,
        })
      case 'checkbox':
        return h('input', {
          type: 'checkbox',
          required: this.required,
          value: this.modelValue[this.dataRender.name],
          onInput: ($event) => this.addVmodel($event, this.dataRender.name),
        })
      case 'number':
        return h('input', {
          type: 'number',
          required: this.required,
          value: this.modelValue[this.dataRender.name],
          onInput: ($event) => this.addVmodel($event, this.dataRender.name),
          min: this.dataRender.min,
          max: this.dataRender.max,
        })
      case 'text':
        return h('input', {
          type: 'text',
          required: this.required,
          value: this.modelValue[this.dataRender.name],
          onInput: ($event) => this.addVmodel($event, this.dataRender.name),
        })
    }
  },
  methods: {
    addVmodel($event, key) {
      // console.log($event.target.value);
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [key]: $event.target.value,
      })
    },
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    dataRender: {
      type: Object,
      required: true,
    },
    required: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
}
