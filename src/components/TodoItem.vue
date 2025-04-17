<template>
  <div class="todo-item" :class="{ completed: todo.is_completed }">
    <q-checkbox
      :model-value="todo.is_completed"
      @update:model-value="updateCompleted"
      color="primary"
    />

    <q-input
      v-if="isEditing"
      v-model="editingTitle"
      dense
      autofocus
      class="edit-input"
      placeholder="Edit todo"
      @keyup.enter="saveEdit"
      @blur="saveEdit"
      @keyup.esc="cancelEdit"
    >
      <template v-slot:append>
        <q-icon name="edit" color="primary" />
      </template>
    </q-input>
    <div
      v-else
      class="todo-text"
      :class="{ 'text-strike': todo.is_completed }"
      @dblclick="startEditing"
    >
      {{ todo.title }}
    </div>

    <q-btn
      flat
      round
      dense
      icon="close"
      color="grey-7"
      class="delete-btn"
      @click="$emit('delete', todo)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:todo', 'delete'])

const isEditing = ref(false)
const editingTitle = ref('')

const updateCompleted = (value) => {
  emit('update:todo', {
    ...props.todo,
    is_completed: value,
  })
}

const startEditing = () => {
  isEditing.value = true
  editingTitle.value = props.todo.title
}

const saveEdit = () => {
  const title = editingTitle.value.trim()
  if (title && title !== props.todo.title) {
    emit('update:todo', {
      ...props.todo,
      title,
    })
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editingTitle.value = props.todo.title
}
</script>

<style lang="scss" scoped>
@import '../css/todo.scss';
</style> 