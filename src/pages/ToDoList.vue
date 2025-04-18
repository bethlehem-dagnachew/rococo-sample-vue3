<template>
  <q-page class="flex justify-center">
    <div class="todo-container">
      <div class="todo-header">
        <span>Todos</span>
      </div>

      <q-card flat bordered class="custom-card">
        <!-- Add Todo Input -->
        <div class="new-todo-wrapper">
          <div class="row items-center">
            <div class="toggle-all-wrapper">
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
              class="new-todo col"
              @keyup.enter="addTodo"
            >
            </q-input>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="q-pa-md">
          <q-skeleton type="text" v-for="n in 3" :key="n" class="q-mb-sm" />
        </div>

        <!-- Todo List -->
        <q-list v-else separator>
          <TodoItem
            v-for="(todo, index) in todos"
            :key="todo.entity_id"
            :todo="todo"
            :index="index"
            @update:todo="updateTodo"
            @delete="deleteTodo"
            @reorder="handleReorder"
          />
        </q-list>

        <!-- todo filter -->
        <TodoFilter
          v-if="hasAnyTodos"
          v-model:filter="filter"
          :items-left="activeCount"
          :has-completed="hasCompleted"
          @clear-completed="clearCompleted"
        />
      </q-card>

      <div class="edit-hint">
        <q-icon name="info" color="grey-6" size="sm" />
        <span>Double-click to edit a todo</span>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TodoService from 'src/services/todo.service'
import TodoItem from 'components/TodoItem.vue'
import TodoFilter from 'components/TodoFilter.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const newTodo = ref('')
const filter = ref('all')
const todos = ref([])
const allTodos = ref([])
const isLoading = ref(true)

const fetchTodos = async () => {
  isLoading.value = true
  try {
    if (allTodos.value.length === 0) {
      allTodos.value = await TodoService.getAll('all')
    }
    todos.value = await TodoService.getAll(filter.value)
  } catch (error) {
    console.error('Failed to fetch todos:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch todos',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchTodos)
watch(filter, fetchTodos)

const activeCount = computed(() => todos.value.filter((todo) => !todo.is_completed).length)
const hasCompleted = computed(() => todos.value.some((todo) => todo.is_completed))
const hasAnyTodos = computed(() => allTodos.value.length > 0)

const allCompleted = computed({
  get: () => todos.value.length > 0 && todos.value.every((todo) => todo.is_completed),
  set: (val) => toggleAll(val),
})

const handleReorder = async ({ fromIndex, toIndex }) => {
  try {
    const reorderedTodos = [...todos.value]
    const [movedItem] = reorderedTodos.splice(fromIndex, 1)
    reorderedTodos.splice(toIndex, 0, movedItem)

    todos.value = reorderedTodos

    const todoIds = reorderedTodos.map((todo) => todo.entity_id)
    await TodoService.reorder(todoIds)
  } catch (error) {
    console.error('Failed to reorder todos:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to reorder todos',
    })
    await fetchTodos()
  }
}

const addTodo = async () => {
  const title = newTodo.value.trim()
  if (!title) return

  try {
    await TodoService.create(title)
    newTodo.value = ''
    allTodos.value = await TodoService.getAll('all')
    await fetchTodos()
  } catch (error) {
    console.error('Failed to add todo:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to add todo',
    })
  }
}

const updateTodo = async (updatedTodo) => {
  try {
    await TodoService.update(updatedTodo.entity_id, {
      title: updatedTodo.title,
      is_completed: updatedTodo.is_completed,
    })
    allTodos.value = await TodoService.getAll('all')
    await fetchTodos()
  } catch (error) {
    console.error('Failed to update todo:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to update todo',
    })
  }
}

const deleteTodo = async (todo) => {
  try {
    await TodoService.delete(todo.entity_id)
    allTodos.value = await TodoService.getAll('all')
    await fetchTodos()
  } catch (error) {
    console.error('Failed to delete todo:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to delete todo',
    })
  }
}

const clearCompleted = async () => {
  try {
    await TodoService.clearCompleted()
    allTodos.value = await TodoService.getAll('all')
    await fetchTodos()
  } catch (error) {
    console.error('Failed to clear completed todos:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to clear completed todos',
    })
  }
}

const toggleAll = async (value) => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const status = value ? 'completed' : 'active'
    await TodoService.markAll(status)
    allTodos.value = await TodoService.getAll('all')
    await fetchTodos()
  } catch (error) {
    console.error('Failed to toggle todos:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to toggle todos',
    })
  } finally {
    isLoading.value = false
  }
}
</script>


<style lang="scss" scoped>
@import '../css/todo.scss';
</style>