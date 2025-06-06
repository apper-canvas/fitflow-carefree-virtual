import progressData from '../mockData/progress.json'

let progress = [...progressData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const progressService = {
  async getAll() {
    await delay(280)
    return [...progress]
  },

  async getById(id) {
    await delay(200)
    const entry = progress.find(p => p.id === id)
    return entry ? { ...entry } : null
  },

  async create(progressData) {
    await delay(400)
    const newEntry = {
      ...progressData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    }
    progress.push(newEntry)
    return { ...newEntry }
  },

  async update(id, updateData) {
    await delay(320)
    const index = progress.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Progress entry not found')
    }
    progress[index] = { ...progress[index], ...updateData }
    return { ...progress[index] }
  },

  async delete(id) {
    await delay(250)
    const index = progress.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Progress entry not found')
    }
    const deleted = progress.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default progressService