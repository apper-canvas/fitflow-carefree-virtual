import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Volume2, 
  VolumeX,
  Settings,
  Timer
} from 'lucide-react'
import TimerButton from '../atoms/TimerButton'
import timerService from '../../services/api/timerService'

const RestTimerModal = ({ isOpen, onClose, onTimerComplete }) => {
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedInterval, setSelectedInterval] = useState(60)
  const [customInterval, setCustomInterval] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  
  // Audio and preferences state
  const [preferences, setPreferences] = useState(null)
  const [availableSounds, setAvailableSounds] = useState([])
  const [predefinedIntervals, setPredefinedIntervals] = useState([])
  const [currentSound, setCurrentSound] = useState(null)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  
  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  // Refs
  const intervalRef = useRef(null)
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [prefs, sounds, intervals] = await Promise.all([
          timerService.getPreferences(),
          timerService.getAvailableSounds(),
          timerService.getPredefinedIntervals()
        ])
        
        setPreferences(prefs)
        setAvailableSounds(sounds)
        setPredefinedIntervals(intervals)
        setSelectedInterval(prefs.lastUsedInterval)
        setTimeRemaining(prefs.lastUsedInterval)
        setVolume(prefs.volume)
        setCurrentSound(sounds.find(s => s.id === prefs.preferredSound) || sounds[0])
      } catch (error) {
        console.error('Error loading timer data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (isOpen) {
      loadData()
    }
  }, [isOpen])
  
  // Timer logic
  const startTimer = useCallback(() => {
    if (timeRemaining <= 0) return
    
    setIsRunning(true)
    setIsPaused(false)
    
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          setIsPaused(false)
          playNotificationSound()
          onTimerComplete && onTimerComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [timeRemaining, onTimerComplete])
  
  const pauseTimer = useCallback(() => {
    setIsRunning(false)
    setIsPaused(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])
  
  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeRemaining(selectedInterval)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [selectedInterval])
  
  // Audio management
  const playNotificationSound = useCallback(() => {
    if (isMuted || !currentSound) return
    
    try {
      if (audioRef.current) {
        audioRef.current.volume = volume
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(e => console.warn('Audio play failed:', e))
      }
    } catch (error) {
      console.error('Error playing notification sound:', error)
    }
  }, [currentSound, volume, isMuted])
  
  const testSound = useCallback(() => {
    playNotificationSound()
  }, [playNotificationSound])
  
  // Interval management
  const handleIntervalChange = useCallback(async (newInterval) => {
    setSelectedInterval(newInterval)
    setTimeRemaining(newInterval)
    setShowCustomInput(false)
    setCustomInterval('')
    
    // Save preference
    if (preferences) {
      try {
        await timerService.updatePreference('lastUsedInterval', newInterval)
      } catch (error) {
        console.error('Error saving interval preference:', error)
      }
    }
  }, [preferences])
  
  const handleCustomIntervalSubmit = useCallback(() => {
    const customValue = parseInt(customInterval)
    if (customValue && customValue > 0 && customValue <= 3600) {
      handleIntervalChange(customValue)
    }
  }, [customInterval, handleIntervalChange])
  
  // Sound preference management
  const handleSoundChange = useCallback(async (sound) => {
    setCurrentSound(sound)
    if (preferences) {
      try {
        await timerService.updatePreference('preferredSound', sound.id)
      } catch (error) {
        console.error('Error saving sound preference:', error)
      }
    }
  }, [preferences])
  
  const handleVolumeChange = useCallback(async (newVolume) => {
    setVolume(newVolume)
    if (preferences) {
      try {
        await timerService.updatePreference('volume', newVolume)
      } catch (error) {
        console.error('Error saving volume preference:', error)
      }
    }
  }, [preferences])
  
  // Progress calculation
  const progress = selectedInterval > 0 ? ((selectedInterval - timeRemaining) / selectedInterval) * 100 : 0
  const circumference = 2 * Math.PI * 90 // radius = 90
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return
      
      switch (e.key) {
        case ' ':
          e.preventDefault()
          if (isRunning) {
            pauseTimer()
          } else {
            startTimer()
          }
          break
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            resetTimer()
          }
          break
        case 'Escape':
          onClose()
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, isRunning, startTimer, pauseTimer, resetTimer, onClose])
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-200">
            <div className="flex items-center space-x-3">
              <Timer className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-surface-800">
                Rest Timer
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <TimerButton
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                ariaLabel="Timer settings"
              >
                <Settings className="w-5 h-5" />
              </TimerButton>
              <TimerButton
                variant="ghost"
                size="sm"
                onClick={onClose}
                ariaLabel="Close timer"
              >
                <X className="w-5 h-5" />
              </TimerButton>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-surface-600">Loading timer...</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Timer Display */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-48 h-48">
                  {/* Progress Circle */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-surface-200"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className={`text-primary transition-all duration-1000 ease-linear ${
                        isRunning ? 'timer-progress' : ''
                      }`}
                      ref={progressRef}
                    />
                  </svg>
                  
                  {/* Time Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-4xl font-bold text-surface-800 timer-text ${
                      timeRemaining <= 10 ? 'animate-timer-pulse text-red-500' : ''
                    }`}>
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-sm text-surface-500 mt-1">
                      {timeRemaining === 0 ? 'Time\'s up!' : 
                       isRunning ? 'Running' : 
                       isPaused ? 'Paused' : 'Ready'}
                    </div>
                  </div>
                </div>
                
                {/* Timer Controls */}
                <div className="flex items-center space-x-4">
                  <TimerButton
                    variant="outline"
                    size="lg"
                    onClick={resetTimer}
                    ariaLabel="Reset timer"
                    disabled={timeRemaining === selectedInterval && !isRunning && !isPaused}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </TimerButton>
                  
                  <TimerButton
                    variant="primary"
                    size="xl"
                    onClick={isRunning ? pauseTimer : startTimer}
                    ariaLabel={isRunning ? 'Pause timer' : 'Start timer'}
                    disabled={timeRemaining === 0}
                    className="px-12"
                  >
                    {isRunning ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </TimerButton>
                  
                  <TimerButton
                    variant="outline"
                    size="lg"
                    onClick={() => setIsMuted(!isMuted)}
                    ariaLabel={isMuted ? 'Unmute notifications' : 'Mute notifications'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </TimerButton>
                </div>
              </div>
              
              {/* Interval Selection */}
              {!showSettings && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-surface-600" />
                    <h3 className="font-medium text-surface-800">Rest Duration</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {predefinedIntervals.map((interval) => (
                      <TimerButton
                        key={interval.value}
                        variant={selectedInterval === interval.value ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleIntervalChange(interval.value)}
                        disabled={isRunning}
                        className="text-center"
                      >
                        {interval.display}
                      </TimerButton>
                    ))}
                  </div>
                  
                  {/* Custom Interval */}
                  <div className="space-y-2">
                    <TimerButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCustomInput(!showCustomInput)}
                      disabled={isRunning}
                      className="w-full"
                    >
                      Custom Duration
                    </TimerButton>
                    
                    {showCustomInput && (
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          min="1"
                          max="3600"
                          placeholder="Seconds"
                          value={customInterval}
                          onChange={(e) => setCustomInterval(e.target.value)}
                          className="flex-1 px-3 py-2 border border-surface-300 rounded-lg focus-ring"
                          disabled={isRunning}
                        />
                        <TimerButton
                          variant="primary"
                          size="sm"
                          onClick={handleCustomIntervalSubmit}
                          disabled={!customInterval || isRunning}
                        >
                          Set
                        </TimerButton>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Settings Panel */}
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 border-t border-surface-200 pt-4"
                >
                  <h3 className="font-medium text-surface-800">Timer Settings</h3>
                  
                  {/* Sound Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-700">
                      Notification Sound
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSounds.map((sound) => (
                        <TimerButton
                          key={sound.id}
                          variant={currentSound?.id === sound.id ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handleSoundChange(sound)}
                          className="text-xs"
                        >
                          {sound.name}
                        </TimerButton>
                      ))}
                    </div>
                    <TimerButton
                      variant="ghost"
                      size="sm"
                      onClick={testSound}
                      className="w-full"
                      disabled={isMuted}
                    >
                      Test Sound
                    </TimerButton>
                  </div>
                  
                  {/* Volume Control */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-surface-700">
                      Volume: {Math.round(volume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-full"
                      disabled={isMuted}
                    />
                  </div>
                </motion.div>
              )}
              
              {/* Keyboard Shortcuts */}
              <div className="text-xs text-surface-500 border-t border-surface-200 pt-4">
                <p className="font-medium mb-1">Keyboard Shortcuts:</p>
                <p>Space: Play/Pause • Ctrl+R: Reset • Esc: Close</p>
              </div>
            </div>
          )}
          
          {/* Audio Element */}
          {currentSound && (
            <audio
              ref={audioRef}
              src={currentSound.file}
              preload="auto"
              className="sr-only"
            />
          )}
          
          {/* Screen Reader Announcements */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {timeRemaining === 0 && 'Rest timer completed'}
            {isRunning && 'Timer is running'}
            {isPaused && 'Timer is paused'}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default RestTimerModal