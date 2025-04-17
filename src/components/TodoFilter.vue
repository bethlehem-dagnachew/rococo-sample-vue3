<template>
  <div class="filter-section">
    <span class="todo-count"> {{ itemsLeft }} {{ itemsLeft === 1 ? 'item' : 'items' }} left </span>

    <div class="filters">
      <q-btn
        flat
        no-caps
        :class="{ selected: filter === 'all' }"
        label="All"
        class="filter-btn"
        @click="$emit('update:filter', 'all')"
      />
      <q-btn
        flat
        no-caps
        :class="{ selected: filter === 'active' }"
        label="Active"
        class="filter-btn"
        @click="$emit('update:filter', 'active')"
      />
      <q-btn
        flat
        no-caps
        :class="{ selected: filter === 'completed' }"
        label="Completed"
        class="filter-btn"
        @click="$emit('update:filter', 'completed')"
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