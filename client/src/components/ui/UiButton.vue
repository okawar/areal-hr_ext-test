<template>
  <button
    :type="type"
    :class="[
      'px-4 py-2 rounded-lg text-sm font-medium transition',
      variant === 'primary' ? 'bg-purple-600 text-white' : '',
      variant === 'secondary' ? 'text-gray-700' : '',
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  type: {
    type: String,
    default: 'button',
  },
});
</script>
