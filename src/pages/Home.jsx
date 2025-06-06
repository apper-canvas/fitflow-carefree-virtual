import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import workoutService from '../services/api/workoutService'
import exerciseService from '../services/api/exerciseService'
import progressService from '../services/api/progressService'
import { format, startOfWeek, endOfWeek, isToday, parseISO } from 'date-fns'
import WorkoutBuilder from '@/components/organisms/WorkoutBuilder'

const Home = ({ darkMode, toggleDarkMode }) => {
  const [workouts, setWorkouts] = useState([])
  const [exercises, setExercises] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [activeSection, setActiveSection] = useState('dashboard')
const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false)
const [workoutBuilderLoading, setWorkoutBuilderLoading] = useState(false)
const [workoutBuilderError, setWorkoutBuilderError] = useState(null)

const newWorkoutButtonRef = useRef(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [workoutData, exerciseData, progressData] = await Promise.all([
          workoutService.getAll(),
          exerciseService.getAll(),
          progressService.getAll()
        ])
        setWorkouts(workoutData || [])
        setExercises(exerciseData || [])
        setProgress(progressData || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const weekStart = startOfWeek(new Date())
  const weekEnd = endOfWeek(new Date())
  
  const weeklyWorkouts = workouts.filter(workout => {
    if (!workout.completedDate) return false
    const workoutDate = parseISO(workout.completedDate)
    return workoutDate >= weekStart && workoutDate <= weekEnd
  })

  const todaysWorkout = workouts.find(workout => 
    workout.scheduledDate && isToday(parseISO(workout.scheduledDate))
  )

  const totalWorkoutsThisWeek = weeklyWorkouts.length
  const totalMinutesThisWeek = weeklyWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0)
  const currentStreak = progress.length > 0 ? 7 : 0

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'BarChart3' },
    { id: 'workouts', name: 'Workouts', icon: 'Dumbbell' },
    { id: 'exercises', name: 'Exercises', icon: 'Activity' },
    { id: 'progress', name: 'Progress', icon: 'TrendingUp' }
  ]
const recentExercises = exercises.slice(0, 6)

// Handle New Workout button click
const handleNewWorkout = async () => {
  try {
    setWorkoutBuilderLoading(true)
    setWorkoutBuilderError(null)
    setShowWorkoutBuilder(true)
    
    // Simulate initialization delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setWorkoutBuilderLoading(false)
    
    // Announce to screen readers
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('class', 'sr-only')
    announcement.textContent = 'Workout Builder loaded successfully'
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
    
  } catch (error) {
    console.error('Error initializing Workout Builder:', error)
    setWorkoutBuilderError('Failed to load Workout Builder. Please try again.')
    setWorkoutBuilderLoading(false)
    toast.error('Failed to load Workout Builder')
  }
}

// Handle closing Workout Builder
const handleWorkoutBuilderClose = () => {
  setShowWorkoutBuilder(false)
  setWorkoutBuilderError(null)
  setWorkoutBuilderLoading(false)
  
  // Return focus to the button that opened the builder
  if (newWorkoutButtonRef.current) {
    newWorkoutButtonRef.current.focus()
  }
}

// Handle successful workout creation
const handleWorkoutCreated = (newWorkout) => {
  // Add the new workout to the local state
  setWorkouts(prevWorkouts => [newWorkout, ...prevWorkouts])
  
  // Show success message
  toast.success('Workout created successfully!')
  
  // Close the builder
  handleWorkoutBuilderClose()
}

// Handle retry when Workout Builder fails to load
const handleRetryWorkoutBuilder = () => {
  setWorkoutBuilderError(null)
  handleNewWorkout()
}

