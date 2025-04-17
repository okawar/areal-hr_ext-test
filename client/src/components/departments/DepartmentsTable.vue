<script setup>
import UiButton from '../ui/UiButton.vue'

const props = defineProps({
  departments: {
    type: Array,
    required: true
  },
  organizations: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'refresh'])

const getOrganizationName = (id) => {
  const org = props.organizations.find(o => o.id === id)
  return org ? org.name : '—'
}

const handleDelete = async (id) => {
  if (confirm('Удалить этот отдел?')) {
    try {
      await emit('delete', id)
      emit('refresh')
    } catch (e) {
      console.error('Ошибка при удалении:', e)
    }
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Название
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Организация
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="department in departments" :key="department.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ department.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ department.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium">
                {{ getOrganizationName(department.organization_id) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <UiButton
                  @click="$emit('edit', department)"
                  class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg transition"
                >
                  Редактировать
                </UiButton>
                <UiButton
                  @click="handleDelete(department.id)"
                  class="px-3 py-1 bg-red-600 text-red-600 rounded-lg transition"
                >
                  Удалить
                </UiButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
