<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      style="padding: 15px 20px; font-size: 18px"
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
      :placeholder="placeholder"
      class="mt-1 block w-full rounded-lg border shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
      :class="{ 'border-red-500': error }"
    />
    <p v-if="error" class="text-sm text-red-600 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  modelValue: [String, Number],
  placeholder: String,
  error: String,
});

defineEmits(['update:modelValue']);
</script>
