import workoutData from '../mockData/workouts.json'

let workouts = [...workoutData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const workoutService = {
  async getAll() {
    await delay(300)
    return [...workouts]
  },

  async getById(id) {
    await delay(200)
    const workout = workouts.find(w => w.id === id)
    return workout ? { ...workout } : null
  },

  async create(workoutData) {
    await delay(400)
    const newWorkout = {
      ...workoutData,
      id: Date.now().toString(),
      completedDate: null,
      duration: 0
    }
    workouts.push(newWorkout)
    return { ...newWorkout }
  },

  async update(id, updateData) {
    await delay(300)
    const index = workouts.findIndex(w => w.id === id)
    if (index === -1) {
      throw new Error('Workout not found')
    }
    workouts[index] = { ...workouts[index], ...updateData }
    return { ...workouts[index] }
  },

  async delete(id) {
    await delay(250)
    const index = workouts.findIndex(w => w.id === id)
    if (index === -1) {
      throw new Error('Workout not found')
    }
    const deleted = workouts.splice(index, 1)[0]
    return { ...deleted }
},

  // Timer integration methods
  async startRestTimer(duration = 60) {
    await delay(100)
    return {
      duration,
      startedAt: Date.now(),
      status: 'running'
    }
  },

  async pauseRestTimer(timerId) {
    await delay(100)
    return {
      timerId,
      pausedAt: Date.now(),
      status: 'paused'
    }
  }
}

export default workoutService