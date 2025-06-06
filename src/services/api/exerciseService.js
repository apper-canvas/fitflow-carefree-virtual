const exerciseService = {
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
      const tableName = 'exercise'
      
      // All fields for display (including system fields)
      const allFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'category', 'muscle_groups', 'sets', 'rest_time'
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
      console.error("Error fetching exercises:", error)
      throw error
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'exercise'
      
      // All fields for display
      const allFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'category', 'muscle_groups', 'sets', 'rest_time'
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
      console.error(`Error fetching exercise with ID ${id}:`, error)
      return null
    }
  },

  async create(exerciseData) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'exercise'
      
      // Only updateable fields for creation
      const updateableData = {
        Name: exerciseData.name || exerciseData.Name || '',
        Tags: exerciseData.tags || exerciseData.Tags || '',
        Owner: exerciseData.owner || exerciseData.Owner || '',
        category: exerciseData.category || '',
        muscle_groups: exerciseData.muscleGroups || exerciseData.muscle_groups || '',
        sets: exerciseData.sets || '',
        rest_time: exerciseData.restTime || exerciseData.rest_time || 60
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
      
      throw new Error('Failed to create exercise')
    } catch (error) {
      console.error("Error creating exercise:", error)
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'exercise'
      
      // Only updateable fields plus ID for update
      const updateableData = {
        Id: id,
        Name: updateData.name || updateData.Name,
        Tags: updateData.tags || updateData.Tags,
        Owner: updateData.owner || updateData.Owner,
        category: updateData.category,
        muscle_groups: updateData.muscleGroups || updateData.muscle_groups,
        sets: updateData.sets,
        rest_time: updateData.restTime || updateData.rest_time
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
      
      throw new Error('Exercise not found or update failed')
    } catch (error) {
      console.error("Error updating exercise:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'exercise'
      
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
      
      throw new Error('Exercise not found or deletion failed')
    } catch (error) {
      console.error("Error deleting exercise:", error)
      throw error
    }
  }
}

export default exerciseService