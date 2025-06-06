const TIMER_STORAGE_KEY = 'fitness-timer-preferences'

// Default timer preferences
const defaultPreferences = {
  lastUsedInterval: 60,
  preferredSound: 'bell',
  volume: 0.8,
  autoStart: false,
  showNotifications: true
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const timerService = {
  // Get user timer preferences
  async getPreferences() {
    await delay(100)
    try {
      const stored = localStorage.getItem(TIMER_STORAGE_KEY)
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences
    } catch (error) {
      console.error('Error loading timer preferences:', error)
      return defaultPreferences
    }
  },

  // Save user timer preferences
  async savePreferences(preferences) {
    await delay(150)
    try {
      const updatedPreferences = { ...defaultPreferences, ...preferences }
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(updatedPreferences))
      return updatedPreferences
    } catch (error) {
      console.error('Error saving timer preferences:', error)
      throw new Error('Failed to save timer preferences')
    }
  },

  // Update specific preference
  async updatePreference(key, value) {
    await delay(100)
    const current = await this.getPreferences()
    return this.savePreferences({ ...current, [key]: value })
  },

  // Get available sound options
  async getAvailableSounds() {
    await delay(50)
    return [
      { id: 'bell', name: 'Bell', file: '/sounds/bell.mp3' },
      { id: 'chime', name: 'Chime', file: '/sounds/chime.mp3' },
      { id: 'ding', name: 'Ding', file: '/sounds/ding.mp3' },
      { id: 'notification', name: 'Notification', file: '/sounds/notification.mp3' },
      { id: 'beep', name: 'Beep', file: '/sounds/beep.mp3' }
    ]
  },

  // Get predefined interval options
  async getPredefinedIntervals() {
    await delay(50)
    return [
      { value: 30, label: '30 seconds', display: '0:30' },
      { value: 45, label: '45 seconds', display: '0:45' },
      { value: 60, label: '1 minute', display: '1:00' },
      { value: 90, label: '1.5 minutes', display: '1:30' },
      { value: 120, label: '2 minutes', display: '2:00' },
      { value: 180, label: '3 minutes', display: '3:00' },
      { value: 300, label: '5 minutes', display: '5:00' }
    ]
  },

  // Format time for display
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  },

  // Create timer session
  async createSession(duration, preferences = {}) {
    await delay(100)
    return {
      id: Date.now().toString(),
      duration,
      remainingTime: duration,
      status: 'ready', // ready, running, paused, completed
      startedAt: null,
      pausedAt: null,
      completedAt: null,
      preferences: { ...defaultPreferences, ...preferences }
    }
  },

  // Log timer completion for analytics
  async logTimerCompletion(sessionData) {
    await delay(100)
    try {
      const completionLog = {
        sessionId: sessionData.id,
        duration: sessionData.duration,
        completedAt: new Date().toISOString(),
        wasCompleted: sessionData.status === 'completed'
      }
      
      // Store in local storage for now (could be sent to analytics service)
      const logs = JSON.parse(localStorage.getItem('timer-completion-logs') || '[]')
      logs.push(completionLog)
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100)
      }
      
      localStorage.setItem('timer-completion-logs', JSON.stringify(logs))
      return completionLog
    } catch (error) {
      console.error('Error logging timer completion:', error)
    }
  }
}

export default timerService