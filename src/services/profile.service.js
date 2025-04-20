import axios from 'config/axios'

class ProfileService {
  async getProfile() {
    try {
      const response = await axios.get('/person/me')
      return response.data.person
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  }

  async updateProfile({ first_name, last_name }) {
    try {
      const updateData = {}
      if (first_name) updateData.first_name = first_name
      if (last_name) updateData.last_name = last_name

      const response = await axios.patch('/person/me', updateData)
      return response.data.person
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }
}

export default new ProfileService()
