import exerciseData from '../mockData/exercises.json'

let exercises = [...exerciseData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const exerciseService = {
  async getAll() {
    await delay(250)
    return [...exercises]
  },

  async getById(id) {
    await delay(200)
    const exercise = exercises.find(e => e.id === id)
    return exercise ? { ...exercise } : null
  },

  async create(exerciseData) {
    await delay(350)
    const newExercise = {
      ...exerciseData,
      id: Date.now().toString(),
      sets: [],
      restTime: 60
    }
    exercises.push(newExercise)
    return { ...newExercise }
  },

  async update(id, updateData) {
    await delay(300)
    const index = exercises.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error('Exercise not found')
    }
    exercises[index] = { ...exercises[index], ...updateData }
    return { ...exercises[index] }
  },

  async delete(id) {
    await delay(250)
    const index = exercises.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error('Exercise not found')
    }
    const deleted = exercises.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default exerciseService