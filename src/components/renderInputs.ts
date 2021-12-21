import { h, defineComponent, PropType } from 'vue'
import { Extend } from '@/types/templateType'

export default defineComponent({
  name: 'renderInputs',
  render() {
    switch (this.dataRender._field) {
      case 'select':
        return h(
          'select',
          {
            required: this.required,
            value: this.modelValue[this.dataRender.name],
            onInput: ($event: Event) =>
              this.addVmodel($event, this.dataRender.name), // this.$emit('update:modelValue', {...this.modelValue, [this.dataRender.name] : $event.target.value}),
          },
          typeof this.dataRender.value !== 'string' &&
            this.dataRender.value.map((item) => {
              return h('option', item)
            })
        )
      case 'textarea':
        return h('textarea', {
          required: this.required,
          value: this.modelValue[this.dataRender.name],
          onInput: ($event: Event) =>
            this.addVmodel($event, this.dataRender.name),
          rows: 5,
        })
      case 'checkbox':
        return h('input', {
          type: 'checkbox',
          required: this.required,
          value: this.modelValue[this.dataRender.name],
          onInput: ($event: Event) =>
            this.addVmodel($event, this.dataRender.name),
        })
      case 'number':
        return h('input', {
          type: 'number',
          required: this.required,
          value: this.modelValue[this.dataRender.name],
          onInput: ($event: Event) =>
            this.addVmodel($event, this.dataRender.name),
          min: this.dataRender.min,
          max: this.dataRender.max,
        })
      case 'text':
        return h('input', {
          type: 'text',
          required: this.required,
          value: this.modelValue[this.dataRender.name],
          onInput: ($event: Event) =>
            this.addVmodel($event, this.dataRender.name),
        })
    }
  },
  methods: {
    addVmodel($event: Event, key: string) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [key]: ($event.target as HTMLInputElement).value,
      })
    },
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    dataRender: {
      type: Object as PropType<Extend|undefined>,
      required: true,
    },
    required: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
})