if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-4" />
          <p>Error loading data: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-xl">
                <ApperIcon name="Dumbbell" size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-heading font-bold text-surface-900 dark:text-white">
                FitFlow Pro
              </h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/50 dark:bg-surface-800/50 backdrop-blur-lg border-r border-surface-200 dark:border-surface-700 min-h-screen p-6">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-primary via-primary-dark to-secondary p-6 rounded-2xl text-white">
                <h2 className="text-2xl font-heading font-bold mb-2">Good Morning, Champion!</h2>
                <p className="text-primary-light mb-4">Ready to crush your fitness goals today?</p>
                {todaysWorkout && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Today's Workout</h3>
                    <p className="text-sm">{todaysWorkout.name}</p>
                    <p className="text-xs text-primary-light mt-1">
                      {todaysWorkout.exercises?.length || 0} exercises
                    </p>
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary/20 p-3 rounded-xl">
                      <ApperIcon name="Calendar" size={24} className="text-primary" />
                    </div>
                    <span className="text-2xl font-bold text-surface-900 dark:text-white">
                      {totalWorkoutsThisWeek}
                    </span>
                  </div>
                  <p className="text-surface-600 dark:text-surface-300 font-medium">Workouts This Week</p>
                </div>

                <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-secondary/20 p-3 rounded-xl">
                      <ApperIcon name="Clock" size={24} className="text-secondary" />
                    </div>
                    <span className="text-2xl font-bold text-surface-900 dark:text-white">
                      {totalMinutesThisWeek}
                    </span>
                  </div>
                  <p className="text-surface-600 dark:text-surface-300 font-medium">Minutes Trained</p>
                </div>

                <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-accent/20 p-3 rounded-xl">
                      <ApperIcon name="Flame" size={24} className="text-orange-500" />
                    </div>
                    <span className="text-2xl font-bold text-surface-900 dark:text-white">
                      {currentStreak}
                    </span>
                  </div>
                  <p className="text-surface-600 dark:text-surface-300 font-medium">Day Streak</p>
                </div>
              </div>

              {/* Main Feature Component */}
              <MainFeature 
                workouts={workouts} 
                setWorkouts={setWorkouts}
                exercises={exercises}
              />
            </motion.div>
          )}

          {activeSection === 'workouts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
<h2 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
                  My Workouts
                </h2>
                <button 
                  ref={newWorkoutButtonRef}
                  onClick={handleNewWorkout}
                  aria-label="Create a new workout using the Workout Builder"
                  className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all focus-ring"
                >
                  <ApperIcon name="Plus" size={20} className="inline mr-2" />
                  New Workout
                </button>
              </div>

              {/* Workout Builder Section */}
              {showWorkoutBuilder && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                  role="region"
                  aria-label="Workout Builder Interface"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-heading font-bold text-surface-900 dark:text-white">
                      Workout Builder
                    </h3>
                    <button
                      onClick={handleWorkoutBuilderClose}
                      aria-label="Close Workout Builder and return to workouts list"
                      className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors focus-ring"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>

                  {workoutBuilderLoading && (
                    <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-surface-600 dark:text-surface-300">
                          Initializing Workout Builder...
                        </p>
                        <span className="sr-only">Loading Workout Builder interface</span>
                      </div>
                    </div>
                  )}

                  {workoutBuilderError && (
                    <div className="text-center py-12" role="alert">
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                        <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-4 text-red-500" />
                        <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                          Unable to Load Workout Builder
                        </h4>
                        <p className="text-red-600 dark:text-red-300 mb-4">
                          {workoutBuilderError}
                        </p>
                        <button
                          onClick={handleRetryWorkoutBuilder}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus-ring"
                          aria-label="Retry loading the Workout Builder"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}

                  {!workoutBuilderLoading && !workoutBuilderError && (
                    <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                      <WorkoutBuilder
                        exercises={exercises}
                        onWorkoutCreated={handleWorkoutCreated}
                        onClose={handleWorkoutBuilderClose}
                      />
                    </div>
                  )}
                </motion.div>
              )}

{/* Regular Workouts List - Hidden when Workout Builder is active */}
              {!showWorkoutBuilder && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-semibold text-surface-900 dark:text-white">
                          {workout.name}
                        </h3>
                        <div className={`p-2 rounded-lg ${workout.completedDate ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                          <ApperIcon name={workout.completedDate ? 'CheckCircle' : 'Clock'} size={16} />
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-surface-600 dark:text-surface-300">
                        <p>{workout.exercises?.length || 0} exercises</p>
                        {workout.duration && <p>{workout.duration} minutes</p>}
                        {workout.scheduledDate && (
                          <p>Scheduled: {format(parseISO(workout.scheduledDate), 'MMM dd')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'exercises' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
                  Exercise Library
                </h2>
                <button className="bg-gradient-to-r from-secondary to-secondary-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                  <ApperIcon name="Plus" size={20} className="inline mr-2" />
                  Add Exercise
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-semibold text-surface-900 dark:text-white">
                        {exercise.name}
                      </h3>
                      <div className="bg-primary/20 p-2 rounded-lg">
                        <ApperIcon name="Activity" size={16} className="text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="inline-block bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-medium">
                        {exercise.category}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {exercise.muscleGroups?.map((muscle, index) => (
                          <span
                            key={index}
                            className="text-xs bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 px-2 py-1 rounded"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'progress' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
                Progress Overview
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                  <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-4">
                    Weekly Workout Progress
                  </h3>
                  <div className="h-48 flex items-center justify-center text-surface-500 dark:text-surface-400">
                    <div className="text-center">
                      <ApperIcon name="BarChart3" size={48} className="mx-auto mb-2" />
                      <p>Progress chart coming soon</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                  <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-4">
                    Body Measurements
                  </h3>
                  <div className="space-y-4">
                    {progress.length > 0 ? (
                      progress.slice(0, 3).map((entry, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-surface-600 dark:text-surface-300">
                            {format(parseISO(entry.date), 'MMM dd')}
                          </span>
                          <span className="font-medium text-surface-900 dark:text-white">
                            {entry.weight}kg
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-surface-500 dark:text-surface-400">
                        <ApperIcon name="Scale" size={32} className="mx-auto mb-2" />
                        <p>No progress data yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home