const progressService = {
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
      const tableName = 'progress'
      
      // All fields for display (including system fields)
      const allFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'date', 'weight'
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
      console.error("Error fetching progress:", error)
      throw error
    }
  },

  async getById(id) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'progress'
      
      // All fields for display
      const allFields = [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'date', 'weight'
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
      console.error(`Error fetching progress with ID ${id}:`, error)
      return null
    }
  },

  async create(progressData) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'progress'
      
      // Only updateable fields for creation
      const updateableData = {
        Name: progressData.name || progressData.Name || 'Progress Entry',
        Tags: progressData.tags || progressData.Tags || '',
        Owner: progressData.owner || progressData.Owner || '',
        date: progressData.date || new Date().toISOString().split('T')[0], // Date format YYYY-MM-DD
        weight: progressData.weight || 0
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
      
      throw new Error('Failed to create progress entry')
    } catch (error) {
      console.error("Error creating progress:", error)
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'progress'
      
      // Only updateable fields plus ID for update
      const updateableData = {
        Id: id,
        Name: updateData.name || updateData.Name,
        Tags: updateData.tags || updateData.Tags,
        Owner: updateData.owner || updateData.Owner,
        date: updateData.date,
        weight: updateData.weight
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
      
      throw new Error('Progress entry not found or update failed')
    } catch (error) {
      console.error("Error updating progress:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = this.getApperClient()
      const tableName = 'progress'
      
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
      
      throw new Error('Progress entry not found or deletion failed')
    } catch (error) {
      console.error("Error deleting progress:", error)
      throw error
    }
  }
}

export default progressService