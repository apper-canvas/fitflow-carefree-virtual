const workoutService = {
  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  },

  async getAll() {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'workout'
      
      // All fields for display (including system fields)
      const allFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'exercises', 'completed_date', 'duration', 'scheduled_date'
      ]

      const params = {
        fields: allFields,
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }
      
      return response.data
    } catch (error) {
      console.error("Error fetching workouts:", error)
      throw error
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'workout'
      
      // All fields for display
      const allFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'exercises', 'completed_date', 'duration', 'scheduled_date'
      ]

      const params = {
        fields: allFields
      }

      const response = await apperClient.getRecordById(tableName, id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching workout with ID ${id}:`, error)
      return null
    }
  },

  async create(workoutData) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'workout'
      
      // Only updateable fields for creation
      const updateableData = {
        Name: workoutData.name || workoutData.Name || '',
        Tags: workoutData.tags || workoutData.Tags || '',
        Owner: workoutData.owner || workoutData.Owner || '',
        exercises: workoutData.exercises || '',
        completed_date: workoutData.completedDate || workoutData.completed_date || null,
        duration: workoutData.duration || 0,
        scheduled_date: workoutData.scheduledDate || workoutData.scheduled_date || null
      }

      const params = {
        records: [updateableData]
      }

      const response = await apperClient.createRecord(tableName, params)
      
      if (response && response.success && response.results && response.results.length > 0) {
        const successfulRecord = response.results.find(result => result.success)
        if (successfulRecord) {
          return successfulRecord.data
        }
      }
      
      throw new Error('Failed to create workout')
    } catch (error) {
      console.error("Error creating workout:", error)
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'workout'
      
      // Only updateable fields plus ID for update
      const updateableData = {
        Id: id,
        Name: updateData.name || updateData.Name,
        Tags: updateData.tags || updateData.Tags,
        Owner: updateData.owner || updateData.Owner,
        exercises: updateData.exercises,
        completed_date: updateData.completedDate || updateData.completed_date,
        duration: updateData.duration,
        scheduled_date: updateData.scheduledDate || updateData.scheduled_date
      }

      // Remove undefined values
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === undefined) {
          delete updateableData[key]
        }
      })

      const params = {
        records: [updateableData]
      }

      const response = await apperClient.updateRecord(tableName, params)
      
      if (response && response.success && response.results && response.results.length > 0) {
        const successfulUpdate = response.results.find(result => result.success)
        if (successfulUpdate) {
          return successfulUpdate.data
        }
      }
      
      throw new Error('Workout not found or update failed')
    } catch (error) {
      console.error("Error updating workout:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'workout'
      
      const params = {
        RecordIds: [id]
      }

      const response = await apperClient.deleteRecord(tableName, params)
      
      if (response && response.success && response.results && response.results.length > 0) {
        const successfulDeletion = response.results.find(result => result.success)
        if (successfulDeletion) {
          return true
        }
      }
      
      throw new Error('Workout not found or deletion failed')
    } catch (error) {
      console.error("Error deleting workout:", error)
      throw error
    }
  },

  // Timer integration methods (keeping for compatibility)
  async startRestTimer(duration = 60) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      duration,
      startedAt: Date.now(),
      status: 'running'
    }
  },

  async pauseRestTimer(timerId) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      timerId,
      pausedAt: Date.now(),
      status: 'paused'
    }
  }
}

export default workoutService