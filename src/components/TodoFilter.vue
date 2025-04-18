<template>
  <div class="filter-section">
    <span class="todo-count"> {{ itemsLeft }} {{ itemsLeft === 1 ? 'item' : 'items' }} left </span>

    <div class="filters">
      <q-btn
        v-for="filterType in filterTypes"
        :key="filterType"
        flat
        no-caps
        :class="{ selected: filter === filterType }"
        :label="filterType.charAt(0).toUpperCase() + filterType.slice(1)"
        class="filter-btn"
        @click="$emit('update:filter', filterType)"
      />
    </div>

    <q-btn
      v-if="hasCompleted"
      flat
      no-caps
      class="clear-completed"
      label="Clear completed"
      @click="$emit('clear-completed')"
    />
    <div v-else class="clear-completed-placeholder"></div>
  </div>
</template>

<script setup>
const filterTypes = ['all', 'active', 'completed']

defineProps({
  filter: String,
  itemsLeft: Number,
  hasCompleted: Boolean,
})

defineEmits(['update:filter', 'clear-completed'])
</script>


<style lang="scss" scoped>
@import '../css/todo.scss';
</style> 