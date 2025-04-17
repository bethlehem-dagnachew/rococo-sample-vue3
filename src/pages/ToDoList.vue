<template>
  <q-page class="flex justify-center">
    <div class="todo-container q-mt-xl">
      <div class="text-h2 text-center text-primary q-mb-xl" style="color: rgba(175, 47, 47, 0.15)">
        todos
      </div>

      <q-card flat bordered class="custom-card">
        <!-- Add Todo Input -->
        <div class="new-todo-wrapper">
          <div class="row items-center">
            <div class="toggle-all-wrapper q-pl-sm">
              <q-checkbox
                v-if="todos.length"
                v-model="allCompleted"
                color="primary"
                class="toggle-all"
                @update:model-value="toggleAll"
              />
            </div>
            <q-input
              v-model="newTodo"
              placeholder="What needs to be done?"
              dense
              borderless
              color="grey-4"
              class="new-todo col"
              @keyup.enter="addTodo"
            />
          </div>
        </div>

        <!-- Todo List -->
        <q-list separator>
          <TodoItem
            v-for="todo in todos"
            :key="todo.entity_id"
            :todo="todo"
            @update:todo="updateTodo"
            @delete="deleteTodo"
          />
        </q-list>

        <!-- todo filter -->
        <TodoFilter
          v-if="todos.length > 0"
          v-model:filter="filter"
          :items-left="activeCount"
          :has-completed="hasCompleted"
          @clear-completed="clearCompleted"
        />
      </q-card>

      <div class="text-center text-grey-7 q-mt-md text-caption">Double-click to edit a todo</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TodoService from 'src/services/todo.service'
import TodoItem from 'components/TodoItem.vue'
import TodoFilter from 'components/TodoFilter.vue'

const newTodo = ref('')
const filter = ref('all')
const todos = ref([])

const fetchTodos = async () => {
  try {
    todos.value = await TodoService.getAll(filter.value)
  } catch (error) {
    console.error('Failed to fetch todos:', error)
  }
}

onMounted(fetchTodos)
watch(filter, fetchTodos)

const activeCount = computed(() => todos.value.filter((todo) => !todo.is_completed).length)
const hasCompleted = computed(() => todos.value.some((todo) => todo.is_completed))

const allCompleted = computed({
  get: () => todos.value.length > 0 && todos.value.every((todo) => todo.is_completed),
  set: (val) => toggleAll(val),
})

const addTodo = async () => {
  const title = newTodo.value.trim()
  if (!title) return

  try {
    await TodoService.create(title)
    newTodo.value = ''
    await fetchTodos()
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
}

const updateTodo = async (updatedTodo) => {
  try {
    await TodoService.update(updatedTodo.entity_id, {
      title: updatedTodo.title,
      is_completed: updatedTodo.is_completed,
    })
    await fetchTodos()
  } catch (error) {
    console.error('Failed to update todo:', error)
  }
}

const deleteTodo = async (todo) => {
  try {
    await TodoService.delete(todo.entity_id)
    await fetchTodos()
  } catch (error) {
    console.error('Failed to delete todo:', error)
  }
}

const clearCompleted = async () => {
  try {
    await TodoService.clearCompleted()
    await fetchTodos()
  } catch (error) {
    console.error('Failed to clear completed todos:', error)
  }
}

const toggleAll = async (value) => {
  try {
    await Promise.all(
      todos.value.map((todo) =>
        TodoService.update(todo.entity_id, {
          title: todo.title,
          is_completed: value,
        })
      )
    )
    await fetchTodos()
  } catch (error) {
    console.error('Failed to toggle todos:', error)
  }
}
</script>


<style lang="scss" scoped>
.todo-container {
  width: 100%;
  max-width: 550px;
}

.custom-card {
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 16px 16px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.new-todo-wrapper {
  border-bottom: 1px solid #e6e6e6;
  position: relative;
}

.toggle-all-wrapper {
  width: 45px;
  height: 65px;
  display: flex;
  align-items: center;

  :deep(.q-checkbox) {
    height: 34px;
  }
}

.new-todo {
  font-size: 24px;
  font-weight: 300;

  :deep(.q-field__native) {
    padding: 16px 16px 16px 0;

    &::placeholder {
      font-style: italic;
      font-weight: 300;
      color: #918e8e;
    }
  }
}
</style>