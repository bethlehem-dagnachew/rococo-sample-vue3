<template>
  <q-page class="flex flex-center column">
    <div class="welcome-container">
      <div class="welcome-card">
        <div class="welcome-header">
          <h4 class="welcome-title">
            Welcome back, {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
          </h4>
          <p class="welcome-subtitle">Here's what's happening with your account today</p>
        </div>

        <div class="stats-container">
          <div class="stat-card">
            <q-icon name="task_alt" size="32px" color="primary" />
            <div class="stat-content">
              <template v-if="isLoading">
                <q-skeleton type="text" width="40px" height="24px" />
                <q-skeleton type="text" width="80px" height="16px" />
              </template>
              <template v-else>
                <span class="stat-value">{{ activeTasksCount }}</span>
                <span class="stat-label">Active Tasks</span>
              </template>
            </div>
          </div>

          <div class="stat-card">
            <q-icon name="check_circle" size="32px" color="positive" />
            <div class="stat-content">
              <template v-if="isLoading">
                <q-skeleton type="text" width="40px" height="24px" />
                <q-skeleton type="text" width="80px" height="16px" />
              </template>
              <template v-else>
                <span class="stat-value">{{ completedTasksCount }}</span>
                <span class="stat-label">Completed Tasks</span>
              </template>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h5 class="section-title">Quick Actions</h5>
          <div class="action-buttons">
            <q-btn
              flat
              color="primary"
              icon="add_task"
              label="Add New Task"
              class="action-btn"
              @click="$router.push('/todo-list')"
            />
            <q-btn
              flat
              color="primary"
              icon="person"
              label="View Profile"
              class="action-btn"
              @click="$router.push('/profile')"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'
import TodoService from 'src/services/todo.service'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const $q = useQuasar()

const activeTasksCount = ref(0)
const completedTasksCount = ref(0)
const isLoading = ref(true)

const fetchTaskCounts = async () => {
  isLoading.value = true
  try {
    const activeTasks = await TodoService.getAll('active')
    const completedTasks = await TodoService.getAll('completed')

    activeTasksCount.value = activeTasks.length
    completedTasksCount.value = completedTasks.length
  } catch (error) {
    console.error('Failed to fetch task counts:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to load task statistics',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchTaskCounts)
</script>

<style lang="scss" scoped>
@import '../css/index.scss';
</style>