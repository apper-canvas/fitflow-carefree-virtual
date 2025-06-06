import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import workoutService from '@/services/api/workoutService';

const ActiveWorkoutTimer = ({ activeWorkout, setActiveWorkout, setWorkouts }) => {
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isTimerActive) {
            interval = setInterval(() => {
                setTimeElapsed(timeElapsed => timeElapsed + 1);
            }, 1000);
        } else if (!isTimerActive && timeElapsed !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeElapsed]);

    useEffect(() => {
        if (activeWorkout) {
            setTimeElapsed(0);
            setCurrentExerciseIndex(0);
            setIsTimerActive(true);
        }
    }, [activeWorkout]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return hours > 0
            ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            : `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const pauseWorkout = () => {
        setIsTimerActive(!isTimerActive);
        toast.info(isTimerActive ? 'Workout paused' : 'Workout resumed');
    };

    const nextExercise = () => {
        if (activeWorkout && currentExerciseIndex < (activeWorkout.exercises?.length || 0) - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            toast.info('Moving to next exercise');
        }
    };

    const completeWorkout = async () => {
        if (activeWorkout) {
            try {
                const updatedWorkout = {
                    ...activeWorkout,
                    completedDate: new Date().toISOString(),
                    duration: Math.floor(timeElapsed / 60)
                };
                
                await workoutService.update(activeWorkout.id, updatedWorkout);
                setWorkouts(prevWorkouts => 
                    prevWorkouts.map(w => w.id === activeWorkout.id ? updatedWorkout : w)
                );
                
                setActiveWorkout(null);
                setIsTimerActive(false);
                setTimeElapsed(0);
                setCurrentExerciseIndex(0);
                toast.success('Workout completed! Great job!');
            } catch (error) {
                toast.error('Failed to complete workout');
            }
        }
    };

    return (
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
                        <Button
                            onClick={() => {
                                setActiveWorkout(null);
                                setIsTimerActive(false);
                                setTimeElapsed(0);
                            }}
                            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                        >
                            <ApperIcon name="X" size={20} />
                        </Button>
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
                        <Button
                            onClick={pauseWorkout}
                            className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                        >
                            <ApperIcon name={isTimerActive ? 'Pause' : 'Play'} size={20} className="mr-2" />
                            {isTimerActive ? 'Pause' : 'Resume'}
                        </Button>
                        {currentExerciseIndex < (activeWorkout.exercises?.length || 0) - 1 && (
                            <Button
                                onClick={nextExercise}
                                className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                            >
                                <ApperIcon name="SkipForward" size={20} className="mr-2" />
                                Next Exercise
                            </Button>
                        )}
                        <Button
                            onClick={completeWorkout}
                            className="flex items-center px-4 py-2 bg-green-500/80 rounded-lg hover:bg-green-500 transition-colors"
                        >
                            <ApperIcon name="CheckCircle" size={20} className="mr-2" />
                            Complete
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ActiveWorkoutTimer;