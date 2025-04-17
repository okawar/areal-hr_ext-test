<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    default: () => []
  },
  label: String,
  placeholder: {
    type: String,
    default: 'Выберите значение'
  },
  error: String,
  optionLabel: {
    type: String,
    default: null
  },
  optionValue: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const processedOptions = computed(() => {
  return props.options.filter(option => option !== undefined && option !== null)
})

const getOptionLabel = (option) => {
  if (props.optionLabel) {
    return option[props.optionLabel]
  }
  return option
}

const getOptionValue = (option) => {
  if (props.optionValue) {
    return option[props.optionValue]
  }
  return option
}

const selectedOption = computed(() => {
  if (!props.modelValue) return null
  
  return processedOptions.value.find(option => {
    const value = props.optionValue ? option[props.optionValue] : option
    return String(value) === String(props.modelValue)
  })
})

const handleChange = (event) => {
  const value = event.target.value
  const parsedValue = props.optionValue ? Number(value) : value
  emit('update:modelValue', value === '' ? null : parsedValue)
}

</script>

<template>
  <div class="mb-4">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <select
        :value="modelValue"
        @change="handleChange"
        class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        :class="{ 'border-red-500': error }"
      >
        <option value="">{{ placeholder }}</option>
        <template v-for="(option, index) in processedOptions" :key="index">
          <option v-if="$slots.option" :value="getOptionValue(option)">
            {{ getOptionLabel(option) }}
          </option>
          <option v-else :value="getOptionValue(option)">
            {{ getOptionLabel(option) }}
          </option>
        </template>
      </select>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>