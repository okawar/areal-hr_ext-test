<script setup>
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
  <div class="overflow-x-auto bg-white rounded-2xl shadow-md">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
        <tr>
          <th class="px-6 py-4 text-left">ID</th>
          <th class="px-6 py-4 text-left">Название</th>
          <th class="px-6 py-4 text-left">Организация</th>
          <th class="px-6 py-4 text-left">Действия</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="department in departments" :key="department.id" class="hover:bg-gray-50 transition">
          <td class="px-6 py-4">{{ department.id }}</td>
          <td class="px-6 py-4">{{ department.name }}</td>
          <td class="px-6 py-4">
            {{ getOrganizationName(department.organization_id) }}
          </td>
          <td class="px-6 py-4 space-x-2">
            <button
              @click="$emit('edit', department)"
              class="text-sm px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Редактировать
            </button>
            <button
              @click="handleDelete(department.id)"
              class="text-sm px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
            >
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>