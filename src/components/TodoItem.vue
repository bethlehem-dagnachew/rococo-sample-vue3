<template>
  <q-item class="todo-item q-pa-sm" :class="{ completed: todo.is_completed }">
    <q-item-section avatar>
      <q-checkbox
        :model-value="todo.is_completed"
        @update:model-value="updateCompleted"
        color="primary"
        class="q-mr-sm"
      />
    </q-item-section>

    <q-item-section>
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
      />
      <q-item-label
        v-else
        class="todo-text"
        :class="{ 'text-strike': todo.is_completed }"
        @dblclick="startEditing"
      >
        {{ todo.title }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-btn
        flat
        round
        dense
        icon="close"
        color="grey-7"
        class="delete-btn"
        @click="$emit('delete', todo)"
      />
    </q-item-section>
  </q-item>
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
.todo-item {
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  &.completed {
    opacity: 0.7;
  }

  .todo-text {
    font-size: 24px;
    font-weight: 300;
    font-style: italic;
    color: #918e8e;
  }

  .edit-input {
    :deep(.q-field__native) {
      font-size: 24px;
      font-weight: 300;
      font-style: italic;
      color: #918e8e;

      &::placeholder {
        color: #918e8e;
        opacity: 0.7;
      }
    }
  }

  .actions {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover .actions {
    opacity: 1;
  }

  .text-strike {
    text-decoration: line-through;
    color: rgba(145, 142, 142, 0.5);
  }

  .delete-btn {
    opacity: 0.5;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
      color: #ff4444 !important;
    }
  }
}
</style> 