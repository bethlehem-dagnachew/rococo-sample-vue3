import axiosInstance from './base.service'

class TodoService {
  async getAll(filter = 'all') {
    try {
      const response = await axiosInstance.get(`/todo?filter=${filter}`)
      return response.data.todos
    } catch (error) {
      console.error('Error fetching todos:', error)
      throw error
    }
  }

  async getById(entity_id) {
    try {
      const response = await axiosInstance.get(`/todo/${entity_id}`)
      return response.data.todos
    } catch (error) {
      console.error('Error fetching todo:', error)
      throw error
    }
  }

  async create(title) {
    try {
      const response = await axiosInstance.post('/todo', { title })
      return response.data.todos
    } catch (error) {
      console.error('Error creating todo:', error)
      throw error
    }
  }

  async update(entity_id, { title, is_completed }) {
    try {
      const response = await axiosInstance.patch(`/todo/${entity_id}`, {
        title,
        is_completed,
      })
      return response.data.todos
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  }

  async delete(entity_id) {
    try {
      const response = await axiosInstance.delete(`/todo/${entity_id}`)
      return response.data.todos
    } catch (error) {
      console.error('Error deleting todo:', error)
      throw error
    }
  }

  async toggleCompletion(entity_id) {
    try {
      const response = await axiosInstance.put(`/todo/${entity_id}/toggle`)
      return response.data.todos
    } catch (error) {
      console.error('Error toggling todo completion:', error)
      throw error
    }
  }

  async clearCompleted() {
    try {
      const response = await axiosInstance.delete('/todo')
      return response.data.todos
    } catch (error) {
      console.error('Error clearing completed todos:', error)
      throw error
    }
  }

  async markAll(status) {
    try {
      const response = await axiosInstance.post('/todo/mark-all', { status })
      return response.data
    } catch (error) {
      console.error('Error marking all todos:', error)
      throw error
    }
  }

  async reorder(todoIds) {
    try {
      const response = await axiosInstance.post('/todo/reorder', { todo_ids: todoIds })
      return response.data
    } catch (error) {
      console.error('Error reordering todos:', error)
      throw error
    }
  }
}

export default new TodoService()
