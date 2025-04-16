<template>
  <div class="filter-section q-px-md q-py-sm">
    <div class="row items-center justify-between">
      <!-- Items counter -->
      <span class="todo-count text-grey-8">
        {{ itemsLeft }} {{ itemsLeft === 1 ? 'item' : 'items' }} left
      </span>

      <!-- Filters -->
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

      <!-- Clear completed -->
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
  </div>
</template>

<script setup>
defineProps({
  filter: {
    type: String,
    required: true,
  },
  itemsLeft: {
    type: Number,
    required: true,
  },
  hasCompleted: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['update:filter', 'clear-completed'])
</script>

<style lang="scss" scoped>
.filter-section {
  color: #777;
  border-top: 1px solid #e6e6e6;
  min-height: 44px;
  background: #fff;
}

.todo-count {
  font-size: 14px;
  font-weight: 500;
  min-width: 85px;
}

.filters {
  display: flex;
  gap: 4px;

  .filter-btn {
    color: #777;
    font-weight: 500;
    min-width: 70px;
    border-radius: 6px;
    padding: 4px 12px;
    transition: all 0.3s ease;

    &:hover {
      color: #1976d2;
      background: rgba(147, 194, 228, 0.06);
    }

    &.selected {
      color: #1976d2;
      background: rgba(147, 194, 228, 0.06);
    }
  }
}

.clear-completed {
  font-size: 14px;
  color: #777;
  min-width: 110px;
  font-weight: 500;
  border-radius: 6px;
  padding: 4px 12px;
  transition: all 0.3s ease;

  &:hover {
    color: #1976d2;
    background: rgba(147, 194, 228, 0.06);
  }
}

.clear-completed-placeholder {
  min-width: 110px;
}
</style> 