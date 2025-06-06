import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import workoutService from '../services/api/workoutService'

const MainFeature = ({ workouts, setWorkouts, exercises }) => {
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isWorkoutBuilder, setIsWorkoutBuilder] = useState(false)
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    exercises: [],
    scheduledDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    let interval = null
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimeElapsed(timeElapsed => timeElapsed + 1)
      }, 1000)
    } else if (!isTimerActive && timeElapsed !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isTimerActive, timeElapsed])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const startWorkout = (workout) => {
    setActiveWorkout(workout)
    setCurrentExerciseIndex(0)
    setTimeElapsed(0)
    setIsTimerActive(true)
    toast.success(`Started ${workout.name}!`)
  }

  const pauseWorkout = () => {
    setIsTimerActive(!isTimerActive)
    toast.info(isTimerActive ? 'Workout paused' : 'Workout resumed')
  }

  const nextExercise = () => {
    if (activeWorkout && currentExerciseIndex < (activeWorkout.exercises?.length || 0) - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      toast.info('Moving to next exercise')
    }
  }

  const completeWorkout = async () => {
    if (activeWorkout) {
      try {
        const updatedWorkout = {
          ...activeWorkout,
          completedDate: new Date().toISOString(),
          duration: Math.floor(timeElapsed / 60)
        }
        
        await workoutService.update(activeWorkout.id, updatedWorkout)
        setWorkouts(prevWorkouts => 
          prevWorkouts.map(w => w.id === activeWorkout.id ? updatedWorkout : w)
        )
        
        setActiveWorkout(null)
        setIsTimerActive(false)
        setTimeElapsed(0)
        setCurrentExerciseIndex(0)
        toast.success('Workout completed! Great job!')
      } catch (error) {
        toast.error('Failed to complete workout')
      }
    }
  }

  const createWorkout = async () => {
    if (!newWorkout.name.trim()) {
      toast.error('Please enter a workout name')
      return
    }

    try {
      const workout = await workoutService.create({
        ...newWorkout,
        id: Date.now().toString(),
        exercises: newWorkout.exercises,
        completedDate: null,
        duration: 0,
        notes: ''
      })
      
      setWorkouts(prevWorkouts => [...prevWorkouts, workout])
      setNewWorkout({
        name: '',
        exercises: [],
        scheduledDate: new Date().toISOString().split('T')[0]
      })
      setIsWorkoutBuilder(false)
      toast.success('Workout created successfully!')
    } catch (error) {
      toast.error('Failed to create workout')
    }
  }

  const addExerciseToWorkout = (exercise) => {
    const workoutExercise = {
      ...exercise,
      sets: [{ reps: 0, weight: 0, duration: 0, completed: false }]
    }
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, workoutExercise]
    }))
    toast.success(`Added ${exercise.name} to workout`)
  }

  const removeExerciseFromWorkout = (index) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }))
    toast.info('Exercise removed from workout')
  }

  const quickStartWorkouts = workouts.filter(w => !w.completedDate).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Active Workout Timer */}
      <AnimatePresence>
        {activeWorkout && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-r from-primary via-primary-dark to-secondary p-6 rounded-2xl text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-bold">{activeWorkout.name}</h3>
              <button
                onClick={() => {
                  setActiveWorkout(null)
                  setIsTimerActive(false)
                  setTimeElapsed(0)
                }}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-mono font-bold mb-2">
                {formatTime(timeElapsed)}
              </div>
              <p className="text-primary-light">
                Exercise {currentExerciseIndex + 1} of {activeWorkout.exercises?.length || 0}
              </p>
              {activeWorkout.exercises && activeWorkout.exercises[currentExerciseIndex] && (
                <p className="text-lg font-medium mt-2">
                  {activeWorkout.exercises[currentExerciseIndex].name}
                </p>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={pauseWorkout}
                className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <ApperIcon name={isTimerActive ? 'Pause' : 'Play'} size={20} className="mr-2" />
                {isTimerActive ? 'Pause' : 'Resume'}
              </button>
              {currentExerciseIndex < (activeWorkout.exercises?.length || 0) - 1 && (
                <button
                  onClick={nextExercise}
                  className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ApperIcon name="SkipForward" size={20} className="mr-2" />
                  Next Exercise
                </button>
              )}
              <button
                onClick={completeWorkout}
                className="flex items-center px-4 py-2 bg-green-500/80 rounded-lg hover:bg-green-500 transition-colors"
              >
                <ApperIcon name="CheckCircle" size={20} className="mr-2" />
                Complete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Builder */}
      <AnimatePresence>
        {isWorkoutBuilder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-surface-900 dark:text-white">
                Create New Workout
              </h3>
              <button
                onClick={() => setIsWorkoutBuilder(false)}
                className="p-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Workout Name
                </label>
                <input
                  type="text"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter workout name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={newWorkout.scheduledDate}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Selected Exercises */}
            {newWorkout.exercises.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-surface-900 dark:text-white mb-3">Selected Exercises</h4>
                <div className="space-y-2">
                  {newWorkout.exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg"
                    >
                      <span className="text-surface-900 dark:text-white">{exercise.name}</span>
                      <button
                        onClick={() => removeExerciseFromWorkout(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise Library */}
            <div className="mb-6">
              <h4 className="font-medium text-surface-900 dark:text-white mb-3">Add Exercises</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {exercises.slice(0, 8).map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => addExerciseToWorkout(exercise)}
                    className="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">{exercise.name}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{exercise.category}</p>
                    </div>
                    <ApperIcon name="Plus" size={16} className="text-primary" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={createWorkout}
                className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Create Workout
              </button>
              <button
                onClick={() => setIsWorkoutBuilder(false)}
                className="px-6 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      {!activeWorkout && (
        <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-heading font-bold text-surface-900 dark:text-white">
              Quick Start
            </h3>
            <button
              onClick={() => setIsWorkoutBuilder(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Workout
            </button>
          </div>

          {quickStartWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickStartWorkouts.map((workout) => (
                <motion.div
                  key={workout.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-700 dark:to-surface-600 p-4 rounded-xl border border-surface-300 dark:border-surface-600"
                >
                  <h4 className="font-heading font-semibold text-surface-900 dark:text-white mb-2">
                    {workout.name}
                  </h4>
                  <p className="text-sm text-surface-600 dark:text-surface-300 mb-4">
                    {workout.exercises?.length || 0} exercises
                  </p>
                  <button
                    onClick={() => startWorkout(workout)}
                    className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <ApperIcon name="Play" size={16} className="inline mr-2" />
                    Start
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-surface-500 dark:text-surface-400">
              <ApperIcon name="Dumbbell" size={48} className="mx-auto mb-4" />
              <p>No workouts available. Create your first workout to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MainFeature