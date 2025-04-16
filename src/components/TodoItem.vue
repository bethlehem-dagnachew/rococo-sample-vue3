<template>
  <q-item class="todo-item q-pa-sm" :class="{ completed: todo.completed }">
    <q-item-section avatar>
      <q-checkbox
        :model-value="todo.completed"
        @update:model-value="updateCompleted"
        color="primary"
        class="q-mr-sm"
      />
    </q-item-section>

    <q-item-section>
      <q-input
        v-if="editingTodoId === todo.id"
        v-model="editingTitle"
        dense
        autofocus
        class="edit-input"
        placeholder="Edit todo"
        @keyup.enter="saveEdit"
        @blur="saveEdit"
      />
      <q-item-label
        v-else
        class="todo-text"
        :class="{ 'text-strike': todo.completed }"
        @dblclick="startEditing"
      >
        {{ todo.title }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="row q-gutter-sm actions">
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

const editingTodoId = ref(null)
const editingTitle = ref('')

function updateCompleted(value) {
  emit('update:todo', {
    ...props.todo,
    completed: value,
  })
}

function startEditing() {
  editingTodoId.value = props.todo.id
  editingTitle.value = props.todo.title
}

function saveEdit() {
  if (editingTitle.value.trim()) {
    emit('update:todo', {
      ...props.todo,
      title: editingTitle.value.trim(),
    })
  }
  editingTodoId.value = null
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