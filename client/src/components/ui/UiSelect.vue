<script setup>
defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true,
  },
  optionValue: {
    type: String,
    default: 'id',
  },
  optionLabel: {
    type: [String, Function],
    default: 'name',
  },
  error: String,
  label: String,
  id: String,
});
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <select
      :id="id"
      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      :class="{ 'border-red-500': error }"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
      <option disabled value="">Выберите</option>
      <option v-for="option in options" :key="option[optionValue]" :value="option[optionValue]">
        {{ typeof optionLabel === 'function' ? optionLabel(option) : option[optionLabel] }}
      </option>
    </select>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>
